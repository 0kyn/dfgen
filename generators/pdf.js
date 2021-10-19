const fs = require('fs')
const { Canvas } = require('../helpers/canvas.js')

class Pdf {

    constructor(config) {
        this.config = config

        this.generate()
    }

    generate() {
        const canvas = new Canvas({
            width: this.config.width,
            height: this.config.height,
            type: this.config.type,
            textContent: this.config.textContent,
            fontSize: this.config.fontSize
        })

        const buffer = canvas.toBuffer(this.config.mimeType)
        fs.writeFileSync(this.config.output, buffer)
    }

}

module.exports.Pdf = Pdf