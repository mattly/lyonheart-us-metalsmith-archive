const path = require("path");

const imageTypes = {
  ".svg": "image/svg+xml"
};

function inlineCssUrls(config={}) {
  if (!config.extensions) { config.extensions = ['.svg']; }
  config.extensions = config.extensions.map(ext => ext.replace(/^\./,''))
  if (!config.sizeLimit)  { config.sizeLimit = Math.pow(2, 14); }
  var urlMatcher = new RegExp(`url\\(['"](.+\\.(${config.extensions.join("|")}))["']\\)`);
  return function(files, metalsmith, done) {
    var cssFiles = Object.keys(files).filter(file => file.match(/\.css$/))
    cssFiles.forEach(function(file){
      var oldContents = files[file].contents.toString('utf8');
      var newContents = [];
      var nextUrl;
      while (nextUrl = oldContents.match(urlMatcher)) {
        newContents.push(oldContents.slice(0, nextUrl.index));
        oldContents = oldContents.slice(nextUrl.index + nextUrl[0].length);
        var imgLocation = path.normalize(path.join(path.dirname(file), nextUrl[1]));
        var imgFile = files[imgLocation];
        if (imgFile.length > config.sizeLimit) { newContents.push(nextUrl.input); }
        else {
          var imgType = path.extname(imgLocation);
          var imgData = escape(imgFile.contents.toString('base64'));
          newContents.push(`url(data:${imageTypes[imgType]};base64,${imgData})`);
          delete files[imgLocation];
        }
      }
      newContents.push(oldContents);
      files[file].contents = new Buffer(newContents.join(''));
    });
    done();
  }
}

export default inlineCssUrls;
