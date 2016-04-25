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


Menu = function () {
}


Menu.prototype = Object.create(Phaser.Msx.Attract.prototype)
Menu.prototype.constructor = Menu


Menu.prototype.preload = function () {
    this.game.load.image('menuBg', 'assets/imgs/menuBg.png')
}


Menu.prototype.create = function () {
    Phaser.Msx.Attract.prototype.create.call(this, false, 6000)
    var bg = this.game.add.sprite(0, 0, 'menuBg')

    var start = new Phaser.Msx.Button(
        this.game,
        this.game.world.centerX,
        this.game.world.centerY,
        'Start',
        function () {
            this.game.state.start('Play', true, false, false)
        }
    )
    start.anchor.setTo(0.5, 0.5)
    this.game.add.existing(start)

    var style = Object.assign({}, Phaser.Msx.CONTROL, {
        align: 'right',
        transform: undefined
    })
    var start = new Phaser.Msx.Button(
        this.game,
        this.game.world.width - 100,
        this.game.world.height - 200,
        'Options',
        function () {
            this.game.state.start('Options', true, false, 'Menu')
        },
        this,
        style
    )
    start.anchor.setTo(1.0, 1.0)    
    this.game.add.existing(start)
}
