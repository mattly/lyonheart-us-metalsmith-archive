const yaml = require('js-yaml');

export default function(config) {
  return function(files, metalsmith, done) {
    Object.keys(files)
    .filter(f => f.match(/\.\w+\.(yml|yaml)$/))
    .forEach(filename => {
      var newFilename = filename.replace(/\.(yml|yaml)$/,'');
      var page = files[filename]
      var metadata = yaml.safeLoad( page.contents.toString() );
      Object.keys(metadata).forEach(k => page[k] = metadata[k]);
      page.contents = new Buffer("");
      files[newFilename] = page;
      delete files[filename];
    })
    done();
  }
}
