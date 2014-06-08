fs = require ('fs')

info =
  name: 'lyonheart.us'
  description: "Matthew Lyon's personal site and blog"
  author: { name: "Matthew Lyon" }
  private: true

deps = {
  package: {
    # --- metalsmith
    metalsmith: '0.8.x'
    'metalsmith-collections': '0.4.1'

    'metalsmith-coffee': '*'
    'metalsmaith-sass': '*'

    # --- custom metalsmith, to extract
    # for footnotes on custom markdown
    marked: "git://github.com/chjj/marked#feature-footnotes"
    # for footnote extractor
    cheerio: '0.13.x'

    # for metadata-sidecar
    'js-yaml': '3.0.x'

    # nunjucks
    nunjucks: '1.0.x'
    # nunjucks filters:
    # - date_format
    moment: '2.x.x'
    # - smarty:
    typogr: '0.6.x'

    # for my "cson-content" plugin
    cson: '~1.4.5'

    # grunting
    'grunt-grunticon': '1.0.x'
  }
  bower: {
    bourbon: '3.2.x'
    neat: '1.5.x'
  }
}

for own name, dict of deps
  contents = { dependencies: dict }
  contents[key] = value for own key, value of info
  fs.writeFileSync("#{name}.json", JSON.stringify(contents, null, 2))
