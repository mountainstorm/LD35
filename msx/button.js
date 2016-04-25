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


Phaser.Msx.Button = function (game, x, y, info, callback, callbackContext, style) {
    x = x || 0
    y = y || 0

    this.game = game
    this.callback = callback || 0
    this.callbackContext = callbackContext || this
    this.style = style || Phaser.Msx.CONTROL
    this.style = Object.assign({}, this.style)

    this.style.fillOut = this.style.fill

    Phaser.Image.call(this, game, x, y)

    // do type checks  
    if (typeof info === 'string') {
        this.state = false        
        this.toggle = false
        this.text = info
        if (this.style.transform) {
            this.text = this.style.transform(this.text)
        }
        this.draw = this.drawText
        this.buttonType = Phaser.Msx.Button.BUTTON

        this._text = this.game.make.text(0, 0, this.text, this.style)
        var align = 0.5
        if (this.style.align) {
            align = { 'left': 0, 'center': 0.5, 'right': 1 }[this.style.align]
        }
        this._text.anchor.setTo(align, 0)
        this.addChild(this._text)

    } else if (typeof info == 'boolean') {
        this.state = info
        this.toggle = true
        this.draw = this.drawCheckbox
        this.buttonType = Phaser.Msx.Button.CHECKBOX

        this._size = Phaser.Msx.styleSize(this.style)
        this._graphics = this.game.make.graphics(0, 0)
    } else if (typeof info == 'object') {
        this.state = false
        this.toggle = false
        this.group = info
        this.draw = this.drawRadio
        this.buttonType = Phaser.Msx.Button.RADIO

        this._size = Phaser.Msx.styleSize(this.style)
        this._graphics = this.game.make.graphics(0, 0)
    }

    this._over = false

    this.inputEnabled = true
    this.input.useHandCursor = true

    this.events.onInputOver.add(this._onInputOver, this)
    this.events.onInputOut.add(this._onInputOut, this)
    this.events.onInputDown.add(this._onInputDown, this)
    this.events.onInputUp.add(this._onInputUp, this)

    /*
     * XXX: vicious hack to support buttons in paused mode
     * probably wont work with check/radio boxes as width/height
     * wont be right
     */
     if (this.buttonType == Phaser.Msx.Button.BUTTON) {
        this._onDownBackup = this.game.input.onDown.add(function (event) {
            if (this._pointerInside(event)) {
                if (this.game.paused) {
                    this._over = true
                    this._onInputDown()
                }
            }
        }, this)
        this._onUpBackup = this.game.input.onUp.add(function (event) {
            if (this._over) {
                if (this.game.paused) {
                    this._onInputUp()
                    this._over = false
                }
            }
        }, this)
    }
    this.draw()
}


Phaser.Msx.Button.TEXT = 1
Phaser.Msx.Button.CHECKBOX = 2
Phaser.Msx.Button.RADIO = 3


Phaser.Msx.Button.prototype = Object.create(Phaser.Image.prototype)
Phaser.Msx.Button.prototype.constructor = Phaser.Msx.Button


Phaser.Msx.Button.prototype._pointerInside = function (event) {
    var bounds = this.getBounds()
    return event.x > (bounds.x - this._text.width / 2) &&
           event.x < (bounds.x + this._text.width / 2) &&
           event.y > bounds.y &&
           event.y < (bounds.y + this._text.height)
}


Phaser.Msx.Button.prototype.destroy = function () {
    if (this._onDownBackup) {
        this._onDownBackup.detach()
        this._onDownBackup = null
    }
    if (this._onUpBackup) {
        this._onUpBackup.detach()
        this._onUpBackup = null
    }
    Phaser.Image.prototype.destroy.call(this)
}


Phaser.Msx.Button.prototype.drawText = function () {
    this._text.fill = this.style.fill
}


Phaser.Msx.Button.prototype.drawCheckbox = function (down) {
    var fill = parseInt(this.style.fill.substring(1), 16)
    this._graphics.clear()
    this._graphics.lineStyle(2, fill)
    this._graphics.drawRect(0, 0, this._size, this._size)

    if (this.state || down) {
        this._graphics.beginFill(fill)
        this._graphics.drawRect(12, 12, this._size - 24, this._size - 24)
        this._graphics.endFill()
    }
    this.loadTexture(this._graphics.generateTexture())
}


Phaser.Msx.Button.prototype.drawRadio = function (down) {
    var fill = parseInt(this.style.fill.substring(1), 16)
    this._graphics.clear()
    this._graphics.lineStyle(2, fill)

    this._graphics.drawCircle(
        this._size / 2,
        this._size / 2,
        this._size
    )

    if (this.state || down) {
        this._graphics.beginFill(fill)
        this._graphics.drawCircle(
            this._size / 2,
            this._size / 2,
            this._size - 24
        )
        this._graphics.endFill()
    }
    this.loadTexture(this._graphics.generateTexture())
}


Phaser.Msx.Button.prototype.setState = function (to) {
    if (to === undefined) {
        to = !this.state // toggle
    }
    if (this.buttonType == Phaser.Msx.Button.RADIO && !this.state) {
       this.state = to
        if (state == true) {
            // XXX: disable everything else in group
            this.group.forEach(function (el) {
                if (el !== this) {
                    // don't call setState as it will recurse
                    // no idea why we need to reset the fill - we just do
                    el.style.fill = el.style.fillOut
                    el.state = false
                    el.draw()
                }
            }, this)
        }
    } else if (this.toggle) {
        this.state = to
    }
    this.draw()
}


Phaser.Msx.Button.prototype._onInputOver = function () {
    this.style.fill = this.style.fillOver
    this._over = true
    this.draw()
}


Phaser.Msx.Button.prototype._onInputOut = function () {
    this.style.fill = this.style.fillOut
    this._over = false
    this.draw()
}


Phaser.Msx.Button.prototype._onInputDown = function () {
    if (this._over) {
        this.style.fill = this.style.fillDown
        this.draw(true)
    }
}


Phaser.Msx.Button.prototype._onInputUp = function () {
    if (this._over) {
        this.style.fill = this.style.fillOver
        this.setState() // toggle        
        this.callback.call(this.callbackContext, this.state)
    }
}

