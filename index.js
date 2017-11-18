const express = require('express')
const app = express()

const tex2img = require('./tex2img')
const tex2svg = require('./tex2svg')

// TeX math code is passed in the URL
app.get('/api/tex2img/:tex', (req, res) => {
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
    else {
        tex2img(req.params.tex, req.query, (err, img, mime) => {
            if (err) { 
                console.log(err)
                return res.status(500).send(err)
            }
            res.set('Content-Type', mime)
            res.send(img)
        })
    }
})

const port = process.env.PORT || 3002;
app.listen(port, 'localhost', () => console.log('API listening on port ' + port))