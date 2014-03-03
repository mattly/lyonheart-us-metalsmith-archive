fs = require 'fs'
cson = require 'cson'

module.exports = (env, callback) ->
  class CsonPage extends env.plugins.MarkdownPage

  CsonPage.fromFile = (filepath, callback) ->
    cson.parseFile filepath.full, (error, data) ->
      if error then return callback(error)
      markdown = data.content or ''
      callback(null, new CsonPage(filepath, data, markdown))


  env.registerContentPlugin('pages', "**/*\.cson", CsonPage)
  callback()

