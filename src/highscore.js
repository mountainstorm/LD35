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


var HighScoreState = function() {}


HighScoreState.prototype = {
    preload: function() {
    },

    create: function() {
        var self = this
        self.flashCount = 40

        self.highscores = JSON.parse(localStorage.getItem('uk.co.mountainstorm.LD35'))
        if (self.highscores == undefined || self.highscores == null) {
            self.highscores = [
                { score: 54200, name: 'JAK' },
                { score: 50100, name: 'AAA' },
                { score: 48900, name: 'CBD' },
                { score: 43900, name: 'MTV' },

                { score: 43900, name: 'MTV' },
                { score: 40700, name: 'PPS' },
                { score: 35000, name: 'KJN' },
                { score: 33600, name: 'WAE' },
                { score: 29700, name: 'TTT' },
                { score: 24200, name: 'VHG' }
            ]
        }

        self.update = null
        self.updateIdx = 0
        $.each(self.highscores, function (i) {
            var s = self.highscores[i]
            if (PHASER.score > s.score) {
                self.update = i
                self.highscores.splice(i, 0, { score: PHASER.score, name: '___' })
                self.highscores.pop()
                return false
            }
        })   

        var scoreText = '\nHIGHSCORES\n\n'
        $.each(self.highscores, function (i) {
            var s = self.highscores[i]
            scoreText += s.score + ' ' + s.name + '\n'
        }) 
        self.board = PHASER.add.text(PHASER.world.centerX, PHASER.world.centerY, scoreText, { font: '54px Droid Sans Mono', fill: "#ffffff", align: "center" })
        self.board.anchor.setTo(0.5, 0.5)
        self.board.alpha = 0
        PHASER.add.tween(self.board).to({ alpha: 1 }, self.FADE_DURATION, Phaser.Easing.Linear.None, true, 0, 0, false)


        PHASER.input.keyboard.addCallbacks(this, null, null, function (keyCode) {
            if (self.update != null) {
                self.replaceChar(keyCode)
                self.updateIdx++
                if (self.updateIdx >= 3) {
                    // entered name complete - save then wait and show credits
                    localStorage.setItem('uk.co.mountainstorm.LD35', JSON.stringify(self.highscores));
                    PHASER.time.events.add(6000, function () {
                        var t = PHASER.add.tween(self.board).to({ alpha: 0 }, self.FADE_DURATION, Phaser.Easing.Linear.None, true, 0, 0, false)
                        t.onComplete.add(function () {
                            PHASER.state.start('Credits')
                        })
                    })
                }
            } else {
                PHASER.state.start('Credits')
            }
        })

        PHASER.input.onTap.add(function () {
            if ((self.update != null && self.updateIdx >= 3) || self.update == null) {
                PHASER.state.start('Credits')  
            }
        })


        if (self.update == null) {
            PHASER.time.events.add(6000, function () {
                var t = PHASER.add.tween(self.board).to({ alpha: 0 }, self.FADE_DURATION, Phaser.Easing.Linear.None, true, 0, 0, false)
                t.onComplete.add(function () {
                    PHASER.state.start('Credits')
                })
            })
        }

        PHASER.stage.backgroundColor = '#250918'

        if (self.update != null && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var name = prompt('Enter Name')
            if (name == null) {
                name = '___'
            }
            name += '___'
            name = name.substring(0, 3) // grab the first 3 chars
            self.highscores[self.update].name = name
            self.updateIdx += 3
        }
    },

    update: function() {
        var self = this
        if (self.update != null) {
            // we need to get the persons name
            if (self.flashCount > 20) {
                self.replaceChar('_')
            } else if (self.flashCount > 0) {
                self.replaceChar(' ')
            }

            var scoreText = 'HIGHSCORES\n\n'
            $.each(self.highscores, function (i) {
                var s = self.highscores[i]
                scoreText += s.score + ' ' + s.name
                if (i != self.highscores.length-1) {
                    scoreText += '\n'
                }
            }) 
            self.board.text = scoreText
        }
        self.flashCount--
        if (self.flashCount < 0) {
            self.flashCount = 40
        }
    },

    replaceChar: function(chr) {
        var self = this
        if (self.updateIdx < 3) {
            var orig = self.highscores[self.update].name
            self.highscores[self.update].name = orig.substr(0, self.updateIdx) + chr + orig.substr(self.updateIdx + chr.length)
        }
    }
}
