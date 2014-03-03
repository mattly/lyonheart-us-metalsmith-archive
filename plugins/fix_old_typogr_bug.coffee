module.exports = (env, callback) ->
  # fixed here: https://github.com/ekalinin/typogr.js/issues/15
  # but it might be a while before showdown does this
  class TypogrFixer
  TypogrFixer.handlePage = (page, callback) ->
    if page._htmlraw
      page._htmlraw = page._htmlraw.replace(/>&#8216;/, '>&#8217;', 'g')
    callback(null, page)

  env.registerPostContentPlugin 'pages', '**/*\.html', TypogrFixer
  callback()
