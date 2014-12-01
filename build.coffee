fs = require('fs')
path = require('path')
try
  fs.mkdirSync('tmp')
catch e
  fs.unlinkSync(path.join('tmp', f)) for f in fs.readdirSync('tmp')
  fs.rmdirSync('tmp')
  fs.mkdirSync('tmp')


yaml = require('js-yaml')

apiece = (arr, fn, cb) ->
  next = (err) ->
    if err then return cb(err)
    if arr.length then fn(arr.shift(), next)
    else cb()
  process.nextTick(next)


metadataSidecar = (files, metalsmith, done) ->
  yamlfiles = (f for f, d of files when path.extname(f).match(/^\.yml$/))
  for filepath, page of files when yamlfiles.indexOf("#{filepath}.yml") > -1
    yamlpath = "#{filepath}.yml"
    metadata = yaml.safeLoad( files[yamlpath].contents.toString() )
    page[key] = value for key, value of metadata
    delete files[yamlpath]
    yamlfiles = (f for f in yamlfiles when f isnt yamlpath)
  for filepath in yamlfiles
    page = files[filepath]
    metadata = yaml.safeLoad( page.contents.toString() )
    if metadata.template
      page[key] = value for key, value of metadata
      delete files[filepath]
      newPath = filepath.replace(/\.yml$/, '')
      files[newPath] = page
  done()

# takes <ol> from .footnotes, makes it page.footnotes, removes ol
# also cleans up rel/rev attributes for links
cheerio = require('cheerio')
extractFootnotes = (files, metalsmith, done) ->
  for own file, data of files when path.extname(file).match(/^\.html$/)
    doc = cheerio.load(data.contents)
    footnotes = doc(".footnotes")
    if footnotes.length > 0
      theFootnote = footnotes.find('li').first()
      while theFootnote.length > 0
        theFootnote.find('a').last().attr('rev','footnote')
        theFootnote = theFootnote.next()
      data.sections or= {}
      data.sections.footnotes = { title: "Footnotes", content: "<ol>#{footnotes.find('ol').html()}</ol>" }
      footnotes.remove()
      doc('a.footnoteRef').attr('rel','footnote')
      data.contents = new Buffer(doc.html())
  done()

log = (files, ms, done) ->
  console.log(name, Object.keys(file), file.mode, file.contents.length) for name, file of files
  done()

moment = require('moment')

# converts .(md|markdown) to html via pandoc
{exec} = require('child_process')
convertMarkdown = (input, cb) ->
  cp = exec "pandoc -t html5 --smart --ascii", (err, stdout, stderr) -> cb(err, stdout)
  cp.stdin.write(input)
  cp.stdin.end()

pandoc = (files, ms, done) ->
  converts = (f for own f, p of files when path.extname(f).match(/^\.(md|markdown)$/))
  convertFile = (filePath, cb) ->
    file = files[filePath]
    body = file.contents.toString()
    file.sections or= {}
    if body.match(/\n~~~ ([\w\s]+)/)
      sections = body.split(/\n(~~~\s*[\w\s]+)\n/)
      hasBody = false
      while sections.length
        section = sections.shift()
        if match = section.match(/^~~~\s*([\w\s]+)$/)
          name = match[1].toLowerCase().replace(/\s+/,'_')
          if name is "body"
            body = section
            hasBody = true
          else
            file.sections[name] = {
              id: name
              title: match[1]
              content: sections.shift()
              footer: hasBody }
        else
          body = section
          hasBody = true

    convertMarkdown body, (err, html) ->
      if err then cb(err)
      htmlPath = filePath.replace(/\.(md|markdown)$/, '.html')
      files[htmlPath] = file
      file.contents = new Buffer(html)
      delete files[filePath]
      sections = ({name, info} for name, info of file.sections)
      handleSection = ({name, info}, c) ->
        convertMarkdown info.content, (err, html) ->
          if err then c(err)
          file.sections[name].content = html
          c()
      apiece(sections, handleSection, cb)
  apiece(converts, convertFile, done)

typogr = require('typogr')
smart = (files, ms, done) ->
  for own filePath, page of files when path.extname(filePath) is '.html'
    page.contents = new Buffer(typogr.typogrify(page.contents.toString()))
  done()

