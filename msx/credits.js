/*
 * Copyright (c) 2016 Mountainstorm
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
*/


//= require attract.js


Phaser.Msx.Credits = function () {
    Phaser.Msx.Attract.call(this)
    this.creditSpacing = 2.5
    this.credits = []
}


Phaser.Msx.Credits.prototype = Object.create(Phaser.Msx.Attract.prototype)
Phaser.Msx.Credits.prototype.constructor = Phaser.Msx.Credits


Phaser.Msx.Credits.prototype.create = function () {
    Phaser.Msx.Attract.prototype.create.call(this, true)

    // create a group which contains all the credits
    this.creditsUI = this.game.add.group()

    var off = this.createText('Credits', Phaser.Msx.H1)
    this.credits.forEach(function (credit) {
        off = this.createText(credit.title, Phaser.Msx.H2, off)
        off = this.createText(credit.person, Phaser.Msx.H3, off)
    }, this)

    // skip on click
    Phaser.Msx.Attract.prototype.init.call(this, true)

    // scroll the text
    var scroll = this.game.add.tween(this.creditsUI).to(
        { y: -this.creditsUI.height - this.game.world.height },
        10000,
        Phaser.Easing.Linear.None,
        true
    )
    scroll.onComplete.add(function () {
        this.nextAttract()
    }, this)
}


Phaser.Msx.Credits.prototype.createText = function (title, style, off) {
    off = off || this.game.world.height
    if (style.transform) {
        title = style.transform(title)
    }
    var text = this.game.add.text(this.game.world.centerX, off, title, style)
    text.anchor.setTo(0.5, 0)
    this.creditsUI.add(text)

    var space = this.creditSpacing
    if (style === Phaser.Msx.H2) {
        space = 1
    }
    return off + (text.height * space)
}
