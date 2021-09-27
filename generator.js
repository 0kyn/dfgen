const fs = require('fs');
const PDFDocument = require('pdfkit')
const { createCanvas } = require('canvas');

class Generator {
    constructor(config) {
        this.config = config
        this.params = {
            output: this._setOutputFilename('dummy'),
            fontSize: 25
        }
    }

    _setOutputFilename(prefix) {
        const date = new Date()

        const dateIsoSplit = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')

        const dateFormat = dateIsoSplit[0]
        const hourFormat = dateIsoSplit[1].match(/(.*)\./)[1].replace(/:/g, '')

        const outputFilename = `${prefix}-${dateFormat}-${hourFormat}`

        return outputFilename
    }

    _genPdf() {
        const doc = new PDFDocument()
        doc.pipe(fs.createWriteStream(`${this.params.output}.pdf`))

        if (this.params.textContent) {
            doc
                .fontSize(this.params.fontSize)
                .text(this.params.textContent, 100, 100)

        }
        doc.end()
    }

    _genImage() {
        const sizeSplit = this.params.widthHeight.split('/')
        const width = parseInt(sizeSplit[0])
        const height = parseInt(sizeSplit[1])
        console.log(width, height)
        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        context.fillStyle = '#fff'
        context.fillRect(0, 0, width, height)

        if (this.params.textContent) {
            const textContent = this.params.textContent
            context.font = `bold ${this.params.fontSize}pt Arial`
            context.fillStyle = "#000"
            context.textAlign = 'center'
            context.fillText(textContent, width / 2, height / 2)
        }

        const buffer = canvas.toBuffer(this.params.mimeType)

        fs.writeFileSync(`${this.params.output}.${this.params.type}`, buffer)
    }

    _genGif() {
        console.log('@todo')
    }

    _getMimeType(fileType) {
        const mimeType = {
            pdf: 'application/pdf',
            jpg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif'
        }

        return mimeType[fileType];
    }

    _setParams(params) {
        for (let key in params) {
            if (params[key]) {
                this.params[key] = params[key]
            }
        }
        this.params.mimeType = this._getMimeType(this.params.type)
    }

    make(params) {
        this._setParams(params)

        switch (this.params.type) {
            case 'pdf':
                this._genPdf()
                break;
            case 'jpg':
            case 'png':
                this._genImage()
                break;
            case 'gif':
                this._genGif()
                break;
            default:
                break;
        }
    }
}

module.exports.Generator = Generator