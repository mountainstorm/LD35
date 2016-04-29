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


var ROTATE_SPEED = 200 //400
var ACCELERATOR_SPEED = 800
var REACTION_SPEED = ACCELERATOR_SPEED * 1.5
var ELEMENT_REFRESH = 1000
var SCORE_RATE = 2000
var BOUNCE_DECAY = 0.8
var REACTION_WINDOW = (1000 / SCORE_RATE) * 10
var ENDGAME = 6000 // long enough for all decays to have completed
var ENDGAME_WAIT = 6000


Play = function () {
    Phaser.Msx.Play.call(this, 'Menu')
}


Play.prototype = Object.create(Phaser.Msx.Play.prototype)
Play.prototype.constructor = Play


Play.prototype.preload = function() {
    this.game.load.json('config', 'assets/config.json')

    this.game.load.image('element1-0', 'assets/imgs/element1-0.png')
    this.game.load.image('element1-1', 'assets/imgs/element1-1.png')
    this.game.load.image('element2-1', 'assets/imgs/element2-1.png')
    this.game.load.image('element2-2', 'assets/imgs/element2-2.png')
    this.game.load.image('element3-4', 'assets/imgs/element3-4.png')
    this.game.load.image('element4-3', 'assets/imgs/element4-3.png')
    this.game.load.image('element4-4', 'assets/imgs/element4-4.png')
    this.game.load.image('element5-3', 'assets/imgs/element5-3.png')

    this.game.load.image('element-p', 'assets/imgs/element-p.png')
    this.game.load.image('element-y', 'assets/imgs/element-y.png')
    this.game.load.image('element-v', 'assets/imgs/element-v.png')

    this.game.load.audio('fusion', 'assets/sounds/fusion.mp3')
    this.game.load.audio('hip', 'assets/sounds/hip.mp3')
    this.game.load.audio('hip-y', 'assets/sounds/hip.mp3')

    this.score = 0
    this.scoreBonus = 0
    this._lastScore = 0
    this._displayScore = 0
    this.reactions = 0
    this._lastReactions = 0
    this.heat = 0
    this._currentHeat = 0

    this.chainReactions = 0
    this.reactionHistory = []

    this.showingBonus = false
    this.bonusDisplayQueue = []

    this.fusionFlash = 0

    //
    // Settings
    //

    // bonuses are # of chain reactions total so far
    // this.config.chainReactionBonus

    // energy bonus are score (excluding bonus) in a SCORE_RATE window
    // keep these in high to low format as we stop when we find a match
    // this.config.energyBonus

    // reaction bonus is awarded if the last REACTION_WINDOW readings above these levels
    // must be high to low as we stop of first match
    // this.config.reactionBonus
}


Play.prototype.init = function(autoplay) {
    this.autoplay = autoplay
    Phaser.Msx.Play.prototype.init.call(this)
    this.FUSION_FLASH = 3
    if (this.game.settings.load('flashing') == false) {
        this.FUSION_FLASH = 0 // turn off flashing
    }
}


