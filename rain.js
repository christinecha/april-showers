'use strict'

let $raindropProto = document.createElement('div')
    $raindropProto.classList.add('raindrop')

let $puddleProto = document.createElement('div')
    $puddleProto.classList.add('puddle')

class Raindrop {

  constructor(config) {
    this.age                  = 0
    this.dripSpeed            = config.dripSpeed || 5
    this.groundLevel          = config.groundLevel || 400
    this.maxPuddling          = config.maxPuddling || 100
    this.originalHeight       = config.originalHeight || 50
    this.originalOpacity      = config.originalOpacity || 1
    this.originX              = config.originX || 0
    this.originY              = config.originY || 0
    this.originalPuddleWidth  = 50
    this.originalPuddleHeight = 10
    this.puddleSpeed          = 0.4
  }

  destroy() {
    document.body.removeChild(this.$raindrop)
    document.body.removeChild(this.$puddle)
  }

  drip() {
    // console.log('Dripping.')
    if (this.age < this.groundLevel) {
      requestAnimationFrame(() => {
        this.age += 1 * this.dripSpeed
        this.reposition.apply(this)
        this.render.apply(this)
        this.drip.apply(this)
      })
    } else if (this.age < this.groundLevel + this.maxPuddling) {
      requestAnimationFrame(() => {
        this.age += 1 * this.dripSpeed
        this.render.apply(this)
        this.drip.apply(this)
      })
    } else {
      this.destroy()
    }
  }

  reposition() {
    // console.log('Repositioning.')
    this.currentY = this.originY + this.age
  }

  render() {
    if (!this.$raindrop) {
      this.$raindrop = $raindropProto.cloneNode()
      this.$raindrop.style.opacity = this.originalOpacity
      this.$raindrop.style.left = this.originX + 'px'
      this.$raindrop.style.top = this.originY + 'px'
      document.body.appendChild(this.$raindrop)
    }

    this.$raindrop.style.transform = `translate3d(0, ${this.currentY - this.originY}px, 0)`
    this.$raindrop.style.WebkitTransform = `translate3d(0, ${this.currentY - this.originY}px, 0)`
    this.$raindrop.style.MozTransform = `translate3d(0, ${this.currentY - this.originY}px, 0)`
    this.$raindrop.style.OTransform = `translate3d(0, ${this.currentY - this.originY}px, 0)`

    if (this.age >= this.groundLevel) {
      let raindropHeight = this.originalHeight - (this.originalHeight * (this.age - this.groundLevel) / this.maxPuddling)
      this.$raindrop.style.height = raindropHeight + 'px'
      this.$raindrop.style.marginTop = this.originalHeight - raindropHeight + 'px'

      if (!this.$puddle) {
        this.$puddle = $puddleProto.cloneNode()
        this.$puddle.style.opacity = this.originalOpacity
        document.body.appendChild(this.$puddle)

        this.$puddle.style.left = this.originX + 'px'
        this.$puddle.style.top = this.currentY + 'px'
      }

      this.$puddle.style.width = this.originalPuddleWidth + ((this.age - this.groundLevel) * 2 * this.puddleSpeed) + 'px'
      this.$puddle.style.height = this.originalPuddleHeight + ((this.age - this.groundLevel) * 1 * this.puddleSpeed) + 'px'
      this.$puddle.style.opacity = this.originalOpacity - ((this.age - this.groundLevel) / this.maxPuddling)

      this.$puddle.style.marginLeft = -(this.$puddle.clientWidth / 2) + 'px';
      this.$puddle.style.marginTop = this.originalHeight - (this.$puddle.clientHeight / 2) + 'px';
    }
  }
}

let raining = null
let rainAmount = 100
let rainSpeed = 4
let toolsHidden = false

const rain = (amount) => {
  let dropCount = 0

  if (raining) { stopRaining() }

  raining = setInterval(() => {
    let config = {
      dripSpeed: (Math.random() * 2) + rainSpeed,
      groundLevel: (Math.random() * 50) + (window.innerHeight - 200),
      maxPuddling: (Math.random() * 20) + 150,
      originalHeight: (Math.random() * 20) + 30,
      originalOpacity: Math.random() * 0.8,
      originX: Math.random() * window.innerWidth,
      originY: (Math.random() * -100 - 50)
    }

    let drop = new Raindrop(config)
    drop.drip()

    dropCount += 1
  }, amount)
}

const stopRaining = () => {
  clearInterval(raining)
  raining = null
}

rain(rainAmount)

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'Digit1':
      rainAmount = rainAmount + 10 > 500 ? 500 : rainAmount + 10
      rainSpeed = rainSpeed - 0.5 < 0 ? 0 : rainSpeed - 0.5
      rain(rainAmount)
      break
    case 'Digit2':
      rainAmount = rainAmount - 10 < 10 ? 10 : rainAmount - 10
      rainSpeed = rainSpeed + 0.5 > 10 ? 10 : rainSpeed + 0.5
      rain(rainAmount)
      break
    case 'Digit3':
      if (!toolsHidden) { document.querySelector('.tools').style.display = 'none' }
      else { document.querySelector('.tools').style.display = 'block' }
      toolsHidden = !toolsHidden
      break
  }
})
