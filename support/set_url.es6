export default function setUrl(config={}) {
  var getUrl = config.getUrl || (meta) => meta.site.url
  return function(files, metalsmith, done) {
    var md = metalsmith.metadata();
    var siteUrl = getUrl(md);
    Object.keys(files).forEach(filepath => {
      var page = files[filepath];
      page.url = filepath.replace(/index\.html$/,'');
      page.full_url = `${siteUrl}/${page.url}`
    });
    done();
  }
}
