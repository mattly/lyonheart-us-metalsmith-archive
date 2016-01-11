let $window = $(window)

function bannerScroller (ele, scale=50) {
    let top = ele.position().top,
        height = ele.height(),
        bottom = top + height

    return function scrollHandler (scrollEvent) {
        let offset = $window.scrollTop(),
            pos = (offset - top) / height * (100 - scale) + scale
        pos = Math.max(Math.min(pos, 100), 0)
        ele.css({'background-position-y': pos + '%' })
    }
}

$(function(){
    let hb = $('.article-header-banner');
    if (hb.length === 1) {
        let scroller = bannerScroller(hb)
        scroller()
        $window.scroll(scroller)
    }
})
