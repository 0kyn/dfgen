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
    .option('-t, --type <type>', 'type of file (pdf|jpg|png)')
    .option('-wh, --width-height [width/height]', 'width/height in px', '400/400')
    .option('-fs --file-size <file-size>', 'define arbitrary file size (ex: 1.4mb or 1400000)')
    .option('-txt, --text-content [txt]', 'customize text content')
    .option('-o, --output [filename]', 'output filename')
    .option('-cs, --corrupt-signature <signature-name>', 'corrupt file signature type (invalid|pdf|png|jpg|gif)')
    .option('-f, --force', 'override existing file')
    .action((opt) => {
        const _g = new Generator(opt)
        _g.make()
    })


program.parse(process.argv)