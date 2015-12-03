export default function newthought(md, options){
  md.inline.ruler.after('backticks', 'newthought', parse);
  md.renderer.rules['newthought'] = render;
}

function parse(state, silent){
  if (state.blkIndent > 0 || state.pos > 0) { return false; }
  let markerStr = '&&&',
      markerChar = markerStr.charCodeAt(0),
      pos = state.pos
  ;

  if (markerChar !== state.src.charCodeAt(pos)) { return false; }
  if (markerStr !== state.src.slice(pos, pos + markerStr.length)) { return false; }
  pos += markerStr.length;
  let max = state.posMax,
      start = pos;
  while (pos < max &&
         state.src.charCodeAt(pos) !== markerChar &&
         state.src.slice(pos, pos + markerStr.length) !== markerStr) { pos++; }
  if (! silent) {
    let token = state.push('newthought', 'span', 0);
    token.markup = '&&&';
    token.content = state.src.slice(start, pos);
  }
  state.pos = pos + markerStr.length;
  return true;
}

function render(tokens, id, options, env, self) {
  let token = tokens[id];
  return `<span class="newthought">${tokens[id].content}</span>`;
}
