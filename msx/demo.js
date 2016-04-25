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


Phaser.Msx.Demo = function () {
    this.play = null
}


Phaser.Msx.Demo.prototype = Object.create(Phaser.Msx.Attract.prototype)
Phaser.Msx.Demo.prototype.constructor = Phaser.Msx.Demo


Phaser.Msx.Demo.prototype.init = function () {
    Phaser.Msx.Attract.prototype.init.call(this)
    this.play.game = this.game
    this.play.init(true)
}


Phaser.Msx.Demo.prototype.preload = function () {
    this.play.preload()
}


Phaser.Msx.Demo.prototype.create = function () {
    Phaser.Msx.Attract.prototype.create.call(this, true, 8000)
    this.play.create(true)
}


Phaser.Msx.Demo.prototype.loadRender = function () {
    this.play.loadRender()
}


Phaser.Msx.Demo.prototype.loadUpdate = function () {
    this.play.loadUpdate()
}


Phaser.Msx.Demo.prototype.update = function () {
    this.play.update()
}


Phaser.Msx.Demo.prototype.paused = function () {
    this.play.paused()
}


Phaser.Msx.Demo.prototype.pauseUpdate = function () {
    this.play.pauseUpdate()
}


Phaser.Msx.Demo.prototype.preRender = function () {
    this.play.preRender()
}


Phaser.Msx.Demo.prototype.render = function () {
    this.play.render()
}


Phaser.Msx.Demo.prototype.resize = function () {
    this.play.resize()
}


Phaser.Msx.Demo.prototype.resumed = function () {
    this.play.resumed()
}


Phaser.Msx.Demo.prototype.shutdown = function () {
    this.play.shutdown()
}


Phaser.Msx.Demo.prototype.destroy = function () {
    Phaser.Msx.Attract.prototype.destroy.call(this)
    this.play.destroy()
}
