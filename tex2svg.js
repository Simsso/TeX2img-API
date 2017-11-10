module.exports = (() => {
    const mathjax = require('mathjax-node');
    mathjax.config({
        MathJax: { }
    });
    mathjax.start();

    /**
     * 
     * @param {string} tex The TeX math string, e.g. "a^2+b^2=c^2"
     * @param {Object} [options={}] Not used
     * @param {function} callback Callback function with error and data parameter.
     */
    function convert(tex, options, callback) {
        mathjax.typeset({
            ex: 32,
            math: tex,
            format: "TeX",
            svg: true // SVG output
        }, function (data) {
            if (data.errors) return callback(data.errors);
            callback(undefined, data.svg);
        });
    }

    return convert
})();