setUrl = (files, ms, done) ->
  for filePath, page of files
    page.url = filePath.replace(/^\.\//,'').replace(/\/index\.html$/,'')
    page.full_url = "#{site.url}/#{page.url}"
  done()

siblings = (files, ms, done) ->
  for own filePath, page of files
    dir = path.dirname(filePath)
    page.siblings = {}
    for sibling in Object.keys(files) when sibling.match(///^#{dir}\/[^\/]+$///)
      page.siblings[path.basename(sibling)] = files[sibling]
  done()

Imagemin = require('imagemin')
base64Icons = (files, ms, done) ->
  icons = []
  iconFiles = []
  parsedIcons = 0
  for own filePath, data of files when filePath.match(/\/icons\/[^/]+\.svg/)
    iconFiles.push({filePath, data})
  for icon in iconFiles
    do (icon) ->
      name = path.basename(icon.filePath, '.svg')
        .replace(/\W+/g,'_').replace(/_+/g,'-')
        .replace(/^-/,'').replace(/-$/,'')
      new Imagemin().src(icon.data.contents).run (e, files) ->
        data = files[0].contents.toString('base64')
        icons.push(".icon-#{name} { background-image: url(data:image/svg+xml;base64,#{escape data}); background-repeat: no-repeat; }")
        parsedIcons += 1
        if parsedIcons == iconFiles.length
          fs.writeFileSync('tmp/_icons.scss', icons.join("\n"))
          done()

jade = require('jade')
templates = {}

renderTemplate = (files, ms, done) ->
  { collections, fingerprint } = ms.metadata()
  for filepath, page of files when page.template
    console.log(page)
    locals = {
      page, site, collections, fingerprint,
      siblings: page.siblings, content: page.contents.toString(),
      formatDate: (date, format) -> moment(date).format(format)
    }
    if page.template.match(/^.\//)
      templatePath = path.join("contents", path.dirname(filepath), page.template)
      render = jade.renderFile(templatePath, locals)
    else
      if not templates[page.template]
        templates[page.template] = jade.compileFile("./contents/templates/#{page.template}")
      render = templates[page.template](locals)
    page.contents = page.pageContents = new Buffer(render)
  done()

renderLayout = (files, ms, done) ->
  try
    layout = jade.compileFile("./contents/templates/layout.jade", { pretty: true, compileDebug: true })
  catch e
    console.log(e)
    process.exit(1)
  for filepath, page of files when filepath.match(/\.html/) and page.pageContents
    { collections, fingerprint } = ms.metadata()
    page.contents = layout({
      page, site, collections, fingerprint, content: page.pageContents.toString()
    })
  done()

site =
  url: 'http://lyonheart.us'
  name: "lyonheart.us"
  owner: "Matthew Lyon"
  description: "writings on engineering and art by Matthew Lyon"
  github_modifications_base: "https://github.com/mattly/lyonheart.us/commits/master/contents"
  links:
    contacts:
      email:
        href: 'mailto:matthew@lyonheart.us'
        icon: 'envelope'
      twitter:
        href: 'https://twitter.com/mattly'
        icon: 'tweeter'
      linkedin:
        href: 'http://www.linkedin.com/pub/matthew-lyon/62/55b/200/'
        icon: 'linkin'
    streams:
      github:
        href: 'https://github.com/mattly'
      soundcloud:
        href: 'http://soundcloud.com/matthewlyonheart'
      rss:
        href: '/index.xml'

generator = require('metalsmith')(__dirname)
  .source('contents')
  .destination('build')

ignore = require('metalsmith-ignore')
chain = [
  metadataSidecar
  pandoc
  extractFootnotes
  require('metalsmith-collections')({
    articles: {
      pattern: 'articles/*/index.html'
      sortBy: 'date'
      reverse: true
    }
  })
  siblings
  setUrl

  # javascripts
  require('metalsmith-coffee')()

  # css
  base64Icons
  require('metalsmith-sass')({
    includePaths: [
      'bower_components/bourbon/dist'
      'bower_components/neat/app/assets/stylesheets'
      'tmp'
    ],
    outputStyle: 'expanded'
  })
  require('metalsmith-fingerprint')({pattern:'assets/*'})
  ignore([
    'assets/icons/*.svg'
    'templates/*'
  ])

  # render
  renderTemplate
  renderLayout
  smart
]

if process.env.DEV
  chain.push(
    require('metalsmith-serve')({
      port: process.env.DEV
      verbose: true
    })
  )

chain.forEach((fn) -> generator.use(fn))

generator.build (err) ->
  fs.unlinkSync(path.join('tmp',f)) for f in fs.readdirSync('tmp')
  fs.rmdirSync('tmp')
  if err then throw err

