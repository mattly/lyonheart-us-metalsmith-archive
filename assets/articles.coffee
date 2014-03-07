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

bannerScroller = (ele) ->
  top = ele.position().top
  height = ele.height()
  bottom = top + height

  (event) ->
    offset = $(window).scrollTop()
    pos = (offset - top) / height * 50 + 50
    pos = Math.max(pos, 0)
    pos = Math.min(pos, 100)
    $('.image', ele).css({ 'background-position-y': pos + '%' })

$ ->
  $('article').on('click', 'a[rel="footnote"]', footnote)
  scroller = bannerScroller($('.article-header-banner'))
  scroller()
  $(window).scroll(scroller)
