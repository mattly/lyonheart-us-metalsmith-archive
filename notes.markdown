## metalsmith migration
x markdown with footnotes
x footnote extraction
x metadata sidecar
- ws -> index sibling pages
- ws -> typogr
- ws -> port templates from nunjucks -> ?
- grunt -> sass
x grunt -> coffeescript
- grunt -> grunticon


problems:

- ? relevant to marked? syntax highlighting 
  - custom fix to wintersmith-showdown:
    it's sending the output of item.html() to the highlighter with entities, using item.text() instead
  - vimscript doesn't seem to get any kind of actual highlighting.  Why can't I use pygments instead?
    highlight.js: https://github.com/isagalaev/highlight.js/
    maybe I need to use the client-side one in addition to?

- smart quotes

  [link][text]'s uses an inverted apostrophe
  problem from the typogr module, filed an issue: https://github.com/ekalinin/typogr.js/issues/15



## Nunjucks 

- reference http://jlongster.github.io/nunjucks/templating.html

## Grunt todo?
- grunt s3 https://github.com/pifantastic/grunt-s3
- grunt cloudfront: https://github.com/flrent/grunt-cloudfront
