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


Phaser.Msx.shapeFontURL = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'


Phaser.Msx.CONTROL = { font: '40px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00', transform: function (text) { return text.toUpperCase() } }
Phaser.Msx.H1 = { font: '64px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00', transform: function (text) { return text.toUpperCase() } }
Phaser.Msx.H2 = { font: '56px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00', transform: function (text) { return text.toUpperCase() } }
Phaser.Msx.H3 = { font: '56px Lato', fontWeight: '300', fill: "#ffffff", align: "center", fillOver: '#ff0000', fillDown: '#00ff00' }

Phaser.Msx.BACKGROUND = '#250918'


Phaser.Msx.styleSize = function (style) {
    return parseInt(style.font.substring(0, style.font.indexOf('px')))
}


WebFontConfig = {
    google: {
        families: ['Lato']
    }
}
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


Phaser.Msx.Toolbar = function (title, parent, fullscreenCallbackContext, fullscreenCallback) {    
    this.fullscreenCallbackContext = fullscreenCallbackContext || this
    this.fullscreenCallback = fullscreenCallback || this.fullscreenPhaser

    this._instructions = null

    if (!this.isFullscreen()) {
        // inject css for the toolbar
        var head = document.getElementsByTagName('head')[0]
        var linkNode = document.createElement('link')
        linkNode.setAttribute('rel', 'stylesheet')
        linkNode.setAttribute('href', Phaser.Msx.shapeFontURL)
        head.appendChild(linkNode)

        var linkNode = document.createElement('link')
        linkNode.setAttribute('rel', 'stylesheet')
        linkNode.setAttribute('href', 'msx/toolbar/toolbar.css')
        head.appendChild(linkNode)
        
        // setup cancel handlers for tooltips
        document.body.addEventListener('click', this.hideInstructions, true)
        document.body.addEventListener('touchstart', this.hideInstructions, true)

        // load toolbar      
        this.loadToolbar(title, parent)
    }
}


Phaser.Msx.Toolbar.prototype = Object.create(null)
Phaser.Msx.Toolbar.prototype.constructor = Phaser.Msx.Toolbar


Phaser.Msx.Toolbar.prototype.loadToolbar = function (title, parent) {
    // create a toolbar to hold all our bits
    var parentDiv = document.getElementById(parent)
    var msxToolbar = document.createElement('div')
    msxToolbar.className = 'msxToolbar'
    msxToolbar.setAttribute('style', 'display: none;') // hide
    var existing = undefined
    if (parentDiv.children.length > 0) {
        existing = parentDiv.children[0]
    }
    parentDiv.insertBefore(msxToolbar, existing)
    // load the toolbar and fullscreen tips into the toolbar
    var req = new XMLHttpRequest()
    req.open('GET', 'msx/toolbar/toolbar.html', false)
    var self = this
    req.addEventListener('load', function () {
        msxToolbar.innerHTML = req.responseText

        // now add the ttle the user supplied and setup the fullscreen button
        var titleNode = document.createElement('div')
        titleNode.innerHTML = title
        msxToolbar.children[0].children[0].onclick = function (e) {
            self.fullscreen()
            e.stopPropogation()
        }
        msxToolbar.children[0].appendChild(titleNode)

        // finally, load the icon into the icon slot
        var icon = self.getHomepageIcon()
        var nodeList = document.getElementsByClassName('msxHomepageIcon')
        for (var i = 0; i < nodeList.length; i++) {
            nodeList[i].src = icon
        }
    })
    req.send()
}


Phaser.Msx.Toolbar.prototype.isFullscreen = function () {
    var retval = false
    if (this.isIOSFullscreen()) {
        retval = true
    } else if (this.isAndroidFullscreen()) {
        retval = true
    }
    return retval
}


Phaser.Msx.Toolbar.prototype.isIOSFullscreen = function () {
    var retval = false
    if ('standalone' in window.navigator &&
        window.navigator.standalone == true) {
        retval = true
    }
    return retval
}


Phaser.Msx.Toolbar.prototype.isAndroidFullscreen = function () {
    return window.matchMedia('(display-mode: standalone)').matches
}


