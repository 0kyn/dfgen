const { createCanvas } = require('canvas')

class Canvas {

    constructor(config) {
        this.canvas = createCanvas(config.width, config.height, config.type)

        const context = this.canvas.getContext('2d')
        context.fillStyle = '#fff'
        context.fillRect(0, 0, config.width, config.height)
        if (config.textContent) {
            context.font = `bold ${config.fontSize}pt Arial`
            context.fillStyle = "#000"
            context.textAlign = 'center'
            context.fillText(config.textContent, config.width / 2, config.height / 2)
        }

        this.context = context
    }

    toBuffer(mimeType) {
        return this.canvas.toBuffer(mimeType)
    }

}

module.exports.Canvas = Canvas