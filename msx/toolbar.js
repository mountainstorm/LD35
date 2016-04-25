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









