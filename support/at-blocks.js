const inlineToken = '◊inline',
      blockToken = '◊block',
      envKey = '◊tags';

const TERMINATOR_RE = /[^a-zA-Z0-9]/
function lozSlicer(state, silent){
    let pos = state.pos,
        idx = state.src.slice(pos).search(TERMINATOR_RE);
    if (idx === 0) { return false; }
    if (idx < 0) {
        if (!silent) { state.pending += state.src.slice(pos); }
        state.pos = state.src.length;
        return true;
    }
    if (!silent) { state.pending += state.src.slice(pos, pos + idx); }
    state.pos += idx;
    return true;
}

export default function atblocks(md, plugOptions){
    md.inline.ruler.at('text', lozSlicer)
    plugOptions.tags.forEach((tag) => {
        tag.type = `◊${tag.name}`
        if (tag.inline) {
            md.inline.ruler.after('backticks', tag.type, parseInline(tag));
        } else {
            md.block.ruler.before('reference', tag.type, parseBlock(tag));
        }
        if (tag.render) {
            md.renderer.rules[tag.type] = renderer(tag);
        } else {
            md.renderer.rules[tag.type] = function(){ return ""; }
        }
        if (tag.renderers) {
            Object.keys(tag.renderers).forEach((renderer) => {
                md.renderer.rules[renderer] = tag.renderers[renderer]
            })
        }
        if (tag.onReconcile) {
            md.core.ruler.after('inline', `${tag.type}-reconcile`, reconcileTag(tag));
        }
    });
}

function renderer(tag){
    return function render(tokens, id, options, env, self) {
        let token = tokens[id]
        return tag.render(token, env.lozTags)
    }
}

function reconcileTag(tag){
    return function(state){
        if (!state.env[envKey]) { return false; }
        tag.onReconcile(state, tag);
        return true;
    }
}

const lozTagMatch = /^[-\w]+(?:#([-\w]+))?(?:\[([^\]]+)\])?(?:{([^}]+)})?/;

function parseInline(tag){
    let markerStr = `◊${tag.name}`;
    let markerChar = markerStr.charCodeAt(0);
    return function (state, silent){
        let pos = state.pos,
            max = state.posMax;
        if (markerChar !== state.src.charCodeAt(pos)) { return false; }
        if (markerStr !== state.src.slice(pos, pos + markerStr.length)) { return false; }
        pos++;
        let start = pos + 1,
            hasAttrs = false,
            inAttrs = false,
            hasBody = false,
            inBody = false,
            isValid = false
        ;
        while (pos < max)
        {
            pos++;
            let thisChar = state.src.charCodeAt(pos),
                isSpace = (thisChar === 0x20 || thisChar === 0x09 || thisChar === 0x10 );
            if (! inBody && ! inAttrs && thisChar === 0x5B  /* [ */) {
                hasAttrs = true;
                inAttrs = true;
            } else if (inAttrs && thisChar === 0x5D /* ] */) {
                inAttrs = false;
            } else if (! inBody && thisChar === 0x7B /* { */) {
                inBody = true;
                hasBody = true;
            } else if (inBody && thisChar === 0x7D /* } */) {
                inBody = false;
            } else if (! inBody && ! inAttrs && isSpace) {
                isValid = true;
                break;
            }
        }
        if (pos === max && ! inBody && ! inAttrs) { isValid = true; }
        if (! isValid) { return false; }
        if (! silent) {
            let token = state.push(tag.type, '', 0),
                innards = state.src.slice(start, pos),
                [match, id, attrs, content] = innards.match(lozTagMatch)
            ;
            token.markup = `◊${tag.name}`
            token.meta = {tag: tag.name, id: id, attrs: attrs};
            token.content = content;
            if (! state.env[envKey]) { state.env[envKey]= {}; }
            if (tag.onCapture) {
                tag.onCapture(token, state.env[envKey]);
            }
        }
        state.pos = pos;
        return true;
    }
}

function parseBlock(tag){
    let markerStr = `◊${tag.name}`,
        markerChar = markerStr.charCodeAt(0),
        endChar = markerChar;
    return function(state, startLine, endLine, silent){
        let start = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        // let p = startLine;
        // console.log('¶')
        // while (p < endLine) {
        //     let s = state.bMarks[p] + state.tShift[p], m = state.eMarks[p];
        //     console.log('¬', state.src.slice(s, m))
        //     p++;
        // }
        if (start + 1 > max) { return false; } // ◊x
        if (markerChar !== state.src.charCodeAt(start)) { return false; }
        if (markerStr !== state.src.slice(start, start + markerStr.length)) { return false; }
        let nextLine = startLine,
            closed = false;
        for(;;) {
            nextLine++;
            if (nextLine >= endLine) { break; }
            if (state.sCount[nextLine] > state.sCount[startLine]) { continue; }
            let start = state.bMarks[nextLine] + state.tShift[nextLine],
                firstChar = state.src.charCodeAt(start),
                isMarker = firstChar === markerChar;
            if (isMarker) {
                closed = true;
                break;
            }
        }
        if (!closed) { return false; }
        if (silent) { return true; }

        if (! state.env[envKey]) { state.env[envKey] = {}; }
        let line = state.src.slice(start, max),
            oldParent = state.parentType,
            oldLineMax = state.lineMax;
        state.parentType = 'container';
        state.lineMax = nextLine;
        let token = state.push(tag.type, '', 1);
        token.markup = line;
        let [match, id, attrs, content] = line.slice(1).match(lozTagMatch)
        token.meta = {tag: tag, id: id, attrs: attrs}
        token.block = true;
        token.map = [startLine, nextLine];
        state.md.block.tokenize(state, startLine+1, nextLine);

        let closeToken = state.push(`${tag.type}-close`, '', -1);
        closeToken.block = true;

        if (tag.onCapture) {
            tag.onCapture(token, state.env[envKey], state);
        }

        state.parentType = oldParent;
        state.lineMax = oldLineMax;
        state.line = nextLine + 1;
        return true;
    }
}

function setupTag(cb){
    let out = {},
        input = cb || {};
    ['onCapture', 'onReconcile', 'render', 'renderers'].forEach((c) => { out[c] = input[c]; })
    return out;
}

atblocks.inline = function(name, cb) {
    let tag = setupTag(cb);
    tag.inline = true;
    tag.name = name;
    return tag
}
atblocks.block = function(name, cb) {
    let tag = setupTag(cb);
    tag.name = name;
    return tag;
}
