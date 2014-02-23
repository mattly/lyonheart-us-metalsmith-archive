(function() {
  var closeFootnote, footnote;

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

  $(function() {
    return $('article').on('click', 'a[rel="footnote"]', footnote);
  });

}).call(this);
