info =
  dependencies: {
    # for the default templates
    'moment': '2.3.x'
    'underscore': '1.4.x'

    # wintersmithing
    'wintersmith-nunjucks': 'git://github.com/jbuck/wintersmith-nunjucks'
    'wintersmith-showdown': '0.1.0'

    # for my plugin 'footnote-extractor'
    'cheerio': '0.13.x'

    # for my date format nunjucks filter
    # 'moment': '2.3.x'

    # grunting
    'grunt-contrib-watch': '0.5.x'
    'grunt-contrib-coffee': '0.10.x'
    'grunt-grunticon': '1.0.x'
    'grunt-sass': '0.11.x'
    'grunt-wintersmith': '0.0.2'
  }

console.log(JSON.stringify(info, null, 2))
