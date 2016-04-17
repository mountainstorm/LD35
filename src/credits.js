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


var CreditsState = function() {}


CreditsState.prototype = {
    preload: function() {
        //PHASER.load.image('creditsBg', 'assets/imgs/starfield.png')
    },

    create: function() {
        var self = this
        //var bg = PHASER.add.sprite(0, 0, 'creditsBg')

        this.credits = [{
            title: 'LEAD DESIGNER',
            person: 'R Cooper'
        }, {
            title: 'CONCEPT ART',
            person: 'R Cooper'
        }, {
            title: 'LEAD PROGRAMMER',
            person: 'R Cooper'
        }, {
            title: 'LEAD ARTIST',
            person: 'R Cooper'
        }, {
            title: 'LEAD SOUND DESIGNER',
            person: 'R Cooper'
        }, {
            title: 'CRAFT SERVICES',
            person: 'The Wife'
        }]
        this.ONSCREEN_DURATION = 5000
        this.FADE_DURATION = 1000
        this.SPACING = 1000

        var delay = 0
        var text = self.createItem('Credits\n', delay, true)
        $.each(self.credits, function () {
            delay += self.SPACING
            self.createItem(this.title + '\n' + this.person, delay, false)
        })
        PHASER.time.events.add(delay + this.ONSCREEN_DURATION + self.SPACING * 2,  function () {
            PHASER.state.start('Menu')
        })

        PHASER.input.onTap.add(function () {
            PHASER.state.start('Menu')  
        })
        PHASER.input.keyboard.addCallbacks(this, null, null, function (keyCode) {
            PHASER.state.start('Menu')  
        })

        PHASER.stage.backgroundColor = '#250918'
    },

    createItem: function (title, delay, underline) {
        var self = this
        var text = PHASER.add.text(
            PHASER.world.centerX, PHASER.world.height,
            title,
            { font: '64px Lato', fontWeight: '300', fill: "#ffffff", align: "center" }
        )
        text.alpha = 0
        text.anchor.setTo(0.5, 0.5)
        PHASER.time.events.add(delay, function () {
            PHASER.add.tween(text).to({ y: -text.height }, self.ONSCREEN_DURATION, Phaser.Easing.Linear.None, true, 0, 0, false)
            PHASER.add.tween(text).to({ alpha: 1 }, self.FADE_DURATION, Phaser.Easing.Linear.None, true, 0, 0, false)
            PHASER.time.events.add(self.ONSCREEN_DURATION - self.FADE_DURATION, function () {
                PHASER.add.tween(text).to({ alpha: 0 }, self.FADE_DURATION, Phaser.Easing.Linear.None, true, 0, 0, false)            
            })
        })
    }
}
