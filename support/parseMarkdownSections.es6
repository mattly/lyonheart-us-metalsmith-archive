import path from 'path';

function parseSection(config={}){
  var sectionBreak = config.sectionBreak || /~~~\s*([\w\s]+)/;
  var breaker = sectionBreak.source.replace(/.?[\(\)]/g, m => {
    if (m[0] == '\\') { return m; }
    else { return m.replace(/[\(\)]/,''); }
  });
  var splitter = new RegExp(`\n(${breaker})\n`);
  return function(files, metalsmith, done) {
    var markdownFiles = Object.keys(files)
    .filter(file => path.extname(file).match(/^\.(md|markdown)$/))
    .forEach(filepath => {
      var dirname = path.dirname(filepath);
      var file = files[filepath]
      var sections = file.contents.toString().split(splitter);
      var hasBody = false;
      file.sections = {};
      function setBody(section) {
        // console.log(`${filepath}: pushing section body(${section.length})`)
        file.contents = new Buffer(section);
        hasBody = true;
      }
      while (sections.length > 0) {
        var section = sections.shift();
        if (section.replace(/\s*/).length === 0) { next(); }
        var match = section.match(sectionBreak);
        if (match) {
          var title = match[1],
              id = title.toLowerCase().replace(/\s+/g, '_'),
              section = sections.shift();
          if (id === "body") { setBody(section); }
          else {
            // console.log(`${filepath}: pushing section ${id}(${section.length})`)
            var doc = { id, title, contents: new Buffer(section), isFooter: hasBody }
            file.sections[id] = doc;
            files[path.join(dirname, "__markdown__sections__", `_${id}.markdown`)] = doc;
          }
        } else { setBody(section); }
      }
      // Object.keys(file.sections).forEach(s => {
      //   console.log(`${filepath} :: ${s} :: ${file.sections[s].contents.length}`)
      // })
    });
    done();
  };
}

export default parseSection;
