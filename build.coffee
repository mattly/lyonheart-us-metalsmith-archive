fs = require('fs')
fs.mkdirSync('tmp')
path = require('path')

yaml = require('js-yaml')

# loads from "metadata.yml" onto "index.*"
metadataSidecar = (files, ms, done) ->
  for own fileName, data of files when path.basename(fileName).match(/^metadata\.yaml$/)
    metadata = yaml.safeLoad(data.contents.toString())
    dir = path.dirname(fileName)
    for own name, record of files when path.dirname(name) is dir and path.basename(name).match(/^index\./)
      for own key, value of metadata
        record[key] = value
    delete files[fileName]
  done()

# takes <ol> from .footnotes, makes it page.footnotes, removes ol
# also cleans up rel/rev attributes for links
cheerio = require('cheerio')
extractFootnotes = (files, metalsmith, done) ->
  for own file, data of files when path.extname(file).match(/^\.html$/)
    doc = cheerio.load(data.contents)
    footnotes = doc(".footnotes")
    if footnotes.length > 0
      theFootnote = footnotes.find('li').first()
      while theFootnote.length > 0
        theFootnote.find('a').last().attr('rev','footnote')
        theFootnote = theFootnote.next()
      data.footnotes = "<ol>#{footnotes.find('ol').html()}</ol>"
      footnotes.remove()
      doc('sup a.footnoteRef').attr('rel','footnote')
      data.contents = new Buffer(doc.html())
  done()

log = (files, ms, done) ->
  console.log(name, Object.keys(file), file.mode, file.contents.length) for name, file of files
  done()

nunjucks = require('nunjucks')
env = nunjucks.configure('templates')

moment = require('moment')
env.addFilter 'date_format', (date, format) -> moment(date).format(format)
env.addFilter 'date_rfc822', (date) -> moment(date).format("ddd, DD MMM YYYY HH:mm:ss ZZ")

# converts .(md|markdown) to html via pandoc
{exec} = require('child_process')
pandoc = (files, ms, done) ->
  converts = (f for own f, p of files when path.extname(f).match(/^\.(md|markdown)$/))
  convert = (filePath, cb) ->
    htmlPath = filePath.replace(/\.(md|markdown)$/, '.html')
    exec "pandoc -t html5 --smart --ascii contents/#{filePath}", (err, stdout, stderr) ->
      if err then throw err
      files[htmlPath] = files[filePath]
      files[htmlPath].contents = new Buffer(stdout)
      delete files[filePath]
      cb()
  next = ->
    if converts.length then convert(converts.shift(), next)
    else done()
  next()

typogr = require('typogr')
smart = (files, ms, done) ->
  for own filePath, page of files when path.extname(filePath) is '.html'
    page.contents = new Buffer(typogr.typogrify(page.contents.toString()))
  done()

setUrl = (files, ms, done) ->
  for filePath, page of files
    page.url = filePath.replace(/^\.\//,'').replace(/\/index\.html$/,'')
    page.full_url = "#{site.url}/#{page.url}"
  done()

renderNunjucksTemplates = (files, ms, done) ->
  { collections, fingerprint } = ms.metadata()
  toRender = (f for f, p of files when f.match(/\.(html|xml)$/))
  segmentComparator = (one, two) ->
    oneLength = one.split('/').length
    twoLength = two.split('/').length
    if oneLength > twoLength then return -1
    if oneLength is twoLength then return 0
    return 1
  toRender.sort(segmentComparator)
  for filePath in toRender
    page = files[filePath]
    vars = { page, site, collections, fingerprint }
    output = if page.template then nunjucks.render(page.template, vars)
    else nunjucks.renderString(page.contents.toString(), vars)
    page.contents = new Buffer(output)
  done()

siblings = (files, ms, done) ->
  for own filePath, page of files
    dir = path.dirname(filePath)
    page.siblings = {}
    for sibling in Object.keys(files) when sibling.match(///^#{dir}\/[^\/]+$///)
      page.siblings[path.basename(sibling)] = files[sibling]
  done()

includeSiblings = (files, ms, done) ->
  for own filePath, page of files
    dir = path.dirname(filePath)
    if dir.match(/^articles\//) and path.basename(filePath).match(/^index\.html/)
      for own otherFile, data of files when path.dirname(otherFile) is dir and otherFile isnt filePath and path.extname(otherFile) is '.html'
        key = path.basename(otherFile, path.extname(otherFile))
        page[key] = data.contents.toString()
        if key is 'body' then page.footnotes = data.footnotes
        delete files[otherFile]
  done()

Imagemin = require('imagemin')
base64Icons = (files, ms, done) ->
  icons = []
  iconFiles = []
  parsedIcons = 0
  for own filePath, data of files when filePath.match(/\/icons\/[^/]+\.svg/)
    iconFiles.push({filePath, data})
  for icon in iconFiles
    do (icon) ->
      name = path.basename(icon.filePath, '.svg')
        .replace(/\W+/g,'_').replace(/_+/g,'-')
        .replace(/^-/,'').replace(/-$/,'')
      new Imagemin().src(icon.data.contents).run (e, files) ->
        data = files[0].contents.toString('base64')
        icons.push(".icon-#{name} { background-image: url(data:image/svg+xml;base64,#{escape data}); background-repeat: no-repeat; }")
        parsedIcons += 1
        if parsedIcons == iconFiles.length
          fs.writeFileSync('tmp/_icons.scss', icons.join("\n"))
          done()

site =
  url: 'http://lyonheart.us'
  name: "lyonheart.us"
  owner: "Matthew Lyon"
  description: "writings on engineering and art by Matthew Lyon"
  github_modifications_base: "https://github.com/mattly/lyonheart.us/commits/master/contents"
  links:
    contact:
      email:
        href: 'mailto:matthew@lyonheart.us'
        icon: 'envelope'
      twitter:
        href: 'https://twitter.com/mattly'
        icon: 'tweeter'
      linkedin:
        href: 'http://www.linkedin.com/pub/matthew-lyon/62/55b/200/'
        icon: 'linkin'
    streams:
      github:
        href: 'https://github.com/mattly'
      soundcloud:
        href: 'http://soundcloud.com/matthewlyonheart'

require('metalsmith')(__dirname)
  .source('contents')
  .use(metadataSidecar)
  .use(pandoc)
  .use(extractFootnotes)
  .use(includeSiblings)
  .use(siblings)
  .use(setUrl)
  .use(require('metalsmith-collections')({
    articles: {
      pattern: 'articles/*/index.html'
      sortBy: 'date'
      reverse: true
    }
  }))
  .use(require('metalsmith-coffee')())
  .use(base64Icons)
  .use(require('metalsmith-sass')({
    includePaths: [
      'bower_components/bourbon/dist'
      'bower_components/neat/app/assets/stylesheets'
      'tmp'
    ],
    outputStyle: 'expanded'
  }))
  .use(require('metalsmith-fingerprint')({pattern:'assets/*'}))
  .use(require('metalsmith-ignore')([
    'assets/icons/*.svg'
  ]))
  .use(renderNunjucksTemplates)
  .use(smart)
  # .use(log)
  .destination('build')
  .build (err) ->
    fs.unlinkSync(path.join('tmp',f)) for f in fs.readdirSync('tmp')
    fs.rmdirSync('tmp')
    if err then throw err

