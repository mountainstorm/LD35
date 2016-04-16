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


var ROTATE_SPEED = 600
var ACCELERATOR_SPEED = 800
var REACTION_SPEED = ACCELERATOR_SPEED
var ELEMENT_REFRESH = 1000
var SCORE_RATE = 500
var BOUNCE_DECAY = 0.8
var HEAT_GROW = 10
var HEAT_SHRINK = 5


var playState = function() {}


playState.prototype = {
    preload: function() {
        var self = this
        PHASER.load.image('element1-0', 'assets/imgs/element1-0.png')
        PHASER.load.image('element1-1', 'assets/imgs/element1-1.png')
        PHASER.load.image('element2-1', 'assets/imgs/element2-1.png')
        PHASER.load.image('element2-2', 'assets/imgs/element2-2.png')
        PHASER.load.image('element3-4', 'assets/imgs/element3-4.png')
        PHASER.load.image('element4-3', 'assets/imgs/element4-3.png')
        PHASER.load.image('element4-4', 'assets/imgs/element4-4.png')
        PHASER.load.image('element5-3', 'assets/imgs/element5-3.png')

        // XXX: some of these should really be wiggly wave lines (Feynman diagram style)
        PHASER.load.image('element-p', 'assets/imgs/element-p.png')
        PHASER.load.image('element-y', 'assets/imgs/element-y.png')
        PHASER.load.image('element-v', 'assets/imgs/element-v.png')

        self.score = 0
        self._lastScore = 0
        self.heat = 0
        self.combinations = {
            'element1-0+element1-0': { score: 200, elements: ['element1-1', 'element-v', 'element-p'] },
            'element1-1+element1-0': { score: 200, elements: ['element2-1', 'element-y'] },
            'element2-1+element2-2': { score: 200, elements: ['element4-3', 'element-y'] },
            'element4-3+element1-0': { score: 1000, elements: ['element5-3', 'element-y'] },
            'element2-1+element2-1': { score: 200, elements: ['element1-0', 'element1-0', 'element2-2'] },
            'element3-4+element1-0': { score: 200, elements: ['element2-2', 'element2-2'] },
        }
        self.elementsInfo = {
            'element1-0': { speed: { min: 10, max: 20 }, initialCount: 50, budget: 300 },
            'element1-1': { speed: { min: 8, max: 18 } },
            'element2-1': { speed: { min: 6, max: 16 } },
            'element2-2': { speed: { min: 4, max: 14 } },
            'element4-3': { speed: { min: 2, max: 12 }, decay: { min: 3000, max: 5000, score: 200, elements: ['element3-4', 'element-v'] } },
            'element3-4': { speed: { min: 2, max: 12 } },
            'element4-4': { speed: { min: 1, max: 10 }, selectable: false, decay: { min: 3000, max: 5000, score: 200, elements: ['element2-2', 'element2-2'] } },
            'element5-3': { speed: { min: 0, max: 8 }, selectable: false, decay: { min: 2000, max: 3000, score: 200, elements: ['element4-4', 'element-v', 'element-p'] } },

            'element-p': { speed: { min: 2000, max: 2200 }, hip: true, selectable: false },
            'element-y': { speed: { min: 1800, max: 2000 }, hip: true, selectable: false },
            'element-v': { speed: { min: 1450, max: 1500 }, hip: true, selectable: false }
        }

        self.bgGradient = [
'#250918',
'#280A19',
'#2B0B1B',
'#2F0D1C',
'#320E1E',
'#36101F',
'#391121',
'#3D1322',
'#401523',
'#441725',
'#471926',
'#4B1B27',
'#4E1D28',
'#511F2A',
'#55222B',
'#58242C',
'#5C262D',
'#5F292E',
'#632B30',
'#662E31',
'#6A3132',
'#6D3434',
'#713837',
'#743C3A',
'#78413D',
'#7B4640',
'#7E4A43',
'#824F46',
'#85544A',
'#89594D',
'#8C5E51',
'#906354',
'#936858',
'#976E5C',
'#9A735F',
'#9E7863',
'#A17D67',
'#A5826B',
'#A8886F',
'#AB8D74',
'#AF9278',
'#B2987C',
'#B69D81',
'#B9A285',
'#BDA88A',
'#C0AD8E',
'#C4B293',
'#C7B798',
'#CBBC9D',
'#CEC1A2',
'#D2C6A7',
'#D5CBAC',
'#D8D0B1',
'#DCD5B7',
'#DFDABC',
'#E3DEC1',
'#E6E3C7',
'#EAE7CC',
'#EDECD2',
'#F1F0D8',
'#F4F4DE',
'#F7F8E3',
'#FAFBE9',
'#FDFFF0',
        ]
    },

    create: function() {
        var self = this
        self.selected = []
        PHASER.physics.startSystem(Phaser.Physics.ARCADE)

        self.atoms = PHASER.add.physicsGroup(Phaser.Physics.ARCADE)
        $.each(self.elementsInfo, function (elementType, elementInfo) {
            if (elementInfo.initialCount > 0) {
                for (var i = 0; i < elementInfo.initialCount; i++) {
                    self.addElement(elementType)
                }
                elementInfo.budget -= elementInfo.initialCount
            }
        })

        // check we have enough base elements       
        PHASER.time.events.loop(PHASER.rnd.integerInRange(ELEMENT_REFRESH, ELEMENT_REFRESH), function () {
            var typesCount = {}
            self.atoms.forEach(function (sprite) {
                if (!(sprite.elementType in typesCount)) {
                    typesCount[sprite.elementType] = 0
                }
                typesCount[sprite.elementType] += 1
            })
            $.each(self.elementsInfo, function (elementType, elementInfo) {
                if (elementInfo.initialCount && typesCount[elementType] < elementInfo.initialCount) {
                    // create more of this element
                    if (elementInfo.budget > 0) {
                        self.addElement(elementType)
                    }
                }
            })
        })

        // score rate (background color)
        PHASER.time.events.loop(SCORE_RATE, function () {
            if ((self.score - self._lastScore) > 0) {
                if (self.heat < self.bgGradient.length * HEAT_GROW) {
                    self.heat += HEAT_GROW
                }
            } else {
                if (self.heat > 0) {
                    self.heat -= HEAT_SHRINK
                }
            }
            PHASER.stage.backgroundColor = self.bgGradient[Math.round(self.heat / 10)]
            //console.log('score progress: ' + self.score + ', ' +  self._lastScore + ', ' + self.heat)
            self._lastScore = self.score
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

        self.atoms.forEach(function (sprite) {
            if (sprite.trail) {
                sprite.trail.bitmap.context.fillRect(sprite.x, sprite.y, 2, 2);
                sprite.trail.bitmap.dirty = true
            }
        })
    },

    render: function() {
        PHASER.debug.text(PHASER.time.fps || '--', 2, 14, "#00ff00")
    },

    addElement: function (elementType, x, y, reaction) {
        var self = this
        if (x == undefined || y == undefined) {
            x = PHASER.rnd.integerInRange(0, PHASER.world.width)
            y = PHASER.rnd.integerInRange(0, PHASER.world.height)
        }
        var elementInfo = self.elementsInfo[elementType]
        var dx = PHASER.rnd.integerInRange(-ACCELERATOR_SPEED, ACCELERATOR_SPEED)
        var dy = PHASER.rnd.integerInRange(-ACCELERATOR_SPEED, ACCELERATOR_SPEED)
        if (reaction == undefined) {
            dx = PHASER.rnd.integerInRange(-elementInfo.speed.min, elementInfo.speed.max)
            dy = PHASER.rnd.integerInRange(-elementInfo.speed.min, elementInfo.speed.max)
        }
        var element = PHASER.make.bitmapData()
        
        element.load(elementType)
        var sprite = PHASER.add.sprite(x, y, element)
        sprite.bitmap = element
        sprite.elementType = elementType
        sprite.dontDecay = false
        PHASER.physics.arcade.enable(sprite)
        sprite.anchor.set(0.5, 0.5)
        sprite.body.collideWorldBounds = true
        sprite.body.velocity.set(dx, dy)
        sprite.body.angularVelocity = PHASER.rnd.realInRange(-ROTATE_SPEED, ROTATE_SPEED)
        sprite.inputEnabled = true
        var decay = BOUNCE_DECAY
        if (elementInfo.hip == true) {
            sprite.inputEnabled = false
            decay = 1.0
            sprite.body.collideWorldBounds = false
        }
        sprite.body.bounce.set(decay, decay)

        if (reaction == undefined) {
            sprite.alpha = 0
            PHASER.add.tween(sprite).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false)
        }

        if (elementInfo.hip) {
            // high energy particle
            var trail = PHASER.add.bitmapData(PHASER.world.width, PHASER.world.height);
            trail.context.fillStyle = '#ffffff'
            var trailSprite = PHASER.add.sprite(0, 0, trail)
            trailSprite.bitmap = trail
            sprite.trail = trailSprite

            var t = PHASER.add.tween(sprite.trail).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false)
            var t = PHASER.add.tween(sprite).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false)
            t.onComplete.add(function () {
                sprite.trail.destroy()
                self.atoms.remove(sprite)
            })
        } else if (elementInfo.decay) {
            // decay of unstable elements
            PHASER.time.events.add(PHASER.rnd.integerInRange(elementInfo.decay.min, elementInfo.decay.max), function () {
                // decay object - don't if its already been removed my fusion
                if (sprite.dontDecay == false) {
                    self.atoms.remove(sprite)
                    self.incrementScore(elementInfo.decay.score)
                    var elementTypes = elementInfo.decay.elements
                    $.each(elementTypes, function (i) {
                        self.addElement(elementTypes[i], sprite.world.x, sprite.world.y)
                    })
                }
            })
        }
        
        sprite.events.onInputDown.add(function () {
            self.selectElement(this)
        }, sprite)
        self.atoms.add(sprite)
        return sprite
    },

    selectElement: function (sprite) {
        var self = this
        var retval = false
        // dont allow selection of hip's
        if (self.elementsInfo[sprite.elementType].selectable != false && self.selected.indexOf(sprite) == -1) {
            retval = true
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
                //console.log(a, b, dx, dy)
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
        return retval
    },

    collide: function (a, b) {
        var self = this

        // they hit each other!
        var cp = a.body.speed + b.body.speed
        //console.log(a, 'hit', b, 'closing speed: ' + cp)
        // 1.5 to account for rounding errors
        if (cp >= REACTION_SPEED && self.allowedCombination(a, b)) {
            // remove the sprites and replace with the combined
            a.dontDecay = true
            b.dontDecay = true
            self.atoms.remove(a)
            self.atoms.remove(b)
            self.fuseElements(a, b)
        }
    },

    fuseElements: function (a, b) {
        var self = this
        // create combined object
        var x = a.world.x + ((a.world.x - b.world.x) / 2)
        var y = a.world.y + ((a.world.y - b.world.y) / 2)
        
        // remove items from selected array
        self.selected = self.selected.filter(function (e) {
            if (e == a || e == b) {
                e.bitmap.setHSL(0.0) // disable
                return false
            }
            return true
        })

        var fusionResult = self.getFusionResult(a, b)
        self.incrementScore(fusionResult.score)
        var elementTypes = fusionResult.elements
        var selectedOne = false
        $.each(elementTypes, function (i) {
            var sprite = self.addElement(elementTypes[i], x, y, true)
            if (selectedOne == false) {
                if (self.selectElement(sprite)) {
                    selectedOne = true
                }
            }
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

    getFusionResult: function (a, b) {
        var self = this
        var retval = null
        if (a.elementType + '+' + b.elementType in self.combinations) {
            retval = self.combinations[a.elementType + '+' + b.elementType]
        } else if (b.elementType + '+' + a.elementType in self.combinations) {
            retval = self.combinations[b.elementType + '+' + a.elementType]
        }
        return retval
    },

    incrementScore: function (points) {
        var self = this
        self.score += points
    }
}

