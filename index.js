const express = require('express')
const app = express()

const tex2png = require('./tex2png')
const tex2svg = require('./tex2svg')

// TeX math code is passed in the URL
app.get('/:tex', (req, res) => {
    let tex = req.params.tex;

    if (tex.length >= 1000) {
        return res.status(414).send({ message: 'TeX code may not be longer than 1000 characters.' })
    }

    // requested format (svg or png)
    if (req.query.format === 'svg') {
        tex2svg(tex, req.query, (err, svg) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            res.set('Content-Type', 'image/svg+xml')
            res.send(svg)
        });
    }
    else if (typeof req.query.format === 'undefined' || req.query.format === 'png') {
        tex2png(req.params.tex, req.query, (err, png) => {
            if (err) { 
                console.log(err)
                return res.status(500).send(err)
            }
            res.set('Content-Type', 'image/png')
            res.send(png)
        })
    }
    else {
        res.status(405).send({ message: 'Format query parameter must be either "png" or "svg".'})
    }
})

const port = 3002;
app.listen(port, () => console.log('API listening on port ' + port))