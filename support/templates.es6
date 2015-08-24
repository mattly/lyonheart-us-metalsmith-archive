import fs from "fs";
import path from "path";
import jade from "jade";
// import mmd from "mmd";
var pandoc = require("./pandoc");

// jade.filters.markdown = (str) => pandoc.convert(str)

function defaultLocalContext(page, context) {
  context.page = page;
  context.content = page.contents.toString();
}

export default function template(config={}) {
  if (! config.key) { config.key = "template"; }
  if (! config.directory) { config.directory = "templates"; }
  if (! config.globalContext) { config.globalContext = (m => m); }
  if (! config.localContext) { config.localContext = defaultLocalContext; }
  if (! config.helpers) { config.helpers = {}; }

  function getTemplateName(page, f) {
    if (typeof config.key === 'function') { return config.key(page); }
    else { return page[config.key]; }
  }
  if (! config.filter) { config.filter = (([f,p]) => getTemplateName(p, f)); }

  return function(files, metalsmith, done) {
    var globalContext = config.globalContext(metalsmith.metadata(), config);
    Object.keys(config.helpers).forEach(helper => { globalContext[helper] = config.helpers[helper]; })
    var contentsDir = path.resolve(metalsmith._directory, metalsmith._source);
    var templateDir = path.resolve(contentsDir, config.directory);
    var templateCache = {};

    var availableTemplates = fs.readdirSync(templateDir);

    function getFileExt(filename) {
      var candidates = availableTemplates.filter(t => t.match(new RegExp(`^${filename}\\.`)))
      if (candidates.length === 0) { return null; }
      return candidates[0];
    }

    function render([filepath, page]) {
      var locals = {};
      Object.keys(globalContext).forEach(key => locals[key] = globalContext[key])
      config.localContext(page, locals);
      var templatePath, rendered;
      var templateName = getTemplateName(page);
      if (templateName) {
        if (templateName.match(/^\.\//)) {
          templatePath = path.resolve(contentsDir, path.dirname(filepath), templateName);
          rendered = jade.renderFile(templatePath, locals);
        } else {
          if (path.extname(templateName) === '') { templateName = getFileExt(templateName); }
          if (! templateCache[templateName]) {
            templateCache[templateName] = jade.compileFile(path.join(templateDir, templateName));
          }
          rendered = templateCache[templateName](locals);
        }
        page.contents = new Buffer(rendered);
        if (config.afterRender) { config.afterRender(page, rendered); }
      }
      else {
        console.warn(`${filepath}: cannot find template ${templateName}`);
      }
    }

    Object.keys(files).map(f => [f, files[f]]).filter(config.filter).forEach(render)
    done();
  }
}

