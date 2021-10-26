const fs = require('fs')
const exiftool = require('../helpers/exiftool')

module.exports.exit = (type, message, code = 1) => {
    const prefix = type[0].toUpperCase() + type.slice(1)
    type = type === 'warning' ? 'warn' : type

    console[type](`${prefix}:`, message)
    process.exit(code)
}

module.exports.getMimeType = (fileType) => {
    const mimeType = require('../data/mime-type.json')

    if (typeof mimeType[fileType] === 'undefined') {
        this.exit('error', `'${fileType}' mime type is not supported`)
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
    const fileSignature = require('../data/file-signature.json')

    if (typeof fileSignature[fileType] === 'undefined') {
        this.exit('warning', `'${fileType}' signature is not supported. Cannot corrupt file.`)
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
        this.exit('warning', `'${string}' is an invalid value. Cannot alter file size.`)
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