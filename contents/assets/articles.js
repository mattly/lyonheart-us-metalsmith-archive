(function() {
  var bannerScroller, closeFootnote, footnote;

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

  bannerScroller = function(ele) {
    var bottom, height, top;
    top = ele.position().top;
    height = ele.height();
    bottom = top + height;
    return function(event) {
      var offset, pos;
      offset = $(window).scrollTop();
      pos = (offset - top) / height * 50 + 50;
      pos = Math.max(pos, 0);
      pos = Math.min(pos, 100);
      return $('.image', ele).css({
        'background-position-y': pos + '%'
      });
    };
  };

  $(function() {
    var scroller;
    $('article').on('click', 'a[rel="footnote"]', footnote);
    scroller = bannerScroller($('.article-header-banner'));
    scroller();
    return $(window).scroll(scroller);
  });

}).call(this);
