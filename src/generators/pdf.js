import fs from 'fs'

import { Canvas } from '../helpers/canvas.js'

export class Pdf {
  constructor (config) {
    this.config = config
  }

  generate () {
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
