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


HighScores = function () {
    Phaser.Msx.HighScores.call(this)
}


HighScores.prototype = Object.create(Phaser.Msx.HighScores.prototype)
HighScores.prototype.constructor = HighScores


HighScores.prototype.create = function () {
    Phaser.Msx.HighScores.prototype.create.call(this, true, 8000)
}


HighScores.prototype.loadScores = function () {
    return this.game.settings.load('scores')
}


HighScores.prototype.saveScores = function (scores) {
    this.game.settings.save('scores', scores)
    PHASER.time.events.add(6000, PHASER.state.start, PHASER.state, 'Phaser.Msx.Credits')
}
