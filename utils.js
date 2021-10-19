module.exports.getMimeType = (fileType) => {
    const mimeType = {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif'
    }

    return mimeType[fileType]
}

module.exports.setOutputFilename = (prefix, extension) => {
    const date = new Date()

    const dateIsoSplit = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')

    const dateFormat = dateIsoSplit[0]
    const hourFormat = dateIsoSplit[1].match(/(.*)\./)[1].replace(/:/g, '')

    const outputFilename = `${prefix}-${dateFormat}-${hourFormat}.${extension}`

    return outputFilename
}

module.exports.getFileSignature = (fileType) => {
    const fileSignature = {
        invalid: [0, 1, 2, 3],
        pdf: [0x25, 0x50, 0x44, 0x46],
        jpg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        gif: [0x47, 0x49, 0x46]
    }

    return fileSignature[fileType]
}