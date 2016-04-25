/*
 * Copyright (c) 2016 Mountainstorm
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


Phaser.Msx = Phaser.Msx || {}


Phaser.Msx.shapeFontURL = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'


Phaser.Msx.CONTROL = { font: '40px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00', transform: function (text) { return text.toUpperCase() } }
Phaser.Msx.H1 = { font: '64px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00', transform: function (text) { return text.toUpperCase() } }
Phaser.Msx.H2 = { font: '56px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00', transform: function (text) { return text.toUpperCase() } }
Phaser.Msx.H3 = { font: '56px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00' }

Phaser.Msx.BACKGROUND = '#250918'


Phaser.Msx.styleSize = function (style) {
    return parseInt(style.font.substring(0, style.font.indexOf('px')))
}


WebFontConfig = {
    google: {
        families: ['Lato']
    }
}
