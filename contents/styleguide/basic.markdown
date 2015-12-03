---
title: Basic Styleguide
layout: styleguide
styles:
  - //cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css
---

§ Lead

This is the "lead" section. It comes before the header, and has smaller type. This section
works as a foreward to the main piece.

§ Header
# Titling Articles
## This is the longer subtitle that is the hook

§ Main

I want the exprssiveness of XML with the concision of Markdown. That's not too much to ask, is it?
Markdown is great, but the official spec is limiting and the common spec barely
goes beyond tables. They answer the question, "how can we make html look like text?" but not, "how
can we make rich semantic documents easier to create?"

## Bog-Standard Markdown and Styles

Standard html elements inside of an `article` tag are given particular styling
without needing additional classes. The idea is, any content inside an
`<article>` should have a consistent style, and content outside of it may be
styled differently.

Paragraphs are the fundamental unit of text and separted by newlines. They may
contain any number of inline elements, including the official
[links to something else](#), _italicized for empahsis_, **things of bold**, and
`inline code`, and the [Github Flavored Markdown](#) extension ~~Strikethrough~~.

Links in articles are underlined, but not with the default browser underline
effect -- instead some CSS trickery is used to hide the underline behind
descenders, such as in this [dummy example](#).

"Nice" typographic features include 'smart' qoutes, and outdenting of quote
marks that begin a block element. Words in ALL CAPS are wrapped in `.caps` and
set slightly smaller. Ampersands -- & -- are wrapped in `.amp` and set slightly
larger, and the suffix of ordinals -- 1st, 2nd, 3rd -- are wrapped in `.ord`,
set slightly smaller and in superscript. While hard to demonstrate, widows are
prevented with `&nbsp;` entites at the end of block elements.

On the block level, you'll find blockquotes:

> Words have more power when you attribute them to someone else.

Indented code blocks:

    (defn sum [nums] (apply + nums))

and fenced code blocks:

``` clojure
(->> numbers
     (map (partial * 2))
     (reduce +))
```

and even tables:

ID | Baller | Movie
-- | ------ | -----
 1 | Frank Sinatra | Ocean's Twelve
 2 | Steve McQueen | Bullitt
 3 | Sean Connery | Zardoz


## Markdown Extensions

### Math

Math is rendered via [KaTeX][], which can be pre-rendered to html and displayed
entirely with CSS, unlike most math-in-html solutions that exist. Inline math looks
like $$t = m / 30 + p / (r + c)$$ or even just $$p$$. KaTeX requires a stylesheet,
which I've included manually in this document's frontmatter -- though I'd
eventually like to detect KaTeX usage and include it automatically.

[KaTeX]: https://github.com/Khan/KaTeX

### Lozenge Tags

Lozenge tags are a sort-of inline macro.  In their simple form, they can expand
to html tags, but with callbacks they may be used for more complicated things
such as components or margin notes.

◊newthought{This is a newthought} that intros a new section.

This paragraph has a sidenote.◊note-marker#sidenote-example Sidenotes have a
marker in the body text and will appear in the sidebar. On mobile, sidenote
are hidden by default,◊note-marker#mobile and a red &bigoplus; marker will be
available to show them.

◊note-content#sidenote-example
This is the sidenote's content. If we add a few more words it will be multiple lines, and maybe even dip into the next paragraph.
◊

◊note-content#mobile: Lets face it, they have to be.
◊

◊def#foo{Bar}
◊var#foo

◊newthought{Lorem ipsum dolor sit} amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore [magna aliqua](#). Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.


§§§
§ Further Reading
## Further Reading

This is the further reading section.

[**Linked Piece Title**](#) and a brief description:

> Followed by perhaps an excerpt in a blockquote.

{{ colophon }}
