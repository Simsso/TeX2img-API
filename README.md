# TeX Math to Image API
This Node server responds to requests containing TeX math code with a rendered version (png, svg, bmp, or jpeg). 

For example, the TeX expression `a^2+b^2=c^2` will yield the following image.
![result](https://timodenk.com/api/tex2img/a%5E2+b%5E2=c%5E2?format=png)

You can test the API at [tools.timodenk.com/tex-math-to-image-conversion](https://tools.timodenk.com/tex-math-to-image-conversion).

## Setup
Install using 
```
npm install
```
and run with 
```
PORT=3000 node index.js
```