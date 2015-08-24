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

export function convert(input, cb) {
    var cp = child_process.exec("pandoc -t html5 --smart --ascii",
                                function(err, stdout, stderr){
                                    cb(err, stdout);
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
