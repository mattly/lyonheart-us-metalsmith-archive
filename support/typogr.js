import path from 'path';
import typogr from 'typogr';

export default function smart(config={}) {
    return function(files, metalsmith, done) {
        Object.keys(files)
            .filter(filepath => path.extname(filepath) === '.html')
            .forEach(filepath => {
                var page = files[filepath];
                page.contents = new Buffer(typogr.typogrify(page.contents.toString().replace(/&quot;/g,'"')));
            });
        done();
    }
}
