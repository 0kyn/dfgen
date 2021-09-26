#!/usr/bin/env node

const { Command } = require('commander');
const { Generator } = require('./generator.js')

const program = new Command()
const _g = new Generator()

program
    .version('0.0.1')

program
    .description('Dummy File Generator')
    .option('-h, --help', 'output help')

program
    .description('Define type of file')
    .option('-t, --type <type>', 'type of file (pdf|jpg|png)')
    .option('-wh, --width-height [width/height]', 'width/height in px', '400/400')
    .option('-txt, --text-content [txt]', 'customize text content')
    .option('-o, --output [filename]', 'output filename')
    .action((opt) => {
        let params = {
            type: opt.type,
            textContent: opt.textContent,
            output: opt.output
        }

        if (['jpg', 'png'].indexOf(opt.type) > -1) {
            params.widthHeight = opt.widthHeight
        }

        _g.make(params)
    })


program.parse(process.argv)

const options = program.opts()
if (options.help) {
    console.log(`${options.help}`)
}


