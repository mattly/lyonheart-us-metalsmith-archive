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

markdown = (options={}) ->
  (files, metalsmith, done) ->
    for own file, data of files when path.extname(file).match(/^\.md|\.markdown$/)
      if not /^\.md|\.markdown$/.test(path.extname(file)) then return
      data = files[file]
      data.contents = new Buffer(marked(data.contents.toString(), options))
      htmlName = file.replace(/\.md|\.markdown$/, '.html')
      files[htmlName] = data
      delete files[file]
    done()

cheerio = require('cheerio')

extractFootnotes = (files, metalsmith, done) ->
  for own file, data of files when path.extname(file).match(/^\.html$/)
    doc = cheerio.load(data.contents)
    footnotes = doc("ol.footnotes")
    if footnotes.length > 0
      theFootnote = footnotes.find('li').first()
      while theFootnote.length > 0
        theFootnote.find('a').last().attr('rev','footnote')
        theFootnote = theFootnote.next()
      data.footnotes = footnotes.html()
      footnotes.remove()
    doc('sup a.footnoteRef a').attr('rel','footnote')
    data.contents = new Buffer(doc.html())
  done()

log = (files, ms, done) ->
  console.log(name, Object.keys(file)) for name, file of files
  done()

nunjucks = require('nunjucks')
env = nunjucks.configure('templates')

moment = require('moment')
env.addFilter 'date_format', (date, format) ->
  moment(date).format(format)

typogr = require('typogr')
env.addFilter 'smarty', (text) ->
  text or= ''
  t = typogr(text).chain().amp()
  if text.split(' ').length > 3 then t = t.widont()
  t.smartypants().initQuotes().caps().ord().value()

renderNunjucksTemplates = (files, ms, done) ->
  for own filePath, page of files when page.template?.match(/\.html$/)
    page.contents = page.contents.toString()
    full_url = "#{site.url}/#{filePath}"
    page.contents = new Buffer(nunjucks.render(page.template, { page, site, full_url }))
  done()

siblings = (files, ms, done) ->
  for own filePath, page of files
    dir = path.dirname(filePath)
    page.siblings = {}
    for sibling in Object.keys(files) when sibling.match(///^#{dir}\/[^\/]+$///)
      page.siblings[path.basename(sibling)] = files[sibling]
  done()

site =
  url: 'http://lyonheart.us'
  name: "lyonheart.us"
  owner: "Matthew Lyon"
  description: "writings on engineering and art by Matthew Lyon"
  github_modifications_base: "https://github.com/mattly/lyonheart.us/commits/master/contents"

require('metalsmith')(__dirname)
  .source('contents')
  .use(metadataSidecar)
  .use(siblings)
  .use(markdown({ gfm: true, tables: true, footnotes: true }))
  .use(extractFootnotes)
  .use(renderNunjucksTemplates)
  .use(require('metalsmith-coffee')())
  # .use(require('metalsmith-sass')())
  .use(log)
  .destination('build')
  .build((err) -> if err then throw err)

