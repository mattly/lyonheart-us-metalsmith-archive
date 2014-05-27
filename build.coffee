path = require('path')
marked = require('marked')

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

require('metalsmith')(__dirname)
  .source('source')
  .use(markdown({ gfm: true, tables: true, footnotes: true }))
  .use(extractFootnotes)
  .destination('build')
  .build((err) -> if err then throw err)

