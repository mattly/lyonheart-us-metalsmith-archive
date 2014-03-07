(function() {
  var $window, bannerScroller, closeFootnote, footnote;

  footnote = function(event) {
    var content, ident;
    event.preventDefault();
    event.stopPropagation();
    ident = $(this).attr('href').replace(/^.+#/, "#");
    content = $($(ident).html());
    $('a[rev="footnote"]', content).remove();
    $('#footnoter .footnote-content').html(content);
    $('#footnoter .footnote-number').text("" + (ident.match(/\d+/)) + ".");
    $('#footnoter').css('opacity', 1);
    return $(document).one('click scroll', closeFootnote);
  };

  closeFootnote = function(event) {
    return $('#footnoter').css('opacity', 0);
  };

  $window = $(window);

  bannerScroller = function(ele, scale) {
    var bottom, height, top;
    if (scale == null) {
      scale = 50;
    }
    top = ele.position().top;
    height = ele.height();
    bottom = top + height;
    return function(event) {
      var offset, pos;
      offset = $window.scrollTop();
      pos = (offset - top) / height * (100 - scale) + scale;
      pos = Math.max(pos, 0);
      pos = Math.min(pos, 100);
      return ele.css({
        'background-position-y': pos + '%'
      });
    };
  };

  $(function() {
    var scroller;
    if ($('body.article').length > 0) {
      $('article').on('click', 'a[rel="footnote"]', footnote);
      scroller = bannerScroller($('.article-header-banner'));
      scroller();
      $window.scroll(scroller);
    }
    if ($('body.home').length > 0) {
      scroller = bannerScroller($('.main-header'), 0);
      scroller();
      return $window.scroll(scroller);
    }
  });

}).call(this);
