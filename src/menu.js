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


var menuState = function() {}


menuState.prototype = {
    preload: function() {
        PHASER.load.spritesheet('startButton', 'assets/buttons/startButton.png', 200, 70);
        PHASER.load.spritesheet('fullscreenToggleButton', 'assets/buttons/fullscreenToggleButton.png', 500, 70);
    },

    create: function() {
        //start = PHASER.add.text(PHASER.world.centerX, PHASER.world.centerY, 'Start', { font: '64px Lato', fontWeight: '200', fill: "#ffffff", align: "center" })
        var start = PHASER.add.button(PHASER.world.centerX, PHASER.world.centerY, 'startButton', function() {
            PHASER.state.start('Play')
        }, 0, 0, 1, 2)
        start.anchor.setTo(0.5, 0.5)

        // var fullscreen = PHASER.add.button(
        //     PHASER.world.width, PHASER.world.height, 'fullscreenToggleButton', toggleFullscreen, 0, 0, 1, 2
        // )
        // fullscreen.anchor.setTo(1, 1)
    },

    update: function() {
    },

    render: function() {
    }
}
