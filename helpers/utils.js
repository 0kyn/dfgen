const fs = require('fs')
const exiftool = require('../helpers/exiftool')

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

module.exports.corruptFile = (filename, signatureType) => {
    const tmpFile = 'file.tmp'
    const writeStream = fs.createWriteStream(tmpFile, { flags: 'w+' })
    const signature = Buffer.from(this.getFileSignature(signatureType))

    const readStream = fs.createReadStream(filename, { start: signature.length + 1 })
    readStream.pipe(writeStream)

    writeStream.on('finish', () => {
        const readStream2 = fs.createReadStream(tmpFile)
        const writeStream2 = fs.createWriteStream(filename, { start: 0, flags: 'r+' })
        writeStream2.write(signature)
        readStream2.pipe(writeStream2)

        writeStream2.on('finish', () => {
            fs.unlinkSync(tmpFile)
        })
    })
}

module.exports.convertToBytes = (string) => {
    const conversion = {
        b: 1,
        kb: 1000,
        mb: 1000000
    }
    const match = string.match(/^((?:[0-9])+(?:\.)?(?:[0-9])+)(b|kb|mb)?$/)

    if (!match) {
        throw new Error('Incorrect file size')
    } else {
        const value = parseFloat(match[1])
        const unit = match[2] ?? 'b'
        const valueInBytes = value * conversion[unit]

        return valueInBytes
    }
}

module.exports.genRandomString = (length) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    let string = ''
    for (let i = 0; i < length; i++) {
        string += chars[Math.floor(Math.random() * chars.length)]
    }

    return string
}

module.exports.setFileSize = (type, filename, filesize) => {
    const originalFilesize = fs.statSync(filename).size

    const newFilesize = this.convertToBytes(filesize)

    const string = this.genRandomString(newFilesize)

    const tags = type === 'pdf' ? { Description: string } : { Comment: string }

    exiftool
        .set(filename, tags)
        .then(() => true)
}