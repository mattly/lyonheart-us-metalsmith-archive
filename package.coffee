info =
  name: 'lyonheart.us'
  description: "Matthew Lyon's personal site and blog"
  author: { name: "Matthew Lyon" }
  private: true
  dependencies: {
    # --- metalsmith migration ----
    metalsmith: '0.8.x'

    marked: "git://github.com/chjj/marked#feature-footnotes"



    # for the default templates
    moment: '2.3.x'
    underscore: '1.4.x'

    # wintersmithing
    wintersmith: 'mattly/wintersmith#post-content-plugin'
    'wintersmith-nunjucks': 'git://github.com/jbuck/wintersmith-nunjucks'
    'wintersmith-showdown': '0.1.0'
    'wintersmith-nunjucks-content': '0.1.0'
    'wintersmith-yaml': '1.0.1'

    # for my plugin 'footnote-extractor'
    cheerio: '0.13.x'

    # for my "cson-content" plugin
    cson: '~1.4.5'

    # for my date format nunjucks filter
    # 'moment': '2.3.x'
    # for my smarty nunjucks filter
    typogr: '~0.6.3'

    # grunting
    'grunt-contrib-watch': '0.5.x'
    'grunt-contrib-coffee': '0.10.x'
    'grunt-grunticon': '1.0.x'
    'grunt-sass': '0.11.x'
    'grunt-wintersmith': '0.0.2'
  }

console.log(JSON.stringify(info, null, 2))
