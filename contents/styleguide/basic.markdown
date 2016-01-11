---
title: Basic Styleguide
layout: styleguide
date: 2015-12-20T14:10:00
styles:
  - //cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css
---

§ Lead

This is the "lead" section. It comes before the header, and has smaller type. This section
works as a foreward to the main piece.

◊banner-header[
    image = banner.jpg
    textClass = top-30
]{
# Titling Articles
## This is the longer subtitle that is the hook
}

§ Main

The title is ◊val#page/title.

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
marks that begin a block element.

Words in ALL CAPS are wrapped in `.caps` and set slightly smaller. Ampersands --
& -- are wrapped in `.amp` and set slightly larger.

The suffix of ordinals -- 1st, 2nd, 3rd -- are wrapped in `.ord`, set slightly
smaller and in superscript.

While hard to demonstrate, widows are prevented with `&nbsp;` entites at the end
of block elements.

1. Lists are discouraged in body text (they disrupt narrative flow and encourage
thinking in terms of bullet-points).
2. But should you need one.
3. This is how an ordered list looks.

- This is an unordered list.
- Because who doesn't like disorder?

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

## Common Markdown Constructs

and even tables:

ID | Baller | Movie
-- | ------ | -----
 1 | Frank Sinatra | Ocean's Twelve
 2 | Steve McQueen | Bullitt
 3 | Sean Connery | Zardoz


## Markdown Extensions

### Lozenge Tags

Lozenge tags are a sort-of inline macro.  In their simple form, they can expand
to html tags, but with callbacks they may be used for more complicated things
such as components or margin notes.

◊newthought{This is a newthought} that intros a new section. Use it with the
`\◊newthought` tag.

◊aside{This is the aside's content. If we make it just a bit longer it will take
up multiple lines.}

This paragraph has an aside. They are conceptually much simpler than *notes* of
the foot or side variety, require less technical overhead, less styling
overhead, and all you have to do in return is write them with a bit of a broader
context, since they do not reference a *specific* point in the text. Asides
should appear in the document *before* the block content they relate to. On
mobile, they will be above that content, and elsewhere next to it.

◊def#foo{Bar}

You can define variables with `\◊def#varname{value}` and then render them inline with
`\◊val#varname`. For example, earlier we defined `\◊def#foo{Bar}` and here you can see that
it is indeed `◊val#foo`.

Math is rendered via [KaTeX][] `\◊math` tags, which can be pre-rendered to html
and displayed entirely with CSS, unlike most math-in-html solutions that exist.
Inline math looks like ◊math{t = m / 30 + p / (r + c)} or even just ◊math{p}.
KaTeX requires a stylesheet, which I've included manually in this document's
frontmatter -- though I'd eventually like to detect KaTeX usage and include it
automatically.

[KaTeX]: https://github.com/Khan/KaTeX


◊quote{
Never trust anything you read on the internet.
◊quote-source{&ndash; [Abraham Lincoln][never-believe]}
}

[never-believe]: http://www.edwest.co.uk/spectator-blogs/never-trust-anything-you-read-on-the-internet-as-abraham-lincoln-said/

Epigraphs are a leading quote. Use them to indicate...

§§§
§ Further Reading
## Further Reading

This is the further reading section.

[**Linked Piece Title**](#) and a brief description:

> Followed by perhaps an excerpt in a blockquote.

◊include[colophon.markdown]