Play.prototype.create = function() {
    this.selected = []
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.config = this.game.cache.getJSON('config')     

    // load all the start elements
    this.remainingResource = 0
    this.atoms = this.game.add.physicsGroup(Phaser.Physics.ARCADE)
    Object.keys(this.config.elementsInfo).forEach(function (elementType) {
        var elementInfo = this.config.elementsInfo[elementType]
        if (elementInfo.initialCount > 0) {
            for (var i = 0; i < elementInfo.initialCount; i++) {
                this.addElement(elementType)
            }
            elementInfo.budget -= elementInfo.initialCount
            this.remainingResource += elementInfo.budget
        }
    }, this)

    // check we have enough base elements       
    this.game.time.events.loop(ELEMENT_REFRESH, function () {
        var typesCount = {}
        this.atoms.forEach(function (sprite) {
            if (!(sprite.elementType in typesCount)) {
                typesCount[sprite.elementType] = 0
            }
            typesCount[sprite.elementType] += 1
        })
        Object.keys(this.config.elementsInfo).forEach(function (elementType) {
            var elementInfo = this.config.elementsInfo[elementType]
            if (elementInfo.initialCount && typesCount[elementType] < elementInfo.initialCount) {
                // create more of this element
                for (var i = 0; i < 2; i++) {
                    if (elementInfo.budget > 0) {
                        this.addElement(elementType)
                        elementInfo.budget--
                        this.remainingResource--
                        //this.hudResources.text = 'Resources: ' + this.remainingResource
                    }
                }
            }
        }, this)
    }, this)

    // score rate (background color, periodic bonuses) 
    this.game.time.events.loop(SCORE_RATE, function () {
        var ds = this.score - this._lastScore
        var dr = this.reactions - this._lastReactions

        this.reactionHistory.push(dr)
        if (this.reactionHistory.length > REACTION_WINDOW) {
            this.reactionHistory.shift()
        }
        var avg = 0
        var total = 0.0
        this.reactionHistory.forEach(function (bonus) {
            total += bonus
        }, this)
        avg = total / this.reactionHistory.length
        if (this.reactionHistory.length == REACTION_WINDOW) {
            this.config.reactionBonus.forEach(function (bonus) {
                if (avg > bonus.target) {
                    this.scoreBonus += bonus.score
                    this.showBonus(bonus.title)
                    return false
                }
            }, this)
        }
        this.heat = avg

        this.config.energyBonus.forEach(function (bonus) {
            if (ds >= bonus.target) {
                this.scoreBonus += bonus.score
                this.showBonus(bonus.title)
                return false
            }
        }, this)
        this._lastScore = this.score
        this._lastReactions = this.reactions
    }, this)

    this.game.time.events.loop(ENDGAME, function () {
        // check for endgame
        if (this.bonusDisplayQueue.length == 0 &&
            this._displayScore == this.score + this.scoreBonus &&
            this.remainingResource == 0) {
            // we're done - if all reactions are done
            // we've eaited long enough that there no decay happening
            var nodice = false
            this.atoms.forEach(function (a) {
                this.atoms.forEach(function (b) {
                    if (a != b) {
                        // ignore self on self checks
                        if (this.allowedCombination(a, b)) {
                            nodice = true
                        }
                    }
                }, this)
            }, this)
            if (nodice == false) {
                // we're done!
                var text = this.game.add.text(
                    this.game.world.centerX, this.game.world.centerY,
                    'GAME OVER',
                    Phaser.Msx.H1
                )
                text.alpha = 0
                text.anchor.setTo(0.5, 0.5)
                var e = this.game.add.tween(text).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false)
                e.onComplete.add(function () {
                    this.game.time.events.add(ENDGAME_WAIT, function () {
                        // store the final score
                        this.game.state.start('HighScores', true, false, self.score + self.scoreBonus)
                    }, this)
                }, this)
            }
        }
    }, this)

    this.hudScore = this.game.add.text(
        this.game.world.centerX, 0,
        'Score: 0',
        Phaser.Msx.CONTROL
    )
    this.hudScore.anchor.setTo(0.5, 0)

    if (!this.autoplay) {
        this.game.input.onTap.add(function (pointer) {
            if (!this.game.paused) {
                var nearestDistance = this.game.world.width + this.game.world.height
                var nearestSprite = null
                this.atoms.forEach(function (sprite) {
                    if (this.selected.indexOf(sprite) == -1) {
                        var dx = Math.abs(pointer.x - sprite.x)
                        var dy = Math.abs(pointer.y - sprite.y)
                        if (dx + dy < nearestDistance) {
                            nearestDistance = dx + dy
                            nearestSprite = sprite
                        }
                    }
                }, this)
                if (nearestSprite) {
                    this.selectElement(nearestSprite)
                }
            }
        }, this)
    } else {
        // random select and tap
        this.time.events.loop(100, function () {
            var i = this.game.rnd.integerInRange(0, this.atoms.length-1)
            this.selectElement(this.atoms.children[i])
        }, this)
    }
}


