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


Phaser.Msx = Phaser.Msx || {}


Phaser.Msx.Slider = function (game, x, y, callback, callbackContext, dir, length, style) {
    x = x || 0
    y = y || 0

    this.game = game
    this.dir = dir || Phaser.Msx.Slider.HORIZONTAL
    this.callback = callback || 0
    this.callbackContext = callbackContext || this
    this.style = style || Phaser.Msx.CONTROL
    this.style = Object.assign({}, this.style)

    this._size = Phaser.Msx.styleSize(this.style)
    this.length = length || this._size * 5

    this.style.fillOut = this.style.fill

    Phaser.Image.call(this, game, x, y)

    // do type checks  
    this.value = 1.0
    this._graphics = this.game.make.graphics(0, 0)

    this._over = false
    this._drag = null

    this.inputEnabled = true
    this.input.useHandCursor = true

    this.events.onInputOver.add(this._onInputOver, this)
    this.events.onInputOut.add(this._onInputOut, this)
    this.events.onInputDown.add(this._onInputDown, this)
    this.events.onInputUp.add(this._onInputUp, this)
    this.draw()
}


Phaser.Msx.Slider.VERTICAL = 1
Phaser.Msx.Slider.HORIZONTAL = 2


Phaser.Msx.Slider.prototype = Object.create(Phaser.Image.prototype)
Phaser.Msx.Slider.prototype.constructor = Phaser.Msx.Slider


Phaser.Msx.Slider.prototype.draw = function () {
    var fill = parseInt(this.style.fill.substring(1), 16)
    this._graphics.clear()
    this._graphics.lineStyle(2, fill)

    var dx = 0
    var dy = 0
    var d = (this.length - this._size) * this.value
    if (this.dir == Phaser.Msx.Slider.VERTICAL) {
        dy = d
        this._graphics.moveTo(this._size / 2, 0)
        this._graphics.lineTo(this._size / 2, this.length)
    } else {
        dx = d
        this._graphics.moveTo(0, this._size / 2)
        this._graphics.lineTo(this.length, this._size / 2)
    }

    this._graphics.beginFill(fill)
    this._graphics.drawCircle(
        dx + (this._size / 2),
        dy + (this._size / 2),
        this._size - 24
    )
    this._graphics.endFill()
    this.loadTexture(this._graphics.generateTexture())
}


Phaser.Msx.Slider.prototype.setValue = function (value) {
    if (value < 0.0) {
        value = 0.0
    } else if (value > 1.0) {
        value = 1.0
    }
    this.value = value
    this.draw()
}


Phaser.Msx.Slider.prototype._onInputOver = function () {
    if (this._drag == null) {
        this.style.fill = this.style.fillOver
    }
    this._over = true
    this.draw()
}


Phaser.Msx.Slider.prototype._onInputOut = function () {
    if (this._drag == null) {
        this.style.fill = this.style.fillOut
    }
    this._over = false
    this.draw()
}


Phaser.Msx.Slider.prototype._onInputDown = function () {
    if (this._over) {
        this.style.fill = this.style.fillDown

        this._drag = {
            x: this.game.input.activePointer.worldX,
            y: this.game.input.activePointer.worldY,
            timer: this.game.time.create(false)
        }
        this._drag.timer.loop(10, this._onMove, this)
        this._drag.timer.start()

        this.draw()
    }
}


Phaser.Msx.Slider.prototype._onInputUp = function () {
    if (this._over) {
        this.style.fill = this.style.fillOver
    } else {
        this.style.fill = this.style.fillOut
    }
    if (this._drag) {
        this._drag.timer.stop()
        this._drag.timer.destroy()
        // XXX: add support for taping to set location
        this._drag = null
    }
    this.draw()
}


Phaser.Msx.Slider.prototype._onMove = function () {
    var delta = this.game.input.activePointer.worldX - this._drag.x
    if (this.dir === Phaser.Msx.Slider.VERTICAL) {
        delta = this.game.input.activePointer.worldY - this._drag.y
    }
    this._drag.x = this.game.input.activePointer.worldX
    this._drag.y = this.game.input.activePointer.worldY
    // calculate current location as pixel offset
    var length = this.length - this._size
    var px = this.value / (1.0 / length)
    var originalValue = this.value
    this.setValue((px + delta) * (1.0 / length))

    this.draw()
    if (this.value != originalValue) {
        this.callback.call(this.callbackContext, this.value)
    }
}

