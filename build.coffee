fs = require('fs')
path = require('path')
marked = require('marked')

yaml = require('js-yaml')

metadataSidecar = (files, ms, done) ->
  for own fileName, data of files when fileName.match(/\/metadata\.yaml$/)
    metadata = yaml.safeLoad(data.contents.toString())
    filePath = path.dirname(fileName)
    for own name, record of files when name.match(///^#{filePath}\/index\.///)
      for own key, value of metadata
        record[key] = value
    delete files[fileName]
  done()

cheerio = require('cheerio')

extractFootnotes = (files, metalsmith, done) ->
  for own file, data of files when path.extname(file).match(/^\.html$/)
    doc = cheerio.load(data.contents)
    footnotes = doc("div.footnotes")
    if footnotes.length > 0
      theFootnote = footnotes.find('li').first()
      while theFootnote.length > 0
        theFootnote.find('a').last().attr('rev','footnote')
        theFootnote = theFootnote.next()
      data.footnotes = footnotes.find('ol').html()
      footnotes.remove()
    doc('sup a.footnoteRef a').attr('rel','footnote')
    data.contents = new Buffer(doc.html())
  done()

log = (files, ms, done) ->
  console.log(name, Object.keys(file), file.contents.length) for name, file of files
  done()

nunjucks = require('nunjucks')
env = nunjucks.configure('templates')

moment = require('moment')
env.addFilter 'date_format', (date, format) ->
  moment(date).format(format)

typogr = require('typogr')

env.addFilter 'smarty', (text) ->
  text
  # typogr.typogriphy(text or '')
  # t = typogr(text).chain().amp()
  # if text.split(' ').length > 3 then t = t.widont()
  # t.smartypants().initQuotes().caps().ord().value()

{exec} = require('child_process')
pandoc = (files, ms, done) ->
  converts = (f for own f, p of files when path.extname(f).match(/^\.(md|markdown)$/))
  convert = (filePath, cb) ->
    htmlPath = filePath.replace(/\.(md|markdown)$/, '.html')
    console.log "converting #{filePath} -> #{htmlPath}"
    exec "pandoc -t html contents/#{filePath}", (err, stdout, stderr) ->
      if err then throw err
      files[htmlPath] = files[filePath]
      files[htmlPath].contents = new Buffer(stdout)
      delete files[filePath]
      cb()
  next = ->
    if converts.length then convert(converts.shift(), next)
    else done()
  next()

smart = (files, ms, done) ->
  for own filePath, page of files when path.extname(filePath) is '.html'
    console.log("smarting #{filePath}")
    page.contents = new Buffer(typogr.typogrify(page.contents.toString()))
  done()

renderNunjucksTemplates = (files, ms, done) ->
  for own filePath, page of files when page.template?.match(/\.html$/)
    # page.contents = page.contents.toString()
    page.url = filePath
    full_url = "#{site.url}/#{filePath}"
    {collections} = ms.metadata()
    page.contents = new Buffer(nunjucks.render(page.template, { page, site, collections, full_url }))
  done()

siblings = (files, ms, done) ->
  for own filePath, page of files
    dir = path.dirname(filePath)
    page.siblings = {}
    for sibling in Object.keys(files) when sibling.match(///^#{dir}\/[^\/]+$///)
      page.siblings[path.basename(sibling)] = files[sibling]
  done()

cson = require('cson')
dataLoader = (files, ms, done) ->
  for own filePath, fileData of files when path.extname(filePath) is '.cson'
    for own key, value of cson.parseSync(fileData.contents.toString())
      fileData[key] = value
  done()

fileRenamer = (files, ms, done) ->
  for own filePath, fileData of files when fileData.filename
    dir = path.dirname(filePath)
    files["#{dir}/#{fileData.filename}"] = fileData
    delete files[filePath]
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
      flickr:
        href: 'http://www.flickr.com/photos/matthew-lyonheart/'
      soundcloud:
        href: 'http://soundcloud.com/matthewlyonheart'


require('metalsmith')(__dirname)
  .source('contents')
  .use(dataLoader)
  .use(metadataSidecar)
  .use(fileRenamer)
  .use(siblings)
  .use(pandoc)
  .use(smart)
  .use(extractFootnotes)
  .use(require('metalsmith-collections')({
    articles: {
      pattern: 'articles/*/index.html'
      sortBy: 'date'
      reverse: true
    }
  }))
  .use(renderNunjucksTemplates)
  .use(require('metalsmith-coffee')())
  # .use(require('metalsmith-sass')())
  # .use(log)
  .destination('build')
  .build((err) -> if err then throw err)

