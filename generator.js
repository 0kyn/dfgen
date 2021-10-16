const fs = require('fs');
const { createCanvas } = require('canvas');
const GifEncoder = require('gif-encoder')

class Generator {
    constructor(config) {
        this.config = config

        this.config.mimeType = this._getMimeType(this.config.type)
        this.config.output = this.config.output ?? `${this._setOutputFilename('dummy')}.${this.config.type}`
        this.config.fontSize = 25

        const widthHeightSplit = this.config.widthHeight.split('/')
        this.config.width = parseInt(widthHeightSplit[0])
        this.config.height = parseInt(widthHeightSplit[1])
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

        this.canvasContext = context
        this.canvasBuffer = canvas.toBuffer(this.config.mimeType)
    }

    _canWriteFile(filename) {
        return !fs.existsSync(filename) || this.config.force
    }

    _genPdf() {
        this._createCanvas(595, 842, 'pdf')
        fs.writeFileSync(this.config.output, this.canvasBuffer)
    }

    _genImage() {
        const width = this.config.width
        const height = this.config.height

        this._createCanvas(width, height)

        if(this.config.type !== 'gif'){
            fs.writeFileSync(this.config.output, this.canvasBuffer)
        } else {
            const gif =  new GifEncoder(width, height)
            const pixels = this.canvasContext.getImageData(0, 0, width, height).data
            const file = fs.createWriteStream(`${this.config.output}`)
            
            gif.pipe(file)
            gif.writeHeader()
            gif.addFrame(pixels)
            gif.finish()
        }
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
        if(this._canWriteFile(this.config.output)){
            switch (this.config.type) {
                case 'pdf':
                    this._genPdf()
                    break;
                case 'jpg':
                case 'png':
                case 'gif':
                    this._genImage()
                    break;
                default:
                    break;
            }
        } else {
            console.error(`File exists: ${this.config.output}. Use --force option to override file.`)
        }
    }
}

module.exports.Generator = Generator