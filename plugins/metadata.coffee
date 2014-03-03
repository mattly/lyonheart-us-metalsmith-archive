module.exports = (env, callback) ->
  class MetadataFinder

  MetadataFinder.handlePage = (page, callback) ->
    if metadata = page.parent['metadata.json']
      for key, value of metadata.metadata when not page.metadata[key]
        page.metadata[key] = value
    callback(null, page)

  env.registerPostContentPlugin 'pages', '**/*\.html', MetadataFinder
  callback()
