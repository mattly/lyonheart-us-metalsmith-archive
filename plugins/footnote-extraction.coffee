cheerio = require('cheerio')

extractFootnotes = (callback) ->
  (err, page) ->
    if page._htmlraw.length is 0 then return callback(null, page)
    $ = cheerio.load page._htmlraw
    footnotes = $("div.footnotes")
    page.metadata.footnotes = "<ol>#{footnotes.find("ol").html()}</ol>"
    footnotes.remove()
    $('a.footnoteRef')
      .attr('rel','footnote')
      .removeAttr('class')
    page._htmlraw = $.html()
    callback(null, page)

module.exports = (env, callback) ->

  class FootNoter extends env.plugins.ShowdownPage
  FootNoter.fromFile = (filepath, callback) ->
    env.plugins.ShowdownPage.fromFile(filepath, extractFootnotes(callback))

  env.registerContentPlugin 'pages', '**/*.*(markdown|mkd|md)', FootNoter
  callback()
