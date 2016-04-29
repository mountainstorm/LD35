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


Phaser.Msx.HighScores = function () {
    Phaser.Msx.Attract.call(this)
    this.titleSpacing = 1.5
    this.maxNameLength = 3
}


Phaser.Msx.HighScores.prototype = Object.create(Phaser.Msx.Attract.prototype)
Phaser.Msx.HighScores.prototype.constructor = Phaser.Msx.HighScores


Phaser.Msx.HighScores.prototype.init = function (score) {
    Phaser.Msx.Attract.prototype.init.call(this)
    this.score = score
}


Phaser.Msx.HighScores.prototype.create = function(clickToPass, durationToPass) {
    if (clickToPass == undefined) {
        clickToPass = true
    }
    durationToPass = durationToPass || 6000

    // draw the top 10 scores
    var update = null
    this.highscores = this.loadScores()
    for (var i = 0; i < this.highscores.length; i++) {
        var s = this.highscores[i]
        if (this.score > s.score) {
            this.highscores.splice(i, 0, { score: this.score, name: '' })
            if (this.highscores.length > 10) {
                this.highscores.pop()
            }
            update = i
            break
        }
    }

    // call parent
    Phaser.Msx.Attract.prototype.create.call(this, clickToPass, durationToPass)

    // render it
    this.highscoresUI = this.game.add.group()
    var detailsUI = this.game.add.group()
    var scoresUI = this.game.add.group()
    var namesUI = this.game.add.group()

    this.highscoresUI.add(detailsUI)
    detailsUI.add(scoresUI)
    detailsUI.add(namesUI)

    // add title
    var text = this.createText('Highscores', Phaser.Msx.H1)
    text.anchor.setTo(0.5, 0)
    this.highscoresUI.add(text)
    var off = text.height * this.titleSpacing

    this.highscores.forEach(function (s, i) {
        var t1 = this.createText(s.score, Phaser.Msx.H3, off)
        t1.anchor.setTo(1, 0)
        t1.x -= t1.height / 4
        scoresUI.add(t1)
        var t2 = this.createText(s.name, Phaser.Msx.H3, off)
        t2.anchor.setTo(0, 0)
        t2.x += t1.height / 4
        namesUI.add(t2)
        off += t1.height
        if (update == i) {
            this.getName(t2, i)
        }
    }, this)

    this.highscoresUI.y = (this.game.world.height - this.highscoresUI.height) / 2
}


Phaser.Msx.HighScores.prototype.getName = function (text, i) {
    this._updateText = text
    this._updateIndex = i
    this._entry = null
    this._name = ''
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // delay otherwise we don't get the scoreboard displayed 
        this._entry = 'prompt'
        this.game.time.events.add(500, this.getMobileName, this)
    } else {
        this._entry = 'keyboard'
        this._characterIndex = 0
        this.game.time.events.loop(100, this.rotateCharacter, this)
        PHASER.input.keyboard.addCallbacks(this, null, null, function (ch) {
            if (this._entry == 'keyboard') {
                if (ch.charCodeAt() != Phaser.KeyCode.ENTER &&
                    ch.charCodeAt() != Phaser.KeyCode.NUMPAD_ENTER) {
                    this._name += ch
                    if (this._name.length >= this.maxNameLength) {
                        this.nameComplete()
                    }
                } else {
                    this.nameComplete()
                }
            }
        })
    }
}


Phaser.Msx.HighScores.prototype.nameComplete = function () {
    this._updateText.text = this._name
    this._entry = null
    // store and save the high score
    this.highscores[this._updateIndex].name = this._name
    this.saveScores(this.highscores)
}


Phaser.Msx.HighScores.prototype.getMobileName = function () {
    // mobile - prompt
    var name = prompt('Enter Name')
    // it's mobile
    if (name) {
        this._name = name
    }
    this.nameComplete()
}


Phaser.Msx.HighScores.prototype.rotateCharacter = function () {
    if (this._entry) {
        var chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'
        this._updateText.text = this._name + chars[this._characterIndex]
        this._characterIndex++
        if (this._characterIndex >= chars.length) {
            this._characterIndex = 0
        }
    }
}


Phaser.Msx.HighScores.prototype.nextAttract = function () {
    if (!this._entry) {
        // we're no longer reading the username so navigate
        Phaser.Msx.Attract.prototype.nextAttract.call(this)
    }
}


Phaser.Msx.HighScores.prototype.createText = function (title, style, off) {
    off = off || 0
    if (style.transform) {
        title = style.transform(title)
    }
    return this.game.add.text(this.game.world.centerX, off, title, style)
}


Phaser.Msx.HighScores.prototype.loadScores = function() {
    return []
}


Phaser.Msx.HighScores.prototype.saveScores = function(scores) {
}
