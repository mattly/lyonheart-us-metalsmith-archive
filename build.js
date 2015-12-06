const buildDir = 'build';
const sourceDir = 'contents';

const fs = require('mz/fs');
const path = require('path');

var invokings = 0;

const promisify = function(fn, context) {
  return function(...args) {
    invokings += 1;
    let ident = invokings;
    return new Promise(function(resolve, reject){
      fn.apply(context, args.concat(function(err, ...result) {
        if (err) {
          reject(err);
        }
        else if (result.length === 1) {
          resolve(result[0]);
        }
        else {
          resolve(result);
        }
      }));
    });
  };
};
const rm = promisify(require('rimraf'))
const chalk = require('chalk');

const metalsmith = require('metalsmith');
const ignore = require('metalsmith-ignore');

const moment = require('moment');
// const template = require('./support/templates');
import template from './support/templates';
import sections from './support/sections';
import section from './support/markdown-section';
import newthought from './support/markdown-newthought';
import atblocks from './support/at-blocks';
import typogr from './support/typogr';

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
    prev[key] = obj.key;
    return prev;
  }, {});
}

const docChain = [
  ignore(['**/.DS_Store']),
    ignore(['articles/**', 'talks/**']),

  function(files, ms, done){
    let processor = require('postcss')([
        require('postcss-import')({
            resolve: function(f, info){
                if (/^node_modules\//.test(f)) {return f;}
                let delta = path.relative(process.cwd(), info.basedir);
                return path.join(process.cwd(), sourceDir, delta, f);
            }}),
        require('postcss-assets')({
            loadPaths: ['contents/assets/fonts/']
        }),
        require('autoprefixer'),
        require('postcss-nested'),
        require('postcss-nested-props'),
        require('cssnext')({import: false}),
        require('precss')()
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
                // let map = clone(file)
                // map.contents = new Buffer(r.map.toString());
                // files[`${css}.map`] = map;
              });

        files[source] = file;
        results.push(pResult);
      });
    Promise.all(results).then(() => done()).catch(done);
  },

  require('metalsmith-placeholder')(),
    require('metalsmith-markdownit')('commonmark', {
        typographer: true
    })
        .enable('strikethrough')
        .enable('table')
        .use(require('markdown-it-math'), {
            inlineRenderer: require('katex').renderToString
        })
        .use(section)
        .use(atblocks, {
            tags: [
                atblocks.inline('newthought',
                                {render: (t) => `<span class="newthought">${t.content}</span>`}),
                atblocks.inline('note-marker'),
                atblocks.block('note-content',
                               {onReconcile: function (state, tag){
                                   let notes = {},
                                       insideNote = false,
                                       current, currentId;
                                   state.tokens = state.tokens.filter((tok) => {
                                       if (tok.type === tag.type) {
                                           insideNote = true;
                                           currentId = tok.meta.id;
                                           current = [];
                                           return false;
                                       }
                                       else if (tok.type === `${tag.type}-close`) {
                                           insideNote = false;
                                           notes[currentId] = current;
                                           return false;
                                       }
                                       else if (insideNote) {
                                           current.push(tok);
                                           return false;
                                       }
                                       else { return true; }
                                   });
                                   Object.keys(notes).forEach((noteId) => {
                                       state.tokens
                                           .filter((t) => t.type === 'inline' )
                                           .forEach((inline) => {
                                               let thisIndex = inline.children.findIndex(
                                                   (t) => t.type === '◊note-marker' && t.meta.id === noteId)
                                               if (thisIndex < 0) { return; }
                                               let marker = inline.children[thisIndex],
                                                   newTokens = [], token;
                                               token = new state.Token('label-open', 'label', 1)
                                               token.content = marker.content;
                                               token.attrs = [['for', `note-${noteId}`],
                                                              ['class', 'note__marker']]
                                               if (!token.content || token.content.length > 0) {
                                                   token.attrs[1][1] += ' note__marker--empty'
                                               }
                                               newTokens.push(token);
                                               newTokens.push(new state.Token('label-close', 'label', -1))
                                               token = new state.Token('input', 'input', 0)
                                               token.attrs = [['type', 'checkbox'],
                                                              ['id', `note-${noteId}`], ['class', 'note__toggle']]
                                               newTokens.push(token);
                                               token = new state.Token('note_content_open', 'span', 1);
                                               token.attrs = [['class', 'note__content']];
                                               token.block = true;
                                               newTokens.push(token);

                                               token = new state.Token('inline', '', 0);
                                               token.children = notes[noteId];
                                               token.content = '';
                                               notes[noteId].filter((t) => t.type === 'inline')
                                                   .forEach((t) => newTokens = newTokens.concat(t.children))

                                               token = new state.Token('note_content_close', 'span', -1);
                                               token.block = true;
                                               newTokens.push(token)

                                               inline.children.splice.apply(inline.children, [thisIndex, 0].concat(newTokens))
                                           });

                                       if (false) {
                                       }
                                   });
                               }
                               }),
                atblocks.inline('def',
                               {onCapture: function(t, env){
                                   if (!env.vars) { env.vars = {}; }
                                   env.vars[t.meta.id] = t.content}}),
                atblocks.inline('var',
                                {render: (t, env) => env.vars[t.meta.id] })
            ]
        }),
  require('metalsmith-collections')({
    articles: {
      pattern: 'articles/*/index.html',
      sortBy: 'date',
      reverse: true
    }
  }),

    typogr(),
  // set page variables
  function(files, ms, done){
    Object.keys(files)
      .forEach(file => {
        files[file].path = file;
      })
    done();
  },
  // migrate templates outside of contents dir?
  template({
    directory: 'layouts',
    helpers: templateHelpers,
    key: (p => p.layout || "default"),
    filter: (([f,p]) => f.match(/\.html$/))
  }),
  // feeds
  require('metalsmith-browser-sync')({
    server: buildDir,
    files: ['contents/**'],
    open: false
  })
];

const chain = docChain;

const build = async function () {
  console.log(`${chalk.yellow('building')}`);
  let gen = metalsmith(__dirname)
        .source(sourceDir)
        .destination(buildDir)
        .metadata({site: {links: []}})
        .clean(false);
  chain.forEach(plugin => gen.use(plugin));
  return await promisify(gen.build, gen)();
}

const args = process.argv.slice(2);

async function clean () {
  console.log(`${chalk.red('cleaning build dir')}: ${buildDir}`);
  return await rm(buildDir);
}

(async function () {
  try {
    await clean();
    await build();
    console.log(`${chalk.green('done')}`);
  } catch (err) {
    console.error(`${chalk.red('error:')} ${err}`)
    console.error(err.stack)
  }
}());
