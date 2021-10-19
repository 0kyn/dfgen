const fs = require('fs')
const GifEncoder = require('gif-encoder')

const { Canvas } = require('../helpers/canvas.js')

class Image {

    constructor(config) {
        this.config = config

        this.generate()
    }

    generate() {
        const canvas = new Canvas({
            width: this.config.width,
            height: this.config.height,
            textContent: this.config.textContent,
            fontSize: this.config.fontSize
        })


        if (this.config.type !== 'gif') {
            const buffer = canvas.toBuffer(this.config.mimeType)
            fs.writeFileSync(this.config.output, buffer)
        } else {
            const gif = new GifEncoder(this.config.width, this.config.height)
            const pixels = canvas.context.getImageData(0, 0, this.config.width, this.config.height).data
            const file = fs.createWriteStream(`${this.config.output}`)

            gif.pipe(file)
            gif.writeHeader()
            gif.addFrame(pixels)
            gif.finish()
        }
    }

}

module.exports.Image = Image