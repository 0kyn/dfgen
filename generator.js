const fs = require('fs')
const { createCanvas } = require('canvas')
const GifEncoder = require('gif-encoder')

const u = require('./utils.js')

class Generator {
    constructor(config) {
        this.config = config

        this.config.mimeType = u.getMimeType(this.config.type)
        this.config.output = this.config.output ?? u.setOutputFilename('dummy', this.config.type)
        this.config.fontSize = 25

        const widthHeightSplit = this.config.widthHeight.split('/')
        this.config.width = parseInt(widthHeightSplit[0])
        this.config.height = parseInt(widthHeightSplit[1])
    }

    _canWriteFile(filename) {
        return !fs.existsSync(filename) || this.config.force
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

    _genPdf() {
        this._createCanvas(595, 842, 'pdf')
        fs.writeFileSync(this.config.output, this.canvasBuffer)
    }

    _genImage() {
        const width = this.config.width
        const height = this.config.height

        this._createCanvas(width, height)

        if (this.config.type !== 'gif') {
            fs.writeFileSync(this.config.output, this.canvasBuffer)
        } else {
            const gif = new GifEncoder(width, height)
            const pixels = this.canvasContext.getImageData(0, 0, width, height).data
            const file = fs.createWriteStream(`${this.config.output}`)

            gif.pipe(file)
            gif.writeHeader()
            gif.addFrame(pixels)
            gif.finish()
        }
    }

    corruptFile(filename, signatureType) {
        const tmpFile = 'file.tmp'
        const writeStream = fs.createWriteStream(tmpFile, { flags: 'w+' })
        const signature = Buffer.from(u.getFileSignature(signatureType))

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

    make() {
        if (this._canWriteFile(this.config.output)) {
            switch (this.config.type) {
                case 'pdf':
                    this._genPdf()
                    break
                case 'jpg':
                case 'png':
                case 'gif':
                    this._genImage()
                    break
                default:
                    break
            }
            if (this.config.corruptSignature) {
                this.corruptFile(this.config.output, this.config.corruptSignature)
            }
        } else {
            console.error(`File exists: ${this.config.output}. Use --force option to override file.`)
        }
    }
}

module.exports.Generator = Generator