Phaser.Msx.Toolbar.prototype.fullscreen = function () {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (iOS) {
        if (iOS && /iPhone|iPod/.test(navigator.userAgent)) {
            // iPhone/iPod
            this.showInstructions('iPhone')
        } else {
            // iPad
            this.showInstructions('iPad')                        
        }
    } else if (/Android/.test(navigator.userAgent)) {
        this.showInstructions('Android')
    } else {
        if (this.fullscreenCallback) {
            this.fullscreenCallback.call(this.fullscreenCallbackContext)
        }
    }
}


Phaser.Msx.Toolbar.prototype.fullscreenPhaser = function () {
    if (this.scale.isFullScreen) {
        this.scale.stopFullScreen()
    } else {
        this.scale.startFullScreen(false)
    }
}


Phaser.Msx.Toolbar.prototype.showInstructions = function (cls) {
    var nodeList = document.getElementsByClassName('msxTooltip ' + cls)
    for (var i = 0; i < nodeList.length; i++) {
        var el = nodeList[i]
        var instructions = el.children[1].children[0]
        if (this._instructions == null) {
            // enable it
            el.className += ' active'
            this._instructions = {
                tooltip: el,
                instructions: instructions,
                interval: null
            }
            var j = 1
            this._instructions.interval = window.setInterval(function () {
                instructions.setAttribute('style', 'left: -' + (j * 100) + 'px')
                j++
                if (j == instructions.children.length) {
                    j = 0
                }
            }, 2000)
        } else {
            this.hideInstructions()
        }
    }
}


Phaser.Msx.Toolbar.prototype.hideInstructions = function () {
    // disable fullscreen instruction if avaliable
    if (this._instructions) {
        window.clearInterval(this._instructions.interval)
        this._instructions.tooltip.className = this._instructions.tooltip.className.replace(' active', '')
        this._instructions.instructions.setAttribute('style', 'left: 0px')
        this._instructions = null
    }
}


Phaser.Msx.Toolbar.prototype.getHomepageIcon = function(){
    var retval = undefined
    var nodeList = document.getElementsByTagName('link')
    for (var i = 0; i < nodeList.length; i++) {
        var el = nodeList[i]
        //if (el.getAttribute('rel') == 'icon'|| el.getAttribute('rel') == 'shortcut icon') {
        if (el.getAttribute('rel') == 'apple-touch-icon') {           
            retval = el.getAttribute('href')
        }
    }
    return retval
}









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


Phaser.Msx = Phaser.Msx || {}


Phaser.Msx.Slider = function (game, x, y, callback, callbackContext, dir, length, style) {
    x = x || 0
    y = y || 0

    this.game = game
    this.dir = dir || Phaser.Msx.Slider.HORIZONTAL
    this.callback = callback || 0
    this.callbackContext = callbackContext || this
    this.style = style || Phaser.Msx.CONTROL
    this.style = Object.assign({}, this.style)

    this._size = Phaser.Msx.styleSize(this.style)
    this.length = length || this._size * 5

    this.style.fillOut = this.style.fill

    Phaser.Image.call(this, game, x, y)

    // do type checks  
    this.value = 1.0
    this._graphics = this.game.make.graphics(0, 0)

    this._over = false
    this._drag = null

    this.inputEnabled = true
    this.input.useHandCursor = true

    this.events.onInputOver.add(this._onInputOver, this)
    this.events.onInputOut.add(this._onInputOut, this)
    this.events.onInputDown.add(this._onInputDown, this)
    this.events.onInputUp.add(this._onInputUp, this)
    this.draw()
}


Phaser.Msx.Slider.VERTICAL = 1
Phaser.Msx.Slider.HORIZONTAL = 2


Phaser.Msx.Slider.prototype = Object.create(Phaser.Image.prototype)
Phaser.Msx.Slider.prototype.constructor = Phaser.Msx.Slider