Play.prototype.update = function() {
    var play = this
    this.game.physics.arcade.collide(this.atoms, undefined, function (a, b) {
        if (play.collide(a, b)) {
            play.fusionFlash = play.FUSION_FLASH
        }
    })

    this.atoms.forEach(function (sprite) {
        if (sprite.trail) {
            sprite.rotation = sprite.body.angle
            sprite.trail.bitmap.context.fillRect(sprite.x, sprite.y, 2, 2);
            sprite.trail.bitmap.dirty = true
        }
    }, this)

    if (this.score + this.scoreBonus > this._displayScore) {
        var ds = this.score + this.scoreBonus - this._displayScore
        if (ds < 100) {
            this._displayScore = this.score + this.scoreBonus
        } else if (ds <= 0) {
            // do nothing yet
        } else {
            this._displayScore += Math.floor(ds / 10)
        }
    }
    this.hudScore.text = 'Score: ' + this._displayScore

    if (this.heat > this._currentHeat) {
        this._currentHeat += 0.01
    } else if (this.heat < this._currentHeat) {
        this._currentHeat -= 0.01
        if (this._currentHeat < 0.0) {
            this._currentHeat = 0.0
        }
    }
    var g = 6.0 / (this.config.bgGradient.length - 1.0)
    var h = Math.round(this._currentHeat / g)
    if (this.fusionFlash > 0 || h >= this.config.bgGradient.length) {
        h = this.config.bgGradient.length - 1
    }
    this.game.stage.backgroundColor = this.config.bgGradient[h]
    this.displayBonus()

    if (this.fusionFlash > 0) {
        this.fusionFlash--
    }        
}


Play.prototype.render = function() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00")
}


Play.prototype.addElement = function (elementType, x, y, reaction) {
    if (x == undefined || y == undefined) {
        x = this.game.rnd.integerInRange(0, this.game.world.width)
        y = this.game.rnd.integerInRange(0, this.game.world.height)
    }
    var elementInfo = this.config.elementsInfo[elementType]
    var dx = this.game.rnd.integerInRange(-ACCELERATOR_SPEED, ACCELERATOR_SPEED)
    var dy = this.game.rnd.integerInRange(-ACCELERATOR_SPEED, ACCELERATOR_SPEED)
    if (reaction == undefined) {
        dx = this.game.rnd.integerInRange(-elementInfo.speed.min, elementInfo.speed.max)
        dy = this.game.rnd.integerInRange(-elementInfo.speed.min, elementInfo.speed.max)
    }
    var element = this.game.make.bitmapData()
    
    element.load(elementType)
    var sprite = this.game.add.sprite(x, y, element)
    sprite.bitmap = element
    sprite.elementType = elementType
    sprite.dontDecay = false
    this.game.physics.arcade.enable(sprite)
    sprite.anchor.set(0.5, 0.5)
    sprite.body.collideWorldBounds = true
    sprite.body.velocity.set(dx, dy)
    sprite.body.angularVelocity = this.game.rnd.realInRange(-ROTATE_SPEED, ROTATE_SPEED)
    sprite.inputEnabled = true
    var decay = BOUNCE_DECAY
    if (elementInfo.hip == true) {
        sprite.inputEnabled = false
        decay = 1.0
        sprite.body.collideWorldBounds = false
    }
    sprite.body.bounce.set(decay, decay)

    if (elementInfo.sound) {
        this.game.sound.play(elementInfo.sound, this.game.settings.load('soundVolume'))
    }

    if (reaction == undefined) {
        sprite.alpha = 0
        this.game.add.tween(sprite).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false)
    }

    if (elementInfo.hip) {
        // high energy particle
        var trail = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        trail.context.fillStyle = '#ffffff'
        var trailSprite = this.game.add.sprite(0, 0, trail)
        trailSprite.bitmap = trail
        sprite.trail = trailSprite

        var t = this.game.add.tween(sprite.trail).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false)
        var t = this.game.add.tween(sprite).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false)
        t.onComplete.add(function () {
            sprite.trail.destroy()
            this.atoms.remove(sprite)
        }, this)
    } else if (elementInfo.decay) {
        // decay of unstable elements
        this.game.time.events.add(this.game.rnd.integerInRange(elementInfo.decay.min, elementInfo.decay.max), function () {
            // decay object - don't if its already been removed my fusion
            if (sprite.dontDecay == false) {
                this.atoms.remove(sprite)
                this.incrementScore(elementInfo.decay.score)
                elementInfo.decay.elements.forEach(function (elementType) {
                    this.addElement(elementType, sprite.world.x, sprite.world.y)
                }, this)
                this.reactions++
            }
        }, this)
    }
    this.atoms.add(sprite)
    return sprite
}


