import path from 'path';
import typogr from 'typogr';

export default function smart(config={}) {
    return function(files, metalsmith, done) {
        Object.keys(files)
            .filter(filepath => path.extname(filepath) === '.html')
            .forEach(filepath => {
                let page = files[filepath],
                    contents = page.contents.toString().replace(/&quot;/g,'"'), // workaround for markdownit
                    result = typogr(contents).chain().amp().smartypants().initQuotes().caps().ord().value()
                page.contents = new Buffer(result);
            });
        done();
    }
}
