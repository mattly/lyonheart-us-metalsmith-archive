module.exports = (env, callback) ->
  class MetadataFinder

  MetadataFinder.handlePage = (page, callback) ->
    if page.parent['metadata.json']
      metadata = page.parent['metadata.json'].metadata
    else if page.parent['metadata.yaml']
      metadata = page.parent['metadata.yaml'].data
    if metadata
      for key, value of metadata when not page.metadata[key]
        page.metadata[key] = value
    callback(null, page)

  env.registerPostContentPlugin 'pages', '**/index\.html', MetadataFinder
  callback()
