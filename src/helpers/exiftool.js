import { exiftool } from 'exiftool-vendored'

export function get (filename, tagname) {
  return exiftool
    .read(filename)
    .then(tags => tags[tagname])
    .catch(err => console.error(err))
    .finally(() => exiftool.end())
}

export function set (filename, tags) {
  return exiftool
    .write(filename, tags, ['-overwrite_original'])
    .then(() => exiftool.end())
    .catch(err => console.error(err))
    .finally(() => exiftool.end())
}
