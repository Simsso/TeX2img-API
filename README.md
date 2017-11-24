# TeX Math to Image API
This Node server responds to incoming requests containing TeX math code with a rendered version (png, svg, bmp, or jpeg format). 

For example, the TeX expression `a^2+b^2=c^2` will yield the following image.

![result](https://timodenk.com/api/tex2img/a%5E2+b%5E2=c%5E2?format=png)

You can test the API at [tools.timodenk.com/tex-math-to-image-conversion](https://tools.timodenk.com/tex-math-to-image-conversion).

## Specification
### URL
Send requests to `/api/tex2img/:expression` where `:expression` is a URI-component-encoded version of the TeX expression. Such an encoded version can be created with JavaScript's `encodeURIComponent` function. 

This is an example URL: `/api/tex2img/a%5E2+b%5E2=c%5E2`

### Query Paramters
The API endpoints take two parameters.

**padding** is a numerical value greater than or equal to 0. It is the padding in pixels which will be added to the response image (except for SVG). For example: `/api/tex2img/a%5E2+b%5E2=c%5E2?padding=50`. The default value is `50` pixels.

**format** specifies the file format. Possible values are `jpeg`, `png`, `bmp`, and `svg`. The default value is `png`.

### Response Status Codes
**200 OK**. Everything worked as expected. The response payload will contain an image with the correct `Content-Type` (e.g. `image/svg+xml` for SVG images).

**414 Request-URI Too Long**. The `:expression` part of the URL exceeded the maximum length of 1000 characters.

**500 Internal Server Error**. The conversion failed. This will be mostly due to invalid TeX code. E.g. `\maxf` won't work because it must be `\max f`.

## Setup
Install using 
```
npm install
```
and run with 
```
PORT=3000 node index.js
```

Test the API at http://localhost:3000/api/tex2img/a%5E2+b%5E2=c%5E2?format=png&padding=50