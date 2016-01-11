function isEscape (char) {
    // 0x5C: \
    return char === 0x5C
}

function extractLoze (input, start, max, nest=0) {
    let inBody, bodyStart, bodyEnd, body,
        inAttr, attrStart, attrEnd, attr,
        idStart, idEnd, id, tag, valid,
        pos = start, prevChar

    while (pos <= max) {
        let thisChar = input.charCodeAt(pos)
        if (! inBody && ! inAttr && pos >= max) valid = true
        else if (inAttr || inBody) {
            if (isEscape(thisChar)) pos++
            else if (thisChar === 0x25CA) {
                let {end} = extractLoze(input, pos+1, max, nest+1)
                pos = end
            }
            else if (inAttr && thisChar === 0x5D) { // 0x5D: ]
                attrEnd = pos
                inAttr = false
            }
            else if (inBody && thisChar === 0x7D) { // 0x7D: }
                bodyEnd = pos
                inBody = false
                valid = true
                break
            }
        }
        // 0x23: #
        else if (! attrStart && ! bodyStart && thisChar === 0x23) idStart = pos + 1
        else if (! inBody && ! inAttr) {
            if (! attrStart && thisChar === 0x5B) { // 0x5B: [
                inAttr = true
                idEnd = pos
                attrStart = pos + 1
            }
            else if (! bodyStart && thisChar === 0x7B) {
                inBody = true
                if (! idEnd) idEnd = pos
                bodyStart = pos + 1
            }
            else {
                let isTagOrId =  ((thisChar >= 97 && thisChar <= 122) || // a-z
                                  (thisChar >= 65 && thisChar <= 90)  || // A-Z
                                  (thisChar >= 48 && thisChar <= 57)  || // 0-9
                                  thisChar === 45 || thisChar === 95  || // - or _
                                  (idStart && thisChar === 47)           // /
                                 )
                if (! isTagOrId) {
                    valid = true
                    if (! idEnd) idEnd = pos
                    pos--
                    break
                }
            }
        }
        pos++
        prevChar = thisChar
    }
    if (valid && nest < 1) {
        let tagEnd = idStart || attrStart || bodyStart || pos
        if (idStart || attrStart || bodyStart) tagEnd--
        tag = input.slice(start, tagEnd)
        if (idStart) id = input.slice(idStart, idEnd)
        if (attrStart) attr = input.slice(attrStart, attrEnd)
        if (attr && attr.match(/\=/)) {
            let out = {},
                segments = attr.split(/\=/),
                prevKey = segments.shift().trim()
            while (segments.length > 0) {
                let thisChunk = segments.shift().trim()
                let val, nextKey, etc_
                if (segments.length > 0) {
                    [val, nextKey, etc_] = thisChunk.split(/\s([-\w]+)$/)
                }
                else val = thisChunk
                out[prevKey] = val.trim()
                prevKey = nextKey
            }
            attr = out
        }
        if (attr == null) attr = {}
        if (bodyStart) body = input.slice(bodyStart, bodyEnd)
    }
    return { valid: valid, start: start, tag: tag, id: id, attr: attr, content: body, end: pos }
}

export default function loze () {
    let loze = {
        tags: {}
    }

    loze.define = function define (tag, render, reconcile) {
        loze.tags[tag] = {render: render, reconcile: reconcile}
        return loze
    }

    loze.render = function (input, env) {
        let pos = -1,
            prevChar
        while (pos <= input.length) {
            pos++
            let thisChar = input.charCodeAt(pos)
            // 0x5C: \
            if (isEscape(thisChar) && input.charCodeAt(pos+1) === 0x25CA) {
                input = input.slice(0,pos) + input.slice(pos+1)
                pos++
            }
            // 0x25CA: ◊
            else if (thisChar === 0x25CA) {
                let tag = extractLoze(input, pos+1, input.length)
                if (tag.valid && loze.tags[tag.tag]) {
                    let result = loze.tags[tag.tag].render(tag, env),
                        head = input.slice(0, pos),
                        tail = input.slice(tag.end + 1)
                    if (result == null) result = ''
                    input = head + result + tail
                    pos--
                }
            }
        }
        Object.keys(loze.tags)
            .filter(tag => loze.tags[tag].reconcile)
            .forEach(function reconcileTag (tag) {
                input = loze.tags[tag].reconcile(input, env)
            })
        return input
    }

    return loze
}
