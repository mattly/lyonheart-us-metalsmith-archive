import process from 'process'
import fs from 'fs'
import path from 'path'
import jade from 'jade'
import mdit from 'markdown-it'

const md = new mdit('commonmark')

jade.filters.markdown = (str) => md.render(str)

function defaultLocalContext(page, context) {
  context.page = page
  context.content = page.contents.toString()
}

export default function template(config={}) {
  if (! config.key) config.key = "template"
  if (! config.directory) config.directory = "templates"
  if (! config.globalContext) config.globalContext = (m => m)
  if (! config.localContext) config.localContext = defaultLocalContext
  if (! config.helpers) config.helpers = {}

  function getTemplateName(page, f) {
    if (typeof config.key === 'function') return config.key(page)
    else return page[config.key]
  }
  if (! config.filter) config.filter = (([f,p]) => getTemplateName(p, f))

  return function(files, metalsmith, done) {
    var globalContext = config.globalContext(metalsmith.metadata(), config)
    globalContext.pages = files
    Object.keys(config.helpers)
          .forEach(helper => globalContext[helper] = config.helpers[helper])
      let templateDir = path.resolve(process.cwd(), config.directory)
    var templateCache = {}

    var availableTemplates = fs.readdirSync(templateDir)

    function getFileExt(filename) {
      var candidates = availableTemplates.filter(t => t.match(new RegExp(`^${filename}\\.`)))
      if (candidates.length === 0) { return null }
      return candidates[0]
    }

    function render([filepath, page]) {
      var locals = {}
      Object.keys(globalContext).forEach(key => locals[key] = globalContext[key])
      config.localContext(page, locals)
      var templatePath, rendered
      var templateName = getTemplateName(page)
      if (templateName) {
        if (path.extname(templateName) === '') templateName = getFileExt(templateName)
        if (! templateCache[templateName]) {
            templateCache[templateName] = jade.compileFile(path.join(templateDir, templateName))
        }
        rendered = templateCache[templateName](locals)
        page.contents = new Buffer(rendered)
        if (config.afterRender) config.afterRender(page, rendered)
      }
      else {
        console.warn(`${filepath}: cannot find template ${templateName}`)
      }
    }

    Object.keys(files).map(f => [f, files[f]]).filter(config.filter).forEach(render)
    done()
  }
}

