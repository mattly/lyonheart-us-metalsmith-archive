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
            theFn.find('a').last().remove();
                // .attr('rev', 'footnote').before('&nbsp;').html("↩")
          theFn = theFn.next();
        }
        if (!page.sections) { page.sections = {}; }
        // page.sections.footnotes = {
        //   title: "Footnotes",
        //   contents: new Buffer(`<ol>${footnotes.find('ol').html()}</ol>`)
        // }

        var fnLinks = doc('a.footnoteRef').attr('rel', 'footnote');
        theFn = fnLinks.first();
        var idx = 0;
        while (idx < fnLinks.length) {
            // console.log("footnote ", idx + 1, ": ", theFn.html())
            // console.log("found ", footnotes.find('li').eq(idx).html())
          // theFn.html(doc(`<sup>${idx}</sup>`));
            var id = `${page.title.replace(/\s+/g,"-").toLowerCase()}-${idx+1}`;
            theFn.replaceWith(`<span class="sidenote-container">
                                 <label for="${id}" class="sidenote-toggle sidenote-number">${idx+1}</label>
                                 <input type="checkbox" id="${id}" class="sidenote-toggle" />
                                 <span class="sidenote">
                                   <span class="sidenote-number">${idx+1}</span>
                                   ${footnotes.find('li').eq(idx).find('p').first().html()}
                                 </span></span>`)
            idx += 1;
          theFn = fnLinks.eq(idx);
        }

        footnotes.remove()
        page.contents = new Buffer(doc.html());
      }
    });
    done();
  }
}
