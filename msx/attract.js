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


Phaser.Msx.Attract = function () {
    Phaser.State.call(this)

    // // caml case - lookup in namespace to figure out whats correct
    // var name = this.constructor.name
    // var cur = { name: name[0], node: window }
    // this.stateName = ''
    // for (var i = 1; i < name.length; i++) {
    //     if (name[i] == name[i].toUpperCase()) {
    //         if (cur.name in cur.node) {
    //             this.stateName += cur.name + '.'
    //             cur.node = cur.node[cur.name]
    //             cur.name = ''
    //         }
    //         cur.name += name[i]
    //     } else {
    //         cur.name += name[i]
    //     }
    // }
    // this.stateName += cur.name
}


Phaser.Msx.Attract.prototype = Object.create(Phaser.State.prototype)
Phaser.Msx.Attract.prototype.constructor = Phaser.Msx.Attract


Phaser.Msx.Attract.prototype.init = function () {
    this.game.stage.backgroundColor = Phaser.Msx.BACKGROUND
}


Phaser.Msx.Attract.prototype.create = function (clickToSkip, duration) {
    // register for all tap, key events
    if (clickToSkip) {
        this.game.input.onTap.add(this.nextAttract, this)
        this.game.input.keyboard.addCallbacks(this, null, null, this.nextAttract)
    }

    if (duration) {
        this.game.time.events.loop(duration, this.nextAttract, this)
    }
}


Phaser.Msx.Attract.prototype.nextAttract = function () {
    // find the current state, then play the next state
    // we do this so if you manually play a state in the attraction
    // manager it continus as expected
    var newIdx = null
    this.game.attractStates.forEach(function (state, i) {
        if (state === this) {
            newIdx = i
        }
    }, this)
    if (newIdx == null) {
        // no attract state playing, start at the beginning
        newIdx = 0
    } else {
        newIdx++
        if (newIdx >= this.game.attractStates.length) {
            newIdx = 0 // loop
        }
    }
    // now find its name
    var newState = null
    Object.keys(this.game.state.states).forEach(function (el) {
        if (this.game.state.states[el] === this.game.attractStates[newIdx]) {
            newState = el
        }
    }, this)
    this.game.state.start(newState)
}
