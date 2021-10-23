const fs = require('fs')

const u = require('./helpers/utils.js')
const { Image } = require('./generators/image.js')
const { Pdf } = require('./generators/pdf.js')

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

    make() {
        if (this._canWriteFile(this.config.output)) {
            switch (this.config.type) {
                case 'pdf':
                    new Pdf(this.config)
                    break
                case 'jpg':
                case 'png':
                case 'gif':
                    new Image(this.config)
                    break
                default:
                    break
            }
            if (this.config.corruptSignature) {
                u.corruptFile(this.config.output, this.config.corruptSignature)
            }
            if (this.config.fileSize) {
                u.setFileSize(this.config.type, this.config.output, this.config.fileSize)
            }
        } else {
            console.error(`File exists: ${this.config.output}. Use --force option to override file.`)
        }
    }
}

module.exports.Generator = Generator