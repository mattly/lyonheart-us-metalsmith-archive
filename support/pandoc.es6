import child_process from 'child_process';
import path from 'path';


function apiece(arr, fn, cb) {
    var next = (err) => {
        if (err) { return cb(err); }
        if (arr.length > 0) { fn(arr.shift(), next); }
        else { cb(); }
    }
    process.nextTick(next);
};

const cheerio = require('cheerio');
const katex = require('katex');

export function convert(input, cb) {
    var cp = child_process.exec("pandoc -t html5 --smart --ascii",
                                function(err, stdout, stderr){
                                    if (err) { return cb(err); }
                                    var doc = cheerio.load(stdout);
                                    var maths = doc('.math')
                                    var idx = 0;
                                    while (idx < maths.length) {
                                        var theMath = maths.eq(idx);
                                        idx += 1;
                                        var text = theMath.text();
                                        var rendered = katex.renderToString(text);
                                        theMath.html(rendered);
                                    }
                                    cb(null, doc.html())
                                });
    cp.stdin.write(input);
    cp.stdin.end();
}

export function pandoc(config={}) {
    return function(files, metalsmith, done) {
        var markdownFiles = Object.keys(files)
            .filter(file => path.extname(file).match(/^\.(md|markdown)$/));
        var cfile = function(filepath, cb) {
            var file = files[filepath],
                body = file.contents.toString();
            convert(body, function(err, html){
                if (err) { return cb(err); }
                var htmlpath = filepath.replace(/\.(md|markdown)$/, '.html');
                files[htmlpath] = file;
                file.contents = new Buffer(html);
                delete files[filepath];
                cb();
            });
        };
        apiece(markdownFiles, cfile, done);
    }
};