Phaser.Msx.Slider.prototype.draw = function () {
    var fill = parseInt(this.style.fill.substring(1), 16)
    this._graphics.clear()
    this._graphics.lineStyle(2, fill)

    var dx = 0
    var dy = 0
    var d = (this.length - this._size) * this.value
    if (this.dir == Phaser.Msx.Slider.VERTICAL) {
        dy = d
        this._graphics.moveTo(this._size / 2, 0)
        this._graphics.lineTo(this._size / 2, this.length)
    } else {
        dx = d
        this._graphics.moveTo(0, this._size / 2)
        this._graphics.lineTo(this.length, this._size / 2)
    }

    this._graphics.beginFill(fill)
    this._graphics.drawCircle(
        dx + (this._size / 2),
        dy + (this._size / 2),
        this._size - 24
    )
    this._graphics.endFill()
    this.loadTexture(this._graphics.generateTexture())
}


Phaser.Msx.Slider.prototype.setValue = function (value) {
    if (value < 0.0) {
        value = 0.0
    } else if (value > 1.0) {
        value = 1.0
    }
    this.value = value
    this.draw()
}


Phaser.Msx.Slider.prototype._onInputOver = function () {
    if (this._drag == null) {
        this.style.fill = this.style.fillOver
    }
    this._over = true
    this.draw()
}


Phaser.Msx.Slider.prototype._onInputOut = function () {
    if (this._drag == null) {
        this.style.fill = this.style.fillOut
    }
    this._over = false
    this.draw()
}


Phaser.Msx.Slider.prototype._onInputDown = function () {
    if (this._over) {
        this.style.fill = this.style.fillDown

        this._drag = {
            x: this.game.input.activePointer.worldX,
            y: this.game.input.activePointer.worldY,
            timer: this.game.time.create(false)
        }
        this._drag.timer.loop(10, this._onMove, this)
        this._drag.timer.start()

        this.draw()
    }
}


Phaser.Msx.Slider.prototype._onInputUp = function () {
    if (this._over) {
        this.style.fill = this.style.fillOver
    } else {
        this.style.fill = this.style.fillOut
    }
    if (this._drag) {
        this._drag.timer.stop()
        this._drag.timer.destroy()
        // XXX: add support for taping to set location
        this._drag = null
    }
    this.draw()
}


Phaser.Msx.Slider.prototype._onMove = function () {
    var delta = this.game.input.activePointer.worldX - this._drag.x
    if (this.dir === Phaser.Msx.Slider.VERTICAL) {
        delta = this.game.input.activePointer.worldY - this._drag.y
    }
    this._drag.x = this.game.input.activePointer.worldX
    this._drag.y = this.game.input.activePointer.worldY
    // calculate current location as pixel offset
    var length = this.length - this._size
    var px = this.value / (1.0 / length)
    var originalValue = this.value
    this.setValue((px + delta) * (1.0 / length))

    this.draw()
    if (this.value != originalValue) {
        this.callback.call(this.callbackContext, this.value)
    }
}

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


Phaser.Msx.Play = function (quitTo) {
    Phaser.State.call(this)
    var play = this
    this.pauseOptions = []
    if (quitTo) {
        this.pauseOptions.push({
            title: 'Quit', callback: function () {
                play.game.paused = false
                play.game.state.start(quitTo)
            } 
        })
    }
    this.pauseOptions.push({
        title: 'Back', callback: function () {
            play.game.paused = false
        }
    })

    // Whilst paused we can't use other states etc as so much of
    // states rely on the main game loop.  Equally a custom pause
    // isn't a good call as you can't stop physics etc.  The up
    // shot is that theres no options menu for you!

    // XXX:
    // change button/slider to use game.input http://phaser.io/examples/v2/misc/pause-menu
    // instead of events - they will then work on pause screen
}


Phaser.Msx.Play.prototype = Object.create(Phaser.State.prototype)
Phaser.Msx.Play.prototype.constructor = Phaser.Msx.Play


Phaser.Msx.Play.prototype.init = function () {
    this.game.stage.backgroundColor = Phaser.Msx.BACKGROUND
    if (this.game.state.getCurrentState() === this) {
        var esc = PHASER.input.keyboard.addKey(Phaser.Keyboard.ESC)
        esc.onDown.add(function () {
            // toggle pause state
            if (this.game.paused == true) {
                this.game.paused = false
            } else {
                this.game.paused = true
            }
        }, this)
    }
}


