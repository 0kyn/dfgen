# dfgen

dfgen is a NodeJS command line interface that create dummy files for testing purpose.

## Installation

```bash
# local
npm install --save-dev dfgen

# global
npm install --global dfgen
```

## Usage

```
node index.js --help
```

### Generate a blank pdf file
```bash
node index.js --type pdf 
```

### Generate a pdf file with custom text

```bash
node index.js --type pdf --text-content "This is a text content"
```

### Generate an image with custom text

```bash
node index.js --type png --text-content "This is a text inside a png"

node index.js --type jpg --text-content "This is a text inside a jpg"
```


## License

[MIT](https://choosealicense.com/licenses/mit/)