const RSS = require('rss')
const moment = require('moment')
const rfc822 = (date) => moment(date).format("ddd, DD MMM YYYY HH:mm:ss ZZ")

export default function rss({sources, output, count, ...options}) {
    let maxItems = count || 10

    return function (files, metalsmith, done) {
        let { site, collections } = metalsmith.metadata(),
            feed = new RSS({
                title: `${site.owner} | ${site.name}`,
                description: site.description,
                feed_url: `${site.url}/${output}`,
                site_url: site.url,
                pubDate: rfc822(site.lastPublished),
                language: "en"
            }),
            items = []
        sources.forEach(source => items = items.concat(collections[source]))
        items.sort(item => item.date)
            .slice(0,11)
            .forEach(function(item) {
                feed.item({
                    title: item.title,
                    description: item.contents.toString(),
                    url: item.full_url,
                    guid: item.full_url,
                    author: item.author,
                    date: rfc822(item.date)
                })
            })
        files[output] = {
            contents: new Buffer(feed.xml('  '))
        }
        done()
    }
}
