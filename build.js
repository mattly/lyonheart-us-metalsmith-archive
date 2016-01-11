const buildDir = 'build'
const sourceDir = 'contents'

import fs from 'mz/fs'
import path from 'path'

const promisify = function(fn, context) {
  return function(...args) {
    return new Promise(function(resolve, reject){
      fn.apply(context, args.concat(function(err, ...result) {
        if (err) reject(err)
        else if (result.length === 1) resolve(result[0])
        else resolve(result)
      }))
    })
  }
}

const rm = promisify(require('rimraf'))
const chalk = require('chalk');

const metalsmith = require('metalsmith');

const moment = require('moment');
const objectPath = require('object-path');


var templateHelpers = {
  formatDate: (date, format) => {
    return moment(new Date(date)).format(format);
  },
  isoDate: (date) => {
    return moment(new Date(date)).toISOString();
  },
  siblings: (pages, page) => {
    let dirname = path.dirname(page.path);
    let ret = {}
    Object.keys(pages)
      .filter(filepath => path.dirname(filepath) == dirname)
      .forEach(filepath => ret[path.basename(filepath)] = pages[filepath])
    return ret;
  }
}

function clone(obj) {
  return Object.keys(obj).reduce(function(prev, key){
      if (typeof obj[key] === "object") {
          prev[key] = clone(obj[key]);
      } else {
          prev[key] = obj[key];
      }
    return prev;
  }, {});
}

