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


Phaser.Msx.Settings = function (identifier) {
    this.identifier = identifier
    this.defaults = {}
}


Phaser.Msx.Settings.prototype = Object.create(null)
Phaser.Msx.Settings.prototype.constructor = Phaser.Msx.Settings


Phaser.Msx.Settings.prototype.load = function (name) {
    var settings = JSON.parse(localStorage.getItem(this.identifier))
    if (!settings) {
        settings = Object.assign({}, this.defaults)
    }
    if (name) {
        settings = settings[name]
    }
    return settings
}


Phaser.Msx.Settings.prototype.save = function (settings, value) {
    settings = settings || this.defaults
    if (value !== undefined) {
        // settings is the name, value is the value
        var name = settings
        settings = this.load()
        settings[name] = value
    }
    localStorage.setItem(this.identifier, JSON.stringify(settings))
}
