info =
  name: 'lyonheart.us'
  description: "Matthew Lyon's personal site and blog"
  author: { name: "Matthew Lyon" }
  private: true
  dependencies: {
    # --- metalsmith
    metalsmith: '0.8.x'
    'metalsmith-collections': '0.4.1'
    'metalsmith-coffee': '*'

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
    typogr: "git://github.com/mattly/typogr.js#widont-short-headlines"

    # for my "cson-content" plugin
    cson: '~1.4.5'

    # --- needed?
    underscore: '1.4.x'

    # grunting
    'grunt-grunticon': '1.0.x'
    'grunt-sass': '0.11.x'
  }

console.log(JSON.stringify(info, null, 2))
