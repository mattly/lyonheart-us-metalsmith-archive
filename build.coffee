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
    data.contents = doc.html()
  done()

log = (files, ms, done) ->
  console.log(name, Object.keys(file)) for name, file of files
  done()

require('metalsmith')(__dirname)
  .source('source')
  .use(metadataSidecar)
  .use(markdown({ gfm: true, tables: true, footnotes: true }))
  .use(extractFootnotes)
  .use(log)
  .destination('build')
  .build((err) -> if err then throw err)

