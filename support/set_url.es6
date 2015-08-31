import path from 'path';

export default function setUrl(config={}) {
  return function(files, metalsmith, done) {
    var md = metalsmith.metadata();
    Object.keys(files).forEach(filepath => {
      var page = files[filepath];
      page.url = filepath.replace(/index\.html$/,'');
      page.slug = path.basename(page.url);
      page.full_url = `${md.site.url}/${page.url}`
    });
    done();
  }
}
