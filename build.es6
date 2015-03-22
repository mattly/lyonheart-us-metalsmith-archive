const fs = require('fs');
const path = require('path');
const R = require('ramda');

const assetChain = [
  require('metalsmith-sass')({
    outputStyle: 'expanded',
    includePaths: require('node-bourbon').includePaths.concat(require('node-neat').includePaths)
  }),
  require('./support/css_inline_urls')(),
  require('metalsmith-coffee')(),
  require('metalsmith-fingerprint')({pattern:'assets/*'}),
];

const ignore = require('metalsmith-ignore');

const template = require('./support/templates');
var templateHelpers = {
  formatDate: (date, format) => { require('moment')(date).format(format); }
}
const docChain = [
  ignore(['**/.DS_Store']),
  require('./support/yamlstubs.es6')(),
  require('./support/parseMarkdownSections')(),
  require('metalsmith-multimarkdown')(),
  require('./support/footnotes')(),
  ignore(['**/__markdown__sections__/**']),
  require('metalsmith-collections')({
    articles: {
      pattern: 'articles/*/index.html',
      sortBy: 'date',
      reverse: true
    }
  }),
  require('./support/siblings')(),
  require('./support/set_url')(),

  template({
    helpers: templateHelpers,
    localContext: (page, context) => {
      context.page = R.clone(page);
      context.content = page.contents.toString();
      context.page.sections = R.mapObj(section => {
        var {id, title, contents, isFooter} = section;
        var content = contents.toString();
        return {id, title, isFooter, content };
      }, page.sections);
    },
    afterRender: (p, r) => { p.innerContents = r; }
  }),
  template({
    directory: 'layouts',
    helpers: templateHelpers,
    key: (p => p.layout || "default"),
    filter: (([f,p]) => f.match(/\.html$/))
  }),
  require('./support/typogr')(),
  ignore(['templates/**', 'layouts/**']),
  require('./support/feeds')({
    collections: {
      articles: {
        path: 'index.xml'
      }
    }
  })
];

var gen = require('metalsmith')(__dirname)
  .source('contents')
  .destination('build')

gen.metadata({site: {
  url: 'http://lyonheart.us',
  name: "lyonheart.us",
  owner: "Matthew Lyon",
  description: "writings on engineering and art by Matthew Lyon",
  github_modifications_base: "https://github.com/mattly/lyonheart.us/commits/master/contents",
  links: [
    {icon: 'envelope', href: 'mailto: matthew@lyonheart.us', title: 'Email'},
    {icon: 'rss', href: '/index.xml', title: 'RSS Feed'},
    {icon: 'tweeter', href: 'https://twitter.com/mattly', title: 'Twitter'},
    {icon: 'github', href: 'https://github.com/mattly', title: 'GitHub'},
    {icon: 'soundcloud', href: 'https://soundclould.com/matthewlyonheart', title: 'SoundCloud'},
    {icon: 'linkin', href: 'https://www.linkedin.com/in/mattly', title: 'LinkedIn'}
  ]
}})

assetChain
  .concat(docChain)
  .forEach(plugin => gen.use(plugin))

var build = (cb) => gen.build(cb);
if (process.env.DEV) {

  const nStatic = require('node-static');
  const chalk = require('chalk')
  const file = new nStatic.Server('./build');
  const server = require('http').createServer(function(request, response){
    response._end = response.end
    response.end = function(...args) {
      response._end(...args);
      console.log(`${chalk.cyan(response.statusCode)} ${request.method} ${request.url}`)
    }
    request.addListener('end', function(){ file.serve(request, response); }).resume();
  }).listen(process.env.DEV);

  const builder = function(){
    build(function(e){
      if (e) {
        console.log(e);
        console.log(Object.keys(e));
      }
    });
  }
  var ready = false;
  require('chokidar').watch('**/*', { cwd: 'contents' })
    .on('ready', function(){
      console.log(`${chalk.cyan("Watching for Changes")}`);
      ready = true
    })
    .on('all', function(event, filepath){
      if (ready) {
        console.log(`${event}: ${chalk.cyan(filepath)}`);
        console.log(chalk.green("rebuilding!"))
        builder();
      }
    })
    .on('error', function(err){
      console.log(`${chalk.red(err)}`)
      console.log(err.stack)
    });
  builder();
} else {
  build(function(e) {
    if(e) { throw(e); }
    else { console.log("done!"); }
  });
}

