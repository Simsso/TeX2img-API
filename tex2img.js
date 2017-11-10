module.exports = (() => {
    const tex2svg = require('./tex2svg');
    const svg2png = require('svg2png');
    const jimp = require('jimp');

    const defaultOptions = { padding: 50, format: 'png' };

    /**
     * @param {string} tex The TeX math string, e.g. 'a^2+b^2=c^2'
     * @param {Object} [options=defaultOptions]
     * @param {function} callback Callback function with parameters error, data, and mime text (e.g. 'image/jpeg')
     */
    function convert(tex, options, callback) {
        options = validateOptions(options);
        tex2svg(tex, {}, (err, svg) => {
            if (err) return callback(err);
            const formulaSize = getSize(svg, 16);
            
            // Convert SVG to PNG
            // This is the time consuming step of the entire chain.
            svg2png(svg, formulaSize).then(buffer => {
                addPadding(buffer, formulaSize, options.padding, (err, paddedImage) => {
                    if (err) return callback(err);
                    let mime = jimp.MIME_PNG, mimeText = 'image/png';
                    if (['jpeg', 'jpg'].indexOf(options.format.toLowerCase()) !== -1) {
                        mime = jimp.MIME_JPEG;
                        mimeText = 'image/jpeg';
                    }
                    if (['bmp', 'bitmap'].indexOf(options.format.toLowerCase()) !== -1) {
                        mime = jimp.MIME_BMP;
                        mimeText = 'image/bmp';
                    }
                    paddedImage.getBuffer(mime, (err, buffer) => callback(err, buffer, mimeText));
                })
            }).catch(callback);
        });
    }

    function addPadding(buffer, formulaSize, padding, callback) {
        const backgroundSize = {
            width: Math.floor(formulaSize.width + padding),
            height: Math.floor(formulaSize.height + padding)
        }
        let background = new jimp(backgroundSize.width, backgroundSize.height, (err, background) => {
            background.background(0xFFFFFFFF)
            jimp.read(buffer, (err, image) => {
                // Print formula on top of the background image.
                paddedImage = background.blit(image, Math.floor(padding / 2), Math.floor(padding / 2));
                if (err) return callback(err);
                callback(undefined, paddedImage)
            });
        });
    }

    /**
     * @param {string} svg 
     * @param {number} scale Scaling factor for the output parameters
     * @returns {Object}
     */
    function getSize(svg, scale) {
        return {
            width: getAttribute(svg, 'width', parseFloat) * scale,
            height: getAttribute(svg, 'height', parseFloat) * scale
        };
    }

    /**
     * Searches for the first occurence of an attribute in an XML string and returns the value.
     * The attribut may not contain quotes.
     * Returns undefined if the attribute could not be found.
     * @param {string} svg The XML string.
     * @param {string} attributeName The name of the attribute to look for.
     * @param {function} [parserFunction=Identity function] A parser function that will be applied to the found string value.
     */
    function getAttribute(xml, attributeName, parserFunction) {
        if (typeof parserFunction !== 'function') parserFunction = x => x; // use identity function by default

        const attributeMatchString = ' ' + attributeName + '="';
        const valueStartIndex = xml.indexOf(attributeMatchString); // search for the attribute

        if (valueStartIndex === -1) return undefined;
        const xmlPart = xml.substring(valueStartIndex + attributeMatchString.length);
        const endIndex = xmlPart.indexOf('"'); // find quote that ends the attribute value
        if (endIndex === -1) return undefined;

        let value = xmlPart.substring(0, endIndex);
        value = parserFunction(value);
        return value;
    }

    /**
     * Validates an options object and applies default values if necessary.
     * @param {Object} options Conversion options. 
     * @returns {Object}
     */
    function validateOptions(options) {
        if (typeof options !== 'object') {
            options = {};
        }

        // padding
        if (typeof options.padding !== 'number') {
            options.padding = parseInt(options.padding, 10);
        }
        if (isNaN(options.padding) || options.padding < 0) {
            options.padding = defaultOptions.padding;
        }

        // format
        if (typeof options.format !== 'string') {
            options.format = defaultOptions.format;
        }

        return options;
    }

    return convert;
})();