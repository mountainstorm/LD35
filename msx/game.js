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


Phaser.Msx.Game = function (title, identifier, width, height, renderer, parent, state, transparent, antialias, physicsConfig) {
    var game = this
    this.attractStates = []

    s = state || {}

    var sp = state.preload || null
    var cr = state.create || null
    s.preload = function () {
        // maintain aspect ratio
        game.time.advancedTiming = true
        game.scale.supportsFullscreen = true
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

        game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')
        if (sp) {
            sp.call(this)
        }
    }
    s.create = function () {
        // overwrite the state manager with ours
        game.toolbar = new Phaser.Msx.Toolbar(title, game.parent, game)
        if (cr) {
            cr.call(this)
        }
    }
    this.settings = new Phaser.Msx.Settings(identifier)
    Phaser.Game.call(this, width, height, renderer, parent, state, transparent, antialias, physicsConfig)
}


Phaser.Msx.Game.prototype = Object.create(Phaser.Game.prototype)
Phaser.Msx.Game.prototype.constructor = Phaser.Msx.Game

