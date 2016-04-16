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


var ACCELERATOR_SPEED = 800


var playState = function() {}


playState.prototype = {
    preload: function() {
        var self = this
        PHASER.load.image('element1-0', 'assets/imgs/element1-0.png')
        PHASER.load.image('element1-1', 'assets/imgs/element1-1.png')
        PHASER.load.image('element2-1', 'assets/imgs/element2-1.png')
        PHASER.load.image('element2-2', 'assets/imgs/element2-2.png')
        PHASER.load.image('element4-3', 'assets/imgs/element4-3.png')
        PHASER.load.image('element4-4', 'assets/imgs/element4-4.png')
        PHASER.load.image('element5-3', 'assets/imgs/element5-3.png')

        // XXX: some of these should really be wiggly wave lines (Feynman diagram style)
        PHASER.load.image('element-p', 'assets/imgs/element-p.png')
        PHASER.load.image('element-y', 'assets/imgs/element-y.png')
        PHASER.load.image('element-v', 'assets/imgs/element-v.png')

        // mapping table
        self.startElements = {
            'element1-0': 50,
            'element2-2': 10
        }
        self.combinations = {
            'element1-0+element1-0': ['element1-1', 'element-v', 'element-p'],
            'element1-1+element1-0': ['element2-1', 'element-y'],
            'element2-1+element2-2': ['element4-3', 'element-y'],
            'element4-3+element1-0': ['element5-3', 'element-y']
        }
        self.elementsInfo = {
            'element1-0': { speed: { min: 10, max: 20 }, initialCount: 50 },
            'element1-1': { speed: { min: 8, max: 18 }, initialCount: 10 },
            'element2-1': { speed: { min: 6, max: 16 } },
            'element2-2': { speed: { min: 4, max: 14 } },
            'element4-3': { speed: { min: 2, max: 12 } },
            'element4-4': { speed: { min: 1, max: 10 }, selectable: false, decay: { min: 3000, max: 5000, elements: ['element2-2', 'element2-2'] } },
            'element5-3': { speed: { min: 0, max: 8 }, selectable: false, decay: { min: 2000, max: 3000, elements: ['element4-4', 'element-v', 'element-p'] } },

            'element-p': { speed: { min: 2000, max: 2200 }, hip: true, selectable: false },
            'element-y': { speed: { min: 1800, max: 2000 }, hip: true, selectable: false },
            'element-v': { speed: { min: 1450, max: 1500 }, hip: true, selectable: false }
        }
    },

    create: function() {
        var self = this
        self.selected = []
        PHASER.physics.startSystem(Phaser.Physics.ARCADE)

        self.atoms = PHASER.add.physicsGroup(Phaser.Physics.ARCADE)
        $.each(self.startElements, function (elementType, elementCount) {
            for (var i = 0; i < elementCount; i++) {
                self.addElement(elementType)
            }
        })
       
        // var fullscreen = PHASER.add.button(
        //     PHASER.world.width, PHASER.world.height, 'fullscreenToggleButton', toggleFullscreen, 0, 0, 1, 2
        // )
        // fullscreen.anchor.setTo(1, 1)
    },

    update: function() {
        var self = this
        PHASER.physics.arcade.collide(self.atoms, undefined, function (a, b) {
            self.collide(a, b)
        })
    },

    render: function() {
        PHASER.debug.text(PHASER.time.fps || '--', 2, 14, "#00ff00")
    },

    addElement: function (elementType, x, y) {
        var self = this
        if (x == undefined || y == undefined) {
            x = PHASER.rnd.integerInRange(0, PHASER.world.width)
            y = PHASER.rnd.integerInRange(0, PHASER.world.height)
        }
        var fx = PHASER.rnd.integerInRange(0, 1)
        if (fx == 0) fx = -1
        var fy = PHASER.rnd.integerInRange(0, 1)
        if (fy == 0) fy = -1
        var elementInfo = self.elementsInfo[elementType]
        var dx = PHASER.rnd.integerInRange(elementInfo.speed.min, elementInfo.speed.max) * fx
        var dy = PHASER.rnd.integerInRange(elementInfo.speed.min, elementInfo.speed.max) * fy
        var element = PHASER.make.bitmapData()
        
        element.load(elementType)
        var sprite = PHASER.add.sprite(x, y, element)
        sprite.bitmap = element
        sprite.elementType = elementType
        PHASER.physics.arcade.enable(sprite)
        sprite.body.collideWorldBounds = true
        sprite.body.velocity.set(dx, dy)
        sprite.inputEnabled = true
        var decay = 0.5
        if (elementInfo.hip == true) {
            sprite.inputEnabled = false
            decay = 1.0
            sprite.body.collideWorldBounds = false
        }
        sprite.body.bounce.set(decay, decay)

        if (elementInfo.hip) {
            // high energy particle
            var t = PHASER.add.tween(sprite).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false)
            t.onComplete.add(function () {
                self.atoms.remove(sprite)
            })
        } else if (elementInfo.decay) {
            // decay of unstable elements
            PHASER.time.events.add(PHASER.rnd.integerInRange(elementInfo.decay.min, elementInfo.decay.max), function () {
                // decay object
                self.atoms.remove(sprite)  
                var elementTypes = elementInfo.decay.elements
                $.each(elementTypes, function (i) {
                    console.log('decaying into', elementTypes[i])
                    self.addElement(elementTypes[i], x, y)
                })
            })
        }
        
        sprite.events.onInputDown.add(function () {
            self.selectElement(this)
        }, sprite)
        self.atoms.add(sprite)
    },

    selectElement: function (sprite) {
        var self = this
        // dont allow selection of hip's
        if (self.elementsInfo[sprite.elementType].selectable != false && self.selected.indexOf(sprite) == -1) {
            if (self.selected.length == 2) {
                // XXX: deselect if its already selected
            } else {
                sprite.bitmap.setHSL(0.2)
                self.selected.push(sprite)
                if (self.selected.length > 2) {
                    var deselect = self.selected.shift()
                    deselect.bitmap.setHSL(0.0)
                }
                if (self.selected.length == 2) {
                    // change velocity so its towards each other
                    var a = self.selected[0]
                    var b = self.selected[1]
                    dx = a.world.x - b.world.x
                    dy = a.world.y - b.world.y
                    console.log(a, b, dx, dy)
                    // get the distance between the two points
                    var h = Math.sqrt(dx * dx + dy * dy)
                    var f = h / ACCELERATOR_SPEED                 
                    a.body.velocity.set(
                        -dx / f,
                        -dy / f
                    )
                    b.body.velocity.set(
                        dx / f,
                        dy / f
                    )
                }
            }
        }
    },

    collide: function (a, b) {
        var self = this
        var aa = undefined
        var bb = undefined
        self.selected = self.selected.filter(function (e) {
            if (e == a || e == b) {
                e.bitmap.setHSL(0.0) // disable
                if (e == a) aa = a
                if (e == b) bb = b
                return false
            }
            return true
        })

        if (aa != undefined && bb != undefined) {
            // they hit each other!
            var cp = a.body.speed + b.body.speed
            console.log(a, 'hit', b, 'closing speed: ' + cp)
            // 1.5 to account for rounding errors
            if (cp >= ACCELERATOR_SPEED * 1.5 && self.allowedCombination(a, b)) {
                // remove the sprites and replace with the combined
                self.atoms.remove(aa)
                self.atoms.remove(bb)
                self.fuseElements(aa, bb)
            }
        }
    },

    fuseElements: function (a, b) {
        var self = this
        // create combined object
        var x = a.world.x + ((a.world.x - b.world.x) / 2)
        var y = a.world.y + ((a.world.y - b.world.y) / 2)
        
        var elementTypes = self.getNewElementTypes(a, b)
        $.each(elementTypes, function (i) {
            self.addElement(elementTypes[i], x, y)
        })
    },

    allowedCombination: function (a, b) {
        var self = this
        var retval = false
        if (a.elementType + '+' + b.elementType in self.combinations ||
            b.elementType + '+' + a.elementType in self.combinations) {
            retval = true
        }
        return retval
    },

    getNewElementTypes: function (a, b) {
        var self = this
        var retval = null
        if (a.elementType + '+' + b.elementType in self.combinations) {
            retval = self.combinations[a.elementType + '+' + b.elementType]
        } else if (b.elementType + '+' + a.elementType in self.combinations) {
            retval = self.combinations[b.elementType + '+' + a.elementType]
        }
        return retval
    }
}

