const RSS = require('rss');
const moment = require('moment');
const rfc822 = (date) => moment(new Date(date)).format("ddd, DD MMM YYYY HH:mm:ss ZZ");

export default function rss(config={}) {

  return function (files, metalsmith, done) {
    var { site, collections } = metalsmith.metadata();

    Object.keys(config.collections)
    .forEach(name => {
      var setup = config.collections[name];
      var collection = collections[name];
      var feed = new RSS({
        title: `${site.owner} | ${site.name}`,
        description: site.description,
        feed_url: `${site.url}/${setup.path}`,
        site_url: site.url,
        pubDate: rfc822(collection[0].date),
        language: "en"
      });
      collection
      .slice(0, 11)
      .forEach(item => {
        feed.item({
          title: item.title,
          description: item.innerContents.toString(),
          url: item.full_url,
          guid: item.full_url,
          author: item.author,
          date: rfc822(item.date)
        });
      });
      files[setup.path] = {
        contents: new Buffer(feed.xml('  '))
      };
    })
    done();
  }
}