Phaser.Msx.Play.prototype.paused = function () {
    if (this.game.state.getCurrentState() === this) {
        // show paused dialog
        this.pauseOverlayUI = this.game.add.group()

        var bmp = PHASER.make.bitmapData(PHASER.world.width, PHASER.world.height)
        bmp.fill(0, 0, 0, 0.3)
        this.pauseOverlayUI.add(PHASER.add.image(0, 0, bmp))

        var y = 0
        var options = this.game.add.group()
        this.pauseOptions.forEach(function (option) {
            var ctx = option.callbackContext || this
            var button = new Phaser.Msx.Button(this.game, 0, y, option.title, option.callback, ctx)
            button.anchor.set(0.5, 0)
            options.add(button)
            y += button._text.height
        }, this)
        options.x = this.game.world.centerX
        options.y = (this.game.world.height - y) / 2
        this.pauseOverlayUI.add(options)
    }
    // var op = new Options()
    // op.game = this.game
    // op.init()
    // op.preload()
    // op.create()
}


Phaser.Msx.Play.prototype.resumed = function () {
    if (this.pauseOverlayUI) {
        this.pauseOverlayUI.destroy()
    }
}
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


Phaser.Msx.Options = function () {
    Phaser.State.call(this)
    this.controls = []
    this.titleSpacing = 2.0
}


Phaser.Msx.Options.prototype = Object.create(Phaser.State.prototype)
Phaser.Msx.Options.prototype.constructor = Phaser.Msx.Options


Phaser.Msx.Options.prototype.init = function (returnTo) {
    this.game.stage.backgroundColor = Phaser.Msx.BACKGROUND
    this.returnTo = returnTo
}


Phaser.Msx.Options.prototype.create = function () {
    // render out all the controls into a group
    this.optionsUI = this.game.add.group()
    var heading = this.createText('Options', Phaser.Msx.H1, 0)
    heading.anchor.setTo(0.5, 0)
    var y = heading.height * this.titleSpacing
    this.optionsUI.add(heading)
    this.controls.forEach(function (item) {
        var style = Object.assign({}, Phaser.Msx.CONTROL, { align: 'right' })
        if (item.spacing) {
            y += Phaser.Msx.styleSize(style) * item.spacing
        } else {
            var g = this.game.add.group()
            this.optionsUI.add(g)

            var title = this.createText(item.title, style, -heading.height / 4, y)
            title.anchor.setTo(1, 0)
            g.add(title)

            item.control.anchor.setTo(0, 0.5)
            item.control.x = heading.height / 4
            item.control.y = y + (title.height / 2)
            g.add(item.control)

            y += title.height
        }
    }, this)
    y += heading.height * this.titleSpacing
    var back = new Phaser.Msx.Button(this.game, 0, y, 'Back', this.back, this)
    this.optionsUI.add(back)

    this.optionsUI.pivot.x -= this.optionsUI.width / 2
    this.optionsUI.pivot.y = 0
    this.optionsUI.x = (this.game.width - this.optionsUI.width) / 2
    this.optionsUI.y = (this.game.height - this.optionsUI.height) / 2

    // setup esc handler
    var esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    esc.onDown.add(this.back, this)
}


Phaser.Msx.Options.prototype.createText = function (title, style, x, y) {
    x = x || 0
    y = y || 0
    if (style.transform) {
        title = style.transform(title)
    }
    return this.game.add.text(x, y, title, style)
}


Phaser.Msx.Options.prototype.back = function () {
    this.game.state.start(this.returnTo)
}
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


//= require attract.js


Phaser.Msx.HighScores = function () {
    Phaser.Msx.Attract.call(this)
    this.titleSpacing = 1.5
    this.maxNameLength = 3
}


Phaser.Msx.HighScores.prototype = Object.create(Phaser.Msx.Attract.prototype)
Phaser.Msx.HighScores.prototype.constructor = Phaser.Msx.HighScores


Phaser.Msx.HighScores.prototype.init = function (score) {
    Phaser.Msx.Attract.prototype.init.call(this)
    this.score = score
}


