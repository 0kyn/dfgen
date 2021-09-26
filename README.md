# dfgen

dfgen is a NodeJS command line interface that creates dummy files for testing purpose.

## Installation

```bash
# local
npm install --save-dev dfgen

# global
npm install --global dfgen
```

## Usage

```bash
# local
npx dfgen --help

# global
dfgen --help
```

### Generate a blank pdf file
```bash
dfgen --type pdf 
```

### Generate a pdf file with custom text

```bash
dfgen --type pdf --text-content "This is a text content"
```

### Generate an image with custom text

```bash
dfgen --type png --text-content "This is a text inside a png"

dfgen --type jpg --text-content "This is a text inside a jpg"
```

## License

[MIT](https://choosealicense.com/licenses/mit/)