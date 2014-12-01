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
    'metalsmith-sass': '>=0.2.0'
    'metalsmith-ignore': '*'
    'metalsmith-fingerprint': '*'

    # --- custom metalsmith, to extract
    # for footnote extractor
    cheerio: '0.13.x'

    # for metadata-sidecar
    'js-yaml': '3.0.x'

    jade: '1.x.x'
    # - date_format
    moment: '2.x.x'
    # - smarty:
    typogr: '0.6.x'

    imagemin: '3.0.x'

    # dev tools
    'metalsmith-serve': '*'
    'metalsmith-watch': '*'
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
