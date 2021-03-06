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

var PHASER = null


$(window).load(function () {
    // wait until the window has loaded i.e. EVERY linked resource has been loaded
    // use canvas rendere as WebGL is killed by the uploading of the texture
    PHASER = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'gameCanvas', {
        preload: function() { 
            // maintain aspect ratio
            PHASER.time.advancedTiming = true
            PHASER.scale.supportsFullscreen = true
            PHASER.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
            PHASER.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

            PHASER.load.audio('music', 'assets/sounds/music.mp3')

            var self = this
            self.progress = PHASER.add.text(
                PHASER.world.centerX, PHASER.world.centerY,
                'Progress: 0%',
                { font: '64px Lato', fontWeight: '300', fill: "#ffffff", align: "center" }
            )
            self.progress.anchor.setTo(0.5, 0.5)
        },

        create: function () {
            var music = JSON.parse(localStorage.getItem('uk.co.mountainstorm.LD35.music'))
            if (music == undefined || music == null || music == true) {
                PHASER.sound.play('music', 1.0, true)
            }
            PHASER.state.start('Menu')
        },

        loadUpdate: function () {
            var self = this
            self.progress.text = 'Loading: ' + PHASER.load.progress + '%'
        },

        update: function () {
        }
    })

    // 3D stuff with three.js
    // this.canvasTarget = Phaser.Canvas.create(256,256,"renderHere");
    // this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas:this.canvasTarget });

    // load states
    PHASER.state.add('Menu', MenuState)
    PHASER.state.add('Play', PlayState)
    PHASER.state.add('HighScore', HighScoreState)
    PHASER.state.add('Credits', CreditsState)
})


function toggleFullscreen() {
    if (PHASER.scale.isFullScreen) {
        PHASER.scale.stopFullScreen()
    } else {
        PHASER.scale.startFullScreen(false)
    }
}

