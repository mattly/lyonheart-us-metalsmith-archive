import cheerio from 'cheerio';

function parseSection(config={}) {
  let sectionBreak = config.sectionBreak || /@section\s*([\w\s]+)/;
  let breaker = sectionBreak.source.replace(/.?[\(\)]/g, m => {
    if (m[0] == '\\') { return m; }
    else { return m.replace(/[\(\)]/,''); }
  });
  let splitter = new RegExp(`\n(${breaker})\n`)
  let filter = config.filter || function(){ return true; }

  return function(files, metalsmith, done){
    Object.keys(files)
      .filter(f => filter(files[f], f, files))
      .forEach(filepath => {
        let file = files[filepath],
            contents = file.contents.toString(),
            doc = cheerio.load(contents),
            footnotes = doc('.footnotes');
        file.sections = {};

        if (footnotes.length > 0) {
          // cleanup bottom
          doc('hr.footnotes-sep').remove();
          footnotes.find('a.footnote-backref').remove();

          let fnLinks = doc('sup.footnote-ref a').attr('rel', 'footnote'),
              theFn, id;
          for(var i = 0; i < fnLinks.length; i++) {
            theFn = fnLinks.eq(i);
            id = `${file.title.replace(/\s+/g,'-').toLowerCase()}-${i+1}`;
              theFn.replaceWith(
                  `<span class='sidenote-container'>
                     <label for='${id}' class='sidenote-toggle sitenote-number'>
                       ${i+1}
                     </label>
                     <input type='checkbox' id='${id}' class='sidenote-toggle' />
                     <span class='sidenote-content'>
                       <span class='sidenote-number'>${i+1}</span>
                       ${footnotes.find('li').eq(i).find('p').first().html()}
                     </span>
                   </span>`)
          }
          footnotes.remove();
          contents = doc.html();
        }

        let sections = contents.split(splitter)
              .filter(s => s.replace(/\s*/).length > 0),
            hasBody = false,
            count = 0;
        console.log(`${filepath} has sections:`, sections.length)
        // console.log(contents.split(splitter))
        if (sections.length < 2) { return; }
        while (sections.length > 0) {
          let section = sections.shift(),
              matchesBreak = section.match(sectionBreak);
          console.log('setting section', matchesBreak[1])
          let title = matchesBreak[1],
              id = title.toLowerCase().replace(/\s+/g, '_');
          section = sections.shift();
          file.sections[id] = { id, title,
                                contents: new Buffer(section),
                                isFooter: hasBody,
                                position: count }
          count += 1;
        }
        console.log(`page ${filepath} has sections:`, Object.keys(file.sections))
      });
    done();
  }
}
export default parseSection;