Phaser.Msx.HighScores.prototype.create = function() {
    // draw the top 10 scores
    var update = null
    this.highscores = this.loadScores()
    for (var i = 0; i < this.highscores.length; i++) {
        var s = this.highscores[i]
        if (this.score > s.score) {
            this.highscores.splice(i, 0, { score: this.score, name: '' })
            if (this.highscores.length > 10) {
                this.highscores.pop()
            }
            update = i
            break
        }
    }

    // call parent
    Phaser.Msx.Attract.prototype.create.call(this, true, 6000)

    // render it
    this.highscoresUI = this.game.add.group()
    var detailsUI = this.game.add.group()
    var scoresUI = this.game.add.group()
    var namesUI = this.game.add.group()

    this.highscoresUI.add(detailsUI)
    detailsUI.add(scoresUI)
    detailsUI.add(namesUI)

    // add title
    var text = this.createText('Highscores', Phaser.Msx.H1)
    text.anchor.setTo(0.5, 0)
    this.highscoresUI.add(text)
    var off = text.height * this.titleSpacing

    this.highscores.forEach(function (s, i) {
        var t1 = this.createText(s.score, Phaser.Msx.H3, off)
        t1.anchor.setTo(1, 0)
        t1.x -= t1.height / 4
        scoresUI.add(t1)
        var t2 = this.createText(s.name, Phaser.Msx.H3, off)
        t2.anchor.setTo(0, 0)
        t2.x += t1.height / 4
        namesUI.add(t2)
        off += t1.height
        if (update == i) {
            this.getName(t2, i)
        }
    }, this)

    this.highscoresUI.y = (this.game.world.height - this.highscoresUI.height) / 2
}


Phaser.Msx.HighScores.prototype.getName = function (text, i) {
    this._updateText = text
    this._updateIndex = i
    this._entry = null
    this._name = ''
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // delay otherwise we don't get the scoreboard displayed 
        this._entry = 'prompt'
        this.game.time.events.add(500, this.getMobileName, this)
    } else {
        this._entry = 'keyboard'
        this._characterIndex = 0
        this.game.time.events.loop(100, this.rotateCharacter, this)
        PHASER.input.keyboard.addCallbacks(this, null, null, function (ch) {
            if (this._entry == 'keyboard') {
                if (ch.charCodeAt() != Phaser.KeyCode.ENTER &&
                    ch.charCodeAt() != Phaser.KeyCode.NUMPAD_ENTER) {
                    this._name += ch
                    if (this._name.length >= this.maxNameLength) {
                        this.nameComplete()
                    }
                } else {
                    this.nameComplete()
                }
            }
        })
    }
}


Phaser.Msx.HighScores.prototype.nameComplete = function () {
    this._updateText.text = this._name
    this._entry = null
    // store and save the high score
    this.highscores[this._updateIndex].name = this._name
    this.saveScores(this.highscores)
}


Phaser.Msx.HighScores.prototype.getMobileName = function () {
    // mobile - prompt
    var name = prompt('Enter Name')
    // it's mobile
    if (name) {
        this._name = name
    }
    this.nameComplete()
}


Phaser.Msx.HighScores.prototype.rotateCharacter = function () {
    if (this._entry) {
        var chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'
        this._updateText.text = this._name + chars[this._characterIndex]
        this._characterIndex++
        if (this._characterIndex >= chars.length) {
            this._characterIndex = 0
        }
    }
}


Phaser.Msx.HighScores.prototype.nextAttract = function () {
    if (!this._entry) {
        // we're no longer reading the username so navigate
        Phaser.Msx.Attract.prototype.nextAttract.call(this)
    }
}


Phaser.Msx.HighScores.prototype.createText = function (title, style, off) {
    off = off || 0
    if (style.transform) {
        title = style.transform(title)
    }
    return this.game.add.text(this.game.world.centerX, off, title, style)
}


Phaser.Msx.HighScores.prototype.loadScores = function() {
    return []
}


Phaser.Msx.HighScores.prototype.saveScores = function(scores) {
}
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


Phaser.Msx.Game = function (title, identifier, width, height, renderer, parent, state, transparent, antialias, physicsConfig) {
    var game = this
    this.attractStates = []

    s = state || {}

    var sp = state.preload || null
    var cr = state.create || null
    s.preload = function () {
        // maintain aspect ratio
        game.time.advancedTiming = true
        game.scale.supportsFullscreen = true
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

        game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')
        if (sp) {
            sp.call(this)
        }
    }
    s.create = function () {
        // overwrite the state manager with ours
        game.toolbar = new Phaser.Msx.Toolbar(title, game.parent, game)
        if (cr) {
            cr.call(this)
        }
    }
    this.settings = new Phaser.Msx.Settings(identifier)
    Phaser.Game.call(this, width, height, renderer, parent, state, transparent, antialias, physicsConfig)
}


