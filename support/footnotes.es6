const cheerio = require('cheerio')

export default function(config) {
  return function(files, metalsmith, done) {
    Object.keys(files)
    .filter(f => f.match(/\.html$/))
    .forEach(filename => {
      var page = files[filename];
      var doc = cheerio.load(page.contents);
      var footnotes = doc('.footnotes');
      if (footnotes.length > 0) {
        var theFn = footnotes.find('li').first();
        while (theFn.length > 0) {
          theFn.find('a').last().attr('rev', 'footnote').before('&nbsp;').html("↩")
          theFn = theFn.next();
        }
        if (!page.sections) { page.sections = {}; }
        page.sections.footnotes = {
          title: "Footnotes",
          contents: new Buffer(`<ol>${footnotes.find('ol').html()}</ol>`)
        }
        footnotes.remove()

        var fnLinks = doc('a.footnote').attr('rel', 'footnote');
        theFn = fnLinks.first();
        var idx = 0;
        while (idx < fnLinks.length) {
          idx += 1;
          theFn.html(doc(`<sup>${idx}</sup>`));
          theFn = fnLinks.eq(idx);
        }
        page.contents = new Buffer(doc.html());
      }
    });
    done();
  }
}
