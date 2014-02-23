## wintersmith

https://github.com/jnordberg/wintersmith

- contentPlugin chaining: https://github.com/jnordberg/wintersmith/issues/144
- maybe a nunjucks content type?
- how to do related by tag? https://github.com/sanjeevonline/blog.sanjeevonline.com/blob/master/templates/partials/related.jade 

## Showdown

- https://github.com/lhagan/showdown
- https://github.com/lhagan/wintersmith-showdown

problems:

- [link][text]'s the following apostraphe becomes the wrong smart quote.
- custom fix to syntax highlighter plugin, it needs to use "item.text()" instead of "item.html()"

maybe just switch to marked or pandoc

- marked lacks footnote support, maybe I can do a PR?
  oh there already is one: https://github.com/chjj/marked/pull/351

- maybe check the typogr module? oh, that's what's doing this in the first place :/

## Nunjucks 

- reference http://jlongster.github.io/nunjucks/templating.html

## Grunt todo?
- grunt s3 https://github.com/pifantastic/grunt-s3
- grunt cloudfront: https://github.com/flrent/grunt-cloudfront
