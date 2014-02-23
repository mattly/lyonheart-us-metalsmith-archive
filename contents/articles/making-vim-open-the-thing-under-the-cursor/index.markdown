---
title:    "Making Vim Open the Thing Under the Cursor"
summary:  easily send the '\s(\S+)\s' item under the cursor to 'open'
category: snippets
template: article.html
date:     2014-02-08 12:00
author:   mattly
location: Punta del Diablo, Uruguay
---

Lately I find myself working with READMEs or outlines or notes in
vim[^vim] which contains location text -- URLs or relative file
paths -- and I want to forward these to the MacOS X program `open` which
opens URLs in my browser and files with their designated program.

My terminal emulator lets me click a URL while holding down a modifier key, this doesn't work in [MacVim][] and it works haphazardly in my preferred setup of terminal vim under tmux[^tmux].  Besides, I use the tmux/vim combination to *avoid* using the mouse.

Figuring this was a solved problem, I came across some rather [convoluted solutions][ugh], which scan the current line for a URL-like pattern.  This doesn't work with relative file paths or with multiple locations on the same line of text.  I want the chunk of characters between chunks of whitespace.

I dug into vim's extensive help, and found `cWORD`, `c` being *current* and `WORD` is defined as:

> ... a sequence of non-blank characters, separated with white space
> <footer>
> <strong>Vim</strong> <cite>:help WORD</cite>
> </footer>


Perfect!  It's simple to create a mapping to send the `cWORD` to `open`:

```vim
nnoremap <silent><Leader>o :!open -g <cWORD><CR><CR>
```

The `-g` flag tells `open` to keep the target application in the background, a preference befitting a tmux workflow.

This strategy isn't perfect: it doesn't recognize file paths with spaces in them, but vim's `gf` navigation mechanism won't, either.  Whitespace surrounded by quotes is still whitespace, and `open` won't URL-unescape `%20`, but this solution works for me.

[vim]: http://www.vim.org/
[MacVim]: https://code.google.com/p/macvim/
[ugh]: http://vim.wikia.com/wiki/Open_a_web-browser_with_the_URL_in_the_current_line

[^vim]: In addition to code, if [configured properly](http://www.drbunsen.org/writing-in-vim/) [vim](http://www.vim.org) becomes a powerful writing editor, doubly if you've trained your fingers to work with a modal editor.

[^tmux]: [tmux](http://tmux.sourceforge.net/) is everything I liked about [emacs the window manager](http://monkey.org/~marius/emacs-as-a-tiling-window-manager.html) except that it works *with* your shell, not against it.

