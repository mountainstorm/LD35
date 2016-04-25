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


Phaser.Msx.Options = function () {
    Phaser.State.call(this)
    this.controls = []
    this.titleSpacing = 2.0
}


Phaser.Msx.Options.prototype = Object.create(Phaser.State.prototype)
Phaser.Msx.Options.prototype.constructor = Phaser.Msx.Options


Phaser.Msx.Options.prototype.init = function (returnTo) {
    this.game.stage.backgroundColor = Phaser.Msx.BACKGROUND
    this.returnTo = returnTo
}


Phaser.Msx.Options.prototype.create = function () {
    // render out all the controls into a group
    this.optionsUI = this.game.add.group()
    var heading = this.createText('Options', Phaser.Msx.H1, 0)
    heading.anchor.setTo(0.5, 0)
    var y = heading.height * this.titleSpacing
    this.optionsUI.add(heading)
    this.controls.forEach(function (item) {
        var style = Object.assign({}, Phaser.Msx.CONTROL, { align: 'right' })
        if (item.spacing) {
            y += Phaser.Msx.styleSize(style) * item.spacing
        } else {
            var g = this.game.add.group()
            this.optionsUI.add(g)

            var title = this.createText(item.title, style, -heading.height / 4, y)
            title.anchor.setTo(1, 0)
            g.add(title)

            item.control.anchor.setTo(0, 0.5)
            item.control.x = heading.height / 4
            item.control.y = y + (title.height / 2)
            g.add(item.control)

            y += title.height
        }
    }, this)
    y += heading.height * this.titleSpacing
    var back = new Phaser.Msx.Button(this.game, 0, y, 'Back', this.back, this)
    this.optionsUI.add(back)

    this.optionsUI.pivot.x -= this.optionsUI.width / 2
    this.optionsUI.pivot.y = 0
    this.optionsUI.x = (this.game.width - this.optionsUI.width) / 2
    this.optionsUI.y = (this.game.height - this.optionsUI.height) / 2

    // setup esc handler
    var esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    esc.onDown.add(this.back, this)
}


Phaser.Msx.Options.prototype.createText = function (title, style, x, y) {
    x = x || 0
    y = y || 0
    if (style.transform) {
        title = style.transform(title)
    }
    return this.game.add.text(x, y, title, style)
}


Phaser.Msx.Options.prototype.back = function () {
    this.game.state.start(this.returnTo)
}