Phaser.Msx.Game.prototype = Object.create(Phaser.Game.prototype)
Phaser.Msx.Game.prototype.constructor = Phaser.Msx.Game

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


//= require attract.js


Phaser.Msx.Credits = function () {
    Phaser.Msx.Attract.call(this)
    this.creditSpacing = 2.5
    this.credits = []
}


Phaser.Msx.Credits.prototype = Object.create(Phaser.Msx.Attract.prototype)
Phaser.Msx.Credits.prototype.constructor = Phaser.Msx.Credits


Phaser.Msx.Credits.prototype.create = function () {
    Phaser.Msx.Attract.prototype.create.call(this, true)

    // create a group which contains all the credits
    this.creditsUI = this.game.add.group()

    var off = this.createText('Credits', Phaser.Msx.H1)
    this.credits.forEach(function (credit) {
        off = this.createText(credit.title, Phaser.Msx.H2, off)
        off = this.createText(credit.person, Phaser.Msx.H3, off)
    }, this)

    // skip on click
    Phaser.Msx.Attract.prototype.init.call(this, true)

    // scroll the text
    var scroll = this.game.add.tween(this.creditsUI).to(
        { y: -this.creditsUI.height - this.game.world.height },
        10000,
        Phaser.Easing.Linear.None,
        true
    )
    scroll.onComplete.add(function () {
        this.nextAttract()
    }, this)
}


Phaser.Msx.Credits.prototype.createText = function (title, style, off) {
    off = off || this.game.world.height
    if (style.transform) {
        title = style.transform(title)
    }
    var text = this.game.add.text(this.game.world.centerX, off, title, style)
    text.anchor.setTo(0.5, 0)
    this.creditsUI.add(text)

    var space = this.creditSpacing
    if (style === Phaser.Msx.H2) {
        space = 1
    }
    return off + (text.height * space)
}
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


Phaser.Msx = Phaser.Msx || {}


Phaser.Msx.Button = function (game, x, y, info, callback, callbackContext, style) {
    x = x || 0
    y = y || 0

    this.game = game
    this.callback = callback || 0
    this.callbackContext = callbackContext || this
    this.style = style || Phaser.Msx.CONTROL
    this.style = Object.assign({}, this.style)

    this.style.fillOut = this.style.fill

    Phaser.Image.call(this, game, x, y)

    // do type checks  
    if (typeof info === 'string') {
        this.state = false        
        this.toggle = false
        this.text = info
        if (this.style.transform) {
            this.text = this.style.transform(this.text)
        }
        this.draw = this.drawText
        this.buttonType = Phaser.Msx.Button.BUTTON

        this._text = this.game.make.text(0, 0, this.text, this.style)
        var align = 0.5
        if (this.style.align) {
            align = { 'left': 0, 'center': 0.5, 'right': 1 }[this.style.align]
        }
        this._text.anchor.setTo(align, 0)
        this.addChild(this._text)

    } else if (typeof info == 'boolean') {
        this.state = info
        this.toggle = true
        this.draw = this.drawCheckbox
        this.buttonType = Phaser.Msx.Button.CHECKBOX

        this._size = Phaser.Msx.styleSize(this.style)
        this._graphics = this.game.make.graphics(0, 0)
    } else if (typeof info == 'object') {
        this.state = false
        this.toggle = false
        this.group = info
        this.draw = this.drawRadio
        this.buttonType = Phaser.Msx.Button.RADIO

        this._size = Phaser.Msx.styleSize(this.style)
        this._graphics = this.game.make.graphics(0, 0)
    }

    this._over = false

    this.inputEnabled = true
    this.input.useHandCursor = true

    this.events.onInputOver.add(this._onInputOver, this)
    this.events.onInputOut.add(this._onInputOut, this)
    this.events.onInputDown.add(this._onInputDown, this)
    this.events.onInputUp.add(this._onInputUp, this)

    /*
     * XXX: vicious hack to support buttons in paused mode
     * probably wont work with check/radio boxes as width/height
     * wont be right
     */
     if (this.buttonType == Phaser.Msx.Button.BUTTON) {
        this._onDownBackup = this.game.input.onDown.add(function (event) {
            if (this._pointerInside(event)) {
                if (this.game.paused) {
                    this._over = true
                    this._onInputDown()
                }
            }
        }, this)
        this._onUpBackup = this.game.input.onUp.add(function (event) {
            if (this._over) {
                if (this.game.paused) {
                    this._onInputUp()
                    this._over = false
                }
            }
        }, this)
    }
    this.draw()
}


