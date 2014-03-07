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

$window = $(window)
bannerScroller = (ele, scale=50) ->
  top = ele.position().top
  height = ele.height()
  bottom = top + height

  (event) ->
    offset = $window.scrollTop()
    pos = (offset - top) / height * (100 - scale) + scale
    pos = Math.max(pos, 0)
    pos = Math.min(pos, 100)
    ele.css({ 'background-position-y': pos + '%' })

$ ->
  if $('body.article').length > 0
    $('article').on('click', 'a[rel="footnote"]', footnote)
    scroller = bannerScroller($('.article-header-banner'))
    scroller()
    $window.scroll(scroller)
  if $('body.home').length > 0
    scroller = bannerScroller($('.main-header'), 0)
    scroller()
    $window.scroll(scroller)
