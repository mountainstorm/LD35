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


Options = function () {
    Phaser.Msx.Options.call(this)
}


Options.prototype = Object.create(Phaser.Msx.Options.prototype)
Options.prototype.constructor = Options


Options.prototype.preload = function () {
    this.game.load.audio('testSound', 'assets/sounds/fusion.mp3')               
}


Options.prototype.create = function () {
    this.musicControl = new Phaser.Msx.Slider(PHASER, 0, 0, this.musicVolumeChanged, this)
    this.musicControl.setValue(this.game.settings.load('musicVolume'))
    this.soundControl = new Phaser.Msx.Slider(PHASER, 0, 0, this.soundVolumeChanged, this)
    this.soundControl.setValue(this.game.settings.load('soundVolume'))
    this.flashingControl = new Phaser.Msx.Button(PHASER, 0, 0, true, this.flashingChanged, this)
    this.flashingControl.setState(this.game.settings.load('flashing'))

    this.controls = [
        { title: 'Music', control: this.musicControl },
        { title: 'Sound Fx', control: this.soundControl },
        { spacing: 1 },
        { title: 'Flashing', control: this.flashingControl }
    ]
    Phaser.Msx.Options.prototype.create.call(this)
}


Options.prototype.musicVolumeChanged = function (value) {
    this.game.settings.save('musicVolume', value)
    if (this.music) {
        this.music.volume = value
    }
}


Options.prototype.soundVolumeChanged = function (value) {
    this.game.settings.save('soundVolume', value)
    this.game.sound.play('testSound', value)

}


Options.prototype.flashingChanged = function (value) {
    console.log('save flashing')
    this.game.settings.save('flashing', value)
    console.log(this.game.settings.load())
}