Play.prototype.selectElement = function (sprite) {
    var self = this
    var retval = false
    // dont allow selection of hip's
    if (self.config.elementsInfo[sprite.elementType].selectable != false) {
        retval = true
        sprite.bitmap.setHSL(undefined, 0.8, undefined)
        self.selected.push(sprite)
        if (self.selected.length > 2) {
            var deselect = self.selected.shift()
            deselect.bitmap.load(deselect.elementType)
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
}


Play.prototype.collide = function (a, b) {
    var retval = false

    if (this.selected.indexOf(a) != -1 && this.selected.indexOf(b) != -1) {
        this.chainReactions++
        if (this.config.chainReactionBonus.length > 0 && this.chainReactions == this.config.chainReactionBonus[0].target) {
            var bonus = this.config.chainReactionBonus.shift()
            this.scoreBonus += bonus.score // keep score seperate
            this.showBonus(bonus.title)
        }
    }

    // they hit each other!
    var cp = a.body.speed + b.body.speed
    //console.log(a, 'hit', b, 'closing speed: ' + cp)
    // 1.5 to account for rounding errors
    if (cp >= REACTION_SPEED && this.allowedCombination(a, b)) {
        // remove the sprites and replace with the combined
        a.dontDecay = true
        b.dontDecay = true
        this.atoms.remove(a)
        this.atoms.remove(b)
        this.fuseElements(a, b)
        this.reactions++
        retval = true // fusoion occured
    }
    return retval
}


Play.prototype.fuseElements = function (a, b) {
    // create combined object
    var x = a.world.x + ((a.world.x - b.world.x) / 2)
    var y = a.world.y + ((a.world.y - b.world.y) / 2)
    
    // remove items from selected array
    this.selected = this.selected.filter(function (e) {
        if (e == a || e == b) {
            e.bitmap.load(e.elementType)
            return false
        }
        return true
    })

    this.game.sound.play('fusion', this.game.settings.load('soundVolume'))

    var fusionResult = this.getFusionResult(a, b)
    this.incrementScore(fusionResult.score)
    var selectedOne = false
    fusionResult.elements.forEach(function (elementType) {
        var sprite = this.addElement(elementType, x, y, true)
        if (selectedOne == false) {
            if (this.selectElement(sprite)) {
                selectedOne = true
            }
        }
    }, this)
}


Play.prototype.allowedCombination = function (a, b) {
    var retval = false
    if (a.elementType + '+' + b.elementType in this.config.combinations ||
        b.elementType + '+' + a.elementType in this.config.combinations) {
        retval = true
    }
    return retval
}


Play.prototype.getFusionResult = function (a, b) {
    var retval = null
    if (a.elementType + '+' + b.elementType in this.config.combinations) {
        retval = this.config.combinations[a.elementType + '+' + b.elementType]
    } else if (b.elementType + '+' + a.elementType in this.config.combinations) {
        retval = this.config.combinations[b.elementType + '+' + a.elementType]
    }
    return retval
}


Play.prototype.incrementScore = function (points) {
    this.score += points
}


Play.prototype.showBonus = function (title) {
    console.log(title)
    this.bonusDisplayQueue.push(title)
}


Play.prototype.displayBonus = function () {
    if (this.bonusDisplayQueue.length > 0 && this.showingBonus == false) {
        this.showingBonus = true
        var title = this.bonusDisplayQueue.shift()
        var text = PHASER.add.text(
            PHASER.world.centerX, PHASER.world.centerY,
            title,
            Phaser.Msx.H1
        )
        text.alpha = 0
        text.anchor.setTo(0.5, 0.5)
        var e = PHASER.add.tween(text).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false)
        e.onComplete.add(function () {
            var l = PHASER.add.tween(text).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true, 1000, 0, false)
            l.onComplete.add(function () {
                this.showingBonus = false
            }, this)

        }, this)   
    }
}

