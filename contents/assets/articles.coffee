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
  if $('article.article-main').length is 1
    scroller = bannerScroller($('.article-header-banner'))
    scroller()
    $window.scroll(scroller)

