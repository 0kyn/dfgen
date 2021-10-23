const exiftool = require('exiftool-vendored').exiftool

module.exports.get = (filename, tagname) => {
    return exiftool
        .read(filename)
        .then(tags => tags[tagname])
        .catch(err => console.error(err))
        .finally(() => exiftool.end())
}

module.exports.set = (filename, tags) => {
    return exiftool
        .write(filename, tags, ['-overwrite_original'])
        .then(() => exiftool.end())
        .catch(err => console.error(err))
        .finally(() => exiftool.end())
}