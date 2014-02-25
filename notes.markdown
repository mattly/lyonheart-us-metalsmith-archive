## wintersmith

https://github.com/jnordberg/wintersmith

- contentPlugin chaining: https://github.com/jnordberg/wintersmith/issues/144
- maybe a nunjucks content type?
- how to do related by tag? https://github.com/sanjeevonline/blog.sanjeevonline.com/blob/master/templates/partials/related.jade 

## Showdown

- https://github.com/lhagan/showdown
- https://github.com/lhagan/wintersmith-showdown

problems:

- syntax highlighting
  - custom fix to wintersmith-showdown:
    it's sending the output of item.html() to the highlighter with entities, using item.text() instead
  - vimscript doesn't seem to get any kind of actual highlighting.  Why can't I use pygments instead?
    highlight.js: https://github.com/isagalaev/highlight.js/
    maybe I need to use the client-side one in addition to?

- smart quotes

  [link][text]'s uses an inverted apostrophe
  problem from the typogr module, filed an issue: https://github.com/ekalinin/typogr.js/issues/15

  neither discount nor pandoc do this
  - node-discount doesn't compile (missing node-waf) 
  - the wintersmith-pandoc module has issues do to async shelling and templates. LOLMYGOD IT HURTS

  marked doesn't do footnotes yet, but there's a PR: https://github.com/chjj/marked/pull/351


## Nunjucks 

- reference http://jlongster.github.io/nunjucks/templating.html

## Grunt todo?
- grunt s3 https://github.com/pifantastic/grunt-s3
- grunt cloudfront: https://github.com/flrent/grunt-cloudfront
