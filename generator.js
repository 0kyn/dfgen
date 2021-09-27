const fs = require('fs');
const { createCanvas } = require('canvas');

class Generator {
    constructor(config) {
        this.config = config

        this.config.mimeType = this._getMimeType(this.config.type)
        this.config.output = this.config.output ?? this._setOutputFilename('dummy')
        this.config.fontSize = 25
    }

    _setOutputFilename(prefix) {
        const date = new Date()

        const dateIsoSplit = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')

        const dateFormat = dateIsoSplit[0]
        const hourFormat = dateIsoSplit[1].match(/(.*)\./)[1].replace(/:/g, '')

        const outputFilename = `${prefix}-${dateFormat}-${hourFormat}`

        return outputFilename
    }

    _createCanvas(width, height, type = null) {
        const canvas = createCanvas(width, height, type)
        const context = canvas.getContext('2d')
        context.fillStyle = '#fff'
        context.fillRect(0, 0, width, height)

        if (this.config.textContent) {
            const textContent = this.config.textContent
            context.font = `bold ${this.config.fontSize}pt Arial`
            context.fillStyle = "#000"
            context.textAlign = 'center'
            context.fillText(textContent, width / 2, height / 2)
        }

        this.canvasBuffer = canvas.toBuffer(this.config.mimeType)
    }

    _genPdf() {
        this._createCanvas(595, 842, 'pdf')
        fs.writeFileSync(`${this.config.output}.${this.config.type}`, this.canvasBuffer)
    }

    _genImage() {
        const sizeSplit = this.config.widthHeight.split('/')
        const width = parseInt(sizeSplit[0])
        const height = parseInt(sizeSplit[1])
        this._createCanvas(width, height)
        fs.writeFileSync(`${this.config.output}.${this.config.type}`, this.canvasBuffer)
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

    make() {
        switch (this.config.type) {
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