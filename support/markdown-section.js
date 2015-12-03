const id = 'section';

export default function section(md, options) {
  md.block.ruler.after('fence', id, parse, ['paragraph', 'reference', 'list']);
  md.renderer.rules['section_open'] = renderOpen;
}

function parse(state, startLine, endLine, silent){
  if (state.blkIndent > 0) { return false; }
  let markerStr = '§'
  let markerChar = markerStr.charCodeAt(0);
  let tagStartChar = '<'.charCodeAt(0);
  let start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];
  if (markerChar !== state.src.charCodeAt(start)) { return false; }
  if (state.src.slice(start, start + markerStr.length) !== markerStr) { return false; }

  if (silent) { return true; }

  let line = state.src.slice(start, max);

  let nextLine = startLine;
  let autoClosed = false;
  for(;;) {
      nextLine++;
      if (nextLine >= endLine) { break; }

      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      if (state.sCount[nextLine] > 0) { continue; }

      let firstChar = state.src.charCodeAt(start),
          isMarker = firstChar === markerChar,
          isTag = firstChar === tagStartChar;

      if (! isMarker && ! isTag) { continue; }
      if (isMarker) {break;}
      if (isTag && ! ['sectio', 'header', 'footer'].includes(state.src.slice(start+1, start+7))) {
          break;
      }
      autoClosed = true;
      break;
  }

  let old_parent = state.parentType;
  let old_line_max = state.lineMax;
  state.parentType = 'container';
  state.lineMax = nextLine;

  let tag = 'section',
      info = {},
      untilLine = nextLine,
      lineDelta = (autoClosed ? -1 : 0);

  if (line.match(/^\§{3,}/)) {
    tag = 'footer';
  } else {
    let match = line.match(/^\§\s+(.+)/);
    if (match) {
      let title = match[1];
      let id = title.toLowerCase().trim().replace(/\s+/g, '-');
      if (id === 'header') {
        tag = 'header';
      } else if (id === 'footer') {
        tag = 'footer';
      } else {
        info = { title, id: title.toLowerCase().replace(/\s+/g, '-') }
      }
    }
  }
  if (tag === 'footer') {
    lineDelta = 1;
    untilLine = endLine;
  }
  let token = state.push(`${tag}_open`, tag, 1);
  token.markup = line;
  token.block = true;
  token.info = info;
  token.map = [startLine, untilLine];

  state.md.block.tokenize(state, startLine + 1, untilLine);

  let closeToken = state.push(`${tag}_close`, tag, -1);
  closeToken.block = true

  state.parentType = old_parent;
  state.lineMax = old_line_max;
  state.line = untilLine + lineDelta;

  return true;
}

function renderOpen(tokens, id, options, env, self) {
  let token = tokens[id];
  token.attrPush(['id', token.info.id])
  token.attrPush(['data-title', token.info.title])
  return self.renderToken(tokens, id, options, env, self);
}
