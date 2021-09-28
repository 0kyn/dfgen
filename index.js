#!/usr/bin/env node

const { Command } = require('commander');
const { Generator } = require('./generator.js')
const pjson = require('./package.json')

const program = new Command()

program
    .version(pjson.version)

program
    .description('Dummy File Generator')

program
    .description('Define type of file')
    .option('-t, --type <type>', 'type of file (pdf|jpg|png)')
    .option('-wh, --width-height [width/height]', 'width/height in px', '400/400')
    .option('-txt, --text-content [txt]', 'customize text content')
    .option('-o, --output [filename]', 'output filename')
    .action((opt) => {
        let config = {
            type: opt.type,
            textContent: opt.textContent,
            output: opt.output
        }

        if (['jpg', 'png', 'gif'].indexOf(opt.type) > -1) {
            config.widthHeight = opt.widthHeight
        }

        const _g = new Generator(config)
        _g.make()
    })


program.parse(process.argv)