function envGet (env, p, fallback) { return objectPath.get(env, p.replace(/\//g, '.', fallback))}
function envSet (env, p, value) { return objectPath.set(env, p.replace(/\//g, '.', value))}

const args = process.argv.slice(2)

let prod = args.indexOf('prod') > -1
let useServer = args.indexOf('server') > -1
console.log('isProd', prod)
console.log('useServer', useServer)


const chain = []

import ignore from 'metalsmith-ignore'
chain.push(ignore(['**/.*']))

import drafts from './support/drafts'
chain.push(drafts())

chain.push(function(files, ms, done){
    let lastDate = new Date(1970,1,1)
    Object.keys(files).forEach(function (file) {
        let page = files[file]
        if (page.date && page.date > lastDate) lastDate = page.date
    })
    ms.metadata().site.lastPublished = lastDate
    done()
})

chain.push(require('metalsmith-placeholder')())

import loze from './support/loze'
const lozer = loze()
          .define('newthought', (tag) => `<span class="newthought">${tag.content}</span>`)
          .define('def', function lozedef (tag, env) {
              envSet(env, tag.id, tag.content)
          })
          .define('val', function lozeval (tag, env) { return envGet(env, tag.id) })
          .define('with-aside', (tag) => `<div class='aside-container'>\n\n${tag.content}\n\n</div>`)
          .define('aside', function lozeAside (tag, env) {
              return `<aside>\n\n${tag.content}\n\n</aside>`
          })
          .define('math', function lozeMath (tag, env) {
              return require('katex').renderToString(tag.content)
          })
          .define('date', function lozeDate (tag, env) {
              return `<time>${moment(envGet(env, tag.id)).format(tag.attr)}</time>`
          })
          .define('include', function lozeInclude (tag, env) {
              let givenPath = tag.attr,
                  includePath, contents
              if (givenPath.match(/^\./)) includePath = path.resolve(sourceDir, env.dirname, givenPath)
              else if (givenPath.match(/^\//)) includePath = path.resolve(sourceDir, givenPath)
              else includePath = path.resolve(sourceDir, '_includes', givenPath)

              try {
                  contents = fs.readFileSync(includePath).toString()
              } catch (e) {
                  console.error(`◊include ${tag.attr} not found at ${includePath}`)
                  contents = ''
              }
              return contents
          })
          .define('quote', function (tag) {
              let quote = tag.content.trim().split("\n").map(line => `> ${line}`).join("\n")
              return `<div class="epigraph">\n\n${quote}\n\n</div>`
          })
          .define('quote-source', (tag) => `<span class="quote-source">${tag.content}</span>`)
          .define('banner-header', function(tag) {
              let classes = ['article-header', 'article-header-banner'].join(' '),
                  styles = [`background-image: url('${tag.attr.image || 'banner.jpg'}')`,
                            (tag.attr.imageStyle || '')].join(';')
              return [`<header class="${classes}" style="${styles}">`,
                      `<div class="info ${tag.attr.textClass || ''}">`,
                      '', tag.content, '',
                      '</div>', '</header>'].join('\n')
          })
          .define('highlight', function(tag){
              let klass = ['highlight', tag.attr.color, tag.attr.fg ? 'fg' : 'bg'].join('-')
              return `<span class="${klass}">${tag.content}</span>`
          })
          .define('video', function(tag){
              return `<iframe width=${tag.attr.width} height=${tag.attr.height} src="https://www.youtube.com/embed/${tag.attr.youtube}" frameborder=0 allowfullscreen></iframe>`
          })
          .define('wide-container',
            (tag) => `<div class="column-container full-width">${tag.content}</div>`)
          .define('column', (tag) => `<div class="column-1">${tag.content}</div>`)


chain.push(
    function(files, ms, done){
        Object.keys(files)
            .filter((file) => path.extname(file).match(/\.(md|markdown|html|css)/))
            .forEach(function (file) {
                let page = files[file],
                    thisPage = {site: clone(ms.metadata().site)}
                thisPage.page = page
                let result = lozer.render(page.contents.toString(), thisPage)
                page.contents = new Buffer(result)
            })
        done()
    })

import md from 'metalsmith-markdownit'
import section from './support/markdown-section'

chain.push(md('commonmark', { typographer: true })
           .enable('strikethrough')
           .enable('table')
           .use(section))

chain.push(require('metalsmith-collections')({
    articles: {
        pattern: 'articles/*/index.html',
        sortBy: 'date',
        reverse: true
    },
    talks: {
        pattern: 'talks/*/index.html',
        sortBy: 'date',
        reverse: true
    },
    drafts: {
        pattern: 'drafts/*/index.html',
        sortBy: 'date',
        reverse: true
    }
}))

chain.push(
    function(files, ms, done){
        let processor = require('postcss')([
            require('postcss-import')({
                resolve: function(f, info){
                    if (/^node_modules\//.test(f)) {return f;}
                    let delta = path.relative(process.cwd(), info.basedir);
                    return path.join(process.cwd(), sourceDir, delta, f);
                }}),
            require('precss')(),
            require('postcss-assets')({
                loadPaths: ['contents/assets/fonts/',
                            'contents/assets/']
            }),
            require('autoprefixer'),
            require('postcss-nested'),
            require('postcss-nested-props'),
            require('cssnext')({import: false})
        ]);
        let results = [];
        Object.keys(files)
            .filter(f => /\.css$/.test(f))
            .forEach(css => {
                let dirname = path.dirname(css),
                    basename = path.basename(css, '.css'),
                    source = path.join(dirname, `${basename}_source.css`),
                    dest = css,
                    file = files[css],
                    newFile = clone(file),
                    pResult = processor.process(file.contents, { from: source, to: dest })
                        .then(r => {
                            newFile.contents = new Buffer(r.css);
                            files[css] = newFile;
                        });
                results.push(pResult);
            });
        Promise.all(results).then(() => done()).catch(done);
    }
)

import * as babel from 'babel-core'
// let babel = require('babel-core')
chain.push(function(files, ms, done){
    Object.keys(files)
        .filter((f) => f.match(/^assets.+\.js$/))
        .forEach(function(file) {
            let { code, map, ast } = babel.transform(files[file].contents.toString(),
                                                     { presets: ['stage-0', 'es2015']})
            files[file].contents = new Buffer(code)
        })
    done()
})


chain.push(function(files, ms, done){
    let md = ms.metadata()
    Object.keys(files)
        .forEach(file => {
            let page = files[file]
            page.url = file.replace(/index\.html$/, '')
            page.slug = path.basename(page.url)
            page.full_url = `${md.site.url}/${page.url}`
        })
    done();
})

import rss from './support/rss'
chain.push(rss({
    sources: ['articles'],
    output: 'index.xml'
}))

import template from './support/templates'
// migrate templates outside of contents dir?
chain.push(template({
    helpers: templateHelpers,
    key: (p => p.template || "default"),
    filter: (([f,p]) => f.match(/\.html$/))
}))

import typogr from './support/typogr'
chain.push(typogr())


chain.push(ignore(['_*/**', '**/_*']))

let metadata = {
    site: {
        owner: 'Matthew Lyon',
        name: 'lyonheart.us',
        url: 'http://lyonheart.us',
        description: '',
        github_modifications_base: "https://github.com/mattly/lyonheart.us/commits/master/contents",
        links: [
            {icon: 'envelope', href: 'mailto:matthew@lyonheart.us', title: 'Email'},
            {icon: 'rss', href: '/index.xml', title: 'RSS Feed'},
            {icon: 'tweeter', href: 'https://twitter.com/mattly', title: 'Twitter'},
            {icon: 'github', href: 'https://github.com/mattly', title: 'GitHub'},
            {icon: 'camera', href: 'https://500px.com/lyonheart', title: '500px (photos)'},
            {icon: 'igram', href: 'https://www.instagram.com/matthewlyonheart/', title: 'Instagram'},
            {icon: 'music', href: 'https://soundclould.com/matthewlyonheart', title: 'SoundCloud'},
            {icon: 'pins', href: 'https://pinterest.com/mattly', title: 'Pinterest'},
            {icon: 'linkin', href: 'https://www.linkedin.com/in/mattly', title: 'LinkedIn'},
            {icon: 'slides', href: 'https://speakerdeck.com/mattly', title: 'SpeakerDeck'}
        ]
    },
    env: { dev: ! prod, prod: prod }
}

console.log(Object.keys(metadata))

chain.unshift(function(files, ms, done){
    ms.metadata(metadata)
    done()
})

if (useServer) {
    chain.push(require('metalsmith-browser-sync')({
        server: buildDir,
        files: ['contents/**', 'templates/**'],
        open: false
    }))
}

const build = async function () {
  console.log(`${chalk.yellow('building')}`)
  let gen = metalsmith(__dirname)
          .source(sourceDir)
          .destination(buildDir)
          .metadata(metadata)
          .ignore(['**/.*'])
          .clean(false);
  chain.forEach(plugin => gen.use(plugin))
  return await promisify(gen.build, gen)()
}


async function clean () {
  console.log(`${chalk.red('cleaning build dir')}: ${buildDir}`)
  return await rm(buildDir)
}

(async function () {
  try {
    await clean()
    await build()
    console.log(`${chalk.green('done')}`)
  } catch (err) {
    console.error(`${chalk.red('error:')} ${err}`)
    console.error(err.stack)
  }
}())
