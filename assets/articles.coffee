footnote = (event) ->
  event.preventDefault()
  event.stopPropagation()
  ident = $(this).attr('href').replace(/^.+#/,"#")
  content = $($(ident).html())
  $('a[rev="footnote"]', content).remove()
  $('#footnoter .footnote-content').html(content)
  $('#footnoter .footnote-number').text("#{ident.match(/\d+/)}.")
  $('#footnoter').css('opacity', 1)
  $(document).one('click scroll', closeFootnote)

closeFootnote = (event) ->
  $('#footnoter').css('opacity', 0)

$ ->
  $('article').on('click', 'a[rel="footnote"]', footnote)