Phaser.Msx.Button.TEXT = 1
Phaser.Msx.Button.CHECKBOX = 2
Phaser.Msx.Button.RADIO = 3


Phaser.Msx.Button.prototype = Object.create(Phaser.Image.prototype)
Phaser.Msx.Button.prototype.constructor = Phaser.Msx.Button


Phaser.Msx.Button.prototype._pointerInside = function (event) {
    var bounds = this.getBounds()
    return event.x > (bounds.x - this._text.width / 2) &&
           event.x < (bounds.x + this._text.width / 2) &&
           event.y > bounds.y &&
           event.y < (bounds.y + this._text.height)
}


Phaser.Msx.Button.prototype.destroy = function () {
    if (this._onDownBackup) {
        this._onDownBackup.detach()
        this._onDownBackup = null
    }
    if (this._onUpBackup) {
        this._onUpBackup.detach()
        this._onUpBackup = null
    }
    Phaser.Image.prototype.destroy.call(this)
}


Phaser.Msx.Button.prototype.drawText = function () {
    this._text.fill = this.style.fill
}


Phaser.Msx.Button.prototype.drawCheckbox = function (down) {
    var fill = parseInt(this.style.fill.substring(1), 16)
    this._graphics.clear()
    this._graphics.lineStyle(2, fill)
    this._graphics.drawRect(0, 0, this._size, this._size)

    if (this.state || down) {
        this._graphics.beginFill(fill)
        this._graphics.drawRect(12, 12, this._size - 24, this._size - 24)
        this._graphics.endFill()
    }
    this.loadTexture(this._graphics.generateTexture())
}


Phaser.Msx.Button.prototype.drawRadio = function (down) {
    var fill = parseInt(this.style.fill.substring(1), 16)
    this._graphics.clear()
    this._graphics.lineStyle(2, fill)

    this._graphics.drawCircle(
        this._size / 2,
        this._size / 2,
        this._size
    )

    if (this.state || down) {
        this._graphics.beginFill(fill)
        this._graphics.drawCircle(
            this._size / 2,
            this._size / 2,
            this._size - 24
        )
        this._graphics.endFill()
    }
    this.loadTexture(this._graphics.generateTexture())
}


Phaser.Msx.Button.prototype.setState = function (to) {
    if (to === undefined) {
        to = !this.state // toggle
    }
    if (this.buttonType == Phaser.Msx.Button.RADIO && !this.state) {
       this.state = to
        if (state == true) {
            // XXX: disable everything else in group
            this.group.forEach(function (el) {
                if (el !== this) {
                    // don't call setState as it will recurse
                    // no idea why we need to reset the fill - we just do
                    el.style.fill = el.style.fillOut
                    el.state = false
                    el.draw()
                }
            }, this)
        }
    } else if (this.toggle) {
        this.state = to
    }
    this.draw()
}


Phaser.Msx.Button.prototype._onInputOver = function () {
    this.style.fill = this.style.fillOver
    this._over = true
    this.draw()
}


Phaser.Msx.Button.prototype._onInputOut = function () {
    this.style.fill = this.style.fillOut
    this._over = false
    this.draw()
}


Phaser.Msx.Button.prototype._onInputDown = function () {
    if (this._over) {
        this.style.fill = this.style.fillDown
        this.draw(true)
    }
}


Phaser.Msx.Button.prototype._onInputUp = function () {
    if (this._over) {
        this.style.fill = this.style.fillOver
        this.setState() // toggle        
        this.callback.call(this.callbackContext, this.state)
    }
}

