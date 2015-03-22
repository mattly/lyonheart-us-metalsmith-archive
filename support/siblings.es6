import path from 'path';

export default function siblings(config={}){
  return function(files, ms, done){
    var dirs = new Set()
      , theseFiles, theseSiblings;
    Object.keys(files).forEach(f => dirs.add(path.dirname(f)));
    dirs.forEach(dirname => {
      theseSiblings = {};
      theseFiles = Object.keys(files).filter(f => path.dirname(f) === dirname);
      theseFiles.forEach(f => theseSiblings[path.basename(f)] = files[f]);
      theseFiles.forEach(f => files[f].siblings = theseSiblings);
    });
    done();
  }
}
