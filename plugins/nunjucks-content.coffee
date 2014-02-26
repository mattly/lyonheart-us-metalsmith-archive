fs = require 'fs'
path = require 'path'
nunjucks = require 'nunjucks'
async = require 'async'

module.exports = (env, ready) ->
  class NunjucksContent extends env.plugins.Page
    constructor: (@filepath, @metadata, @tpl) ->
    getFilename: -> @filepath.relative.replace(/nunjucks$/,'html')
    getHtml: -> @tpl.render(@metadata)

  class NunjucksGivenLoader
    constructor: (@opts) ->
    getSource: (name) ->
      if name is 'given' then { src: @opts.given, path: @opts.path }
      else @opts.fallback.getTemplate(name)
    on: ->

  NunjucksContent.fromFile = (filepath, callback) ->
    async.waterfall [
      (next) -> fs.readFile(filepath.full, next)
      (buffer, next) ->
        # extract metadata using wintersmiths markdown plugin's markdown parser
        env.plugins.MarkdownPage.extractMetadata(buffer.toString(), next)
      (result, next) ->
        contentPath = path.dirname(filepath.full)
        nloader = new NunjucksGivenLoader({
          given: result.markdown
          path: contentPath
          fallback: new nunjucks.FileSystemLoader(contentPath)
        })
        nenv = new nunjucks.Environment(nloader)
        try
          template = nenv.getTemplate('given')
          next(null, new NunjucksContent(filepath, result.metadata, template))
        catch error
          next(error)
    ], callback

  env.registerContentPlugin('pages', "**/*.*(html|nunjucks)", NunjucksContent)

  ready()

