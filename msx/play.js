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


Phaser.Msx.Play = function (quitTo) {
    Phaser.State.call(this)
    var play = this
    this.pauseOptions = []
    if (quitTo) {
        this.pauseOptions.push({
            title: 'Quit', callback: function () {
                play.game.paused = false
                play.game.state.start(quitTo)
            } 
        })
    }
    this.pauseOptions.push({
        title: 'Back', callback: function () {
            play.game.paused = false
        }
    })

    // Whilst paused we can't use other states etc as so much of
    // states rely on the main game loop.  Equally a custom pause
    // isn't a good call as you can't stop physics etc.  The up
    // shot is that theres no options menu for you!

    var onfocus = window.onfocus
    window.onfocus = function (ev) {
        if (play.game) {
            play.game.paused = true // ensure whatever happens we're paused when we return
        }
        onfocus.call(this, ev)
    }
}


Phaser.Msx.Play.prototype = Object.create(Phaser.State.prototype)
Phaser.Msx.Play.prototype.constructor = Phaser.Msx.Play


Phaser.Msx.Play.prototype.init = function () {
    this.game.stage.backgroundColor = Phaser.Msx.BACKGROUND
    if (this.game.state.getCurrentState() === this) {
        var esc = PHASER.input.keyboard.addKey(Phaser.Keyboard.ESC)
        esc.onDown.add(function () {
            // toggle pause state
            if (this.game.paused == true) {
                this.game.paused = false
            } else {
                this.game.paused = true
            }
        }, this)
    }
}


Phaser.Msx.Play.prototype.paused = function () {
    if (this.game.state.getCurrentState() === this) {
        // show paused dialog
        this.pauseOverlayUI = this.game.add.group()

        var bmp = PHASER.make.bitmapData(PHASER.world.width, PHASER.world.height)
        bmp.fill(0, 0, 0, 0.3)
        this.pauseOverlayUI.add(PHASER.add.image(0, 0, bmp))

        var y = 0
        var options = this.game.add.group()
        this.pauseOptions.forEach(function (option) {
            var ctx = option.callbackContext || this
            var button = new Phaser.Msx.Button(this.game, 0, y, option.title, option.callback, ctx)
            button.anchor.set(0.5, 0)
            options.add(button)
            y += button._text.height
        }, this)
        options.x = this.game.world.centerX
        options.y = (this.game.world.height - y) / 2
        this.pauseOverlayUI.add(options)
    }
    // var op = new Options()
    // op.game = this.game
    // op.init()
    // op.preload()
    // op.create()
}


Phaser.Msx.Play.prototype.resumed = function () {
    if (this.pauseOverlayUI) {
        this.pauseOverlayUI.destroy()
    }
}
