import path from 'path';
import crypto from 'crypto';

export default function drafts(config={}) {
    return function(files, metalsmith, done) {
        Object.keys(files).forEach(filepath => {
            var page = files[filepath];
            if (page.draft) {
                delete files[filepath]
                var pathname = path.dirname(filepath);
                var filename = path.basename(filepath);
                var hash = crypto
                        .createHash('md5')
                        .update(pathname)
                        .digest('base64')
                        .replace(/==$/,'');
                files[`drafts/${hash}/${filename}`] = page;
            }
        });
        done();
    }
}
