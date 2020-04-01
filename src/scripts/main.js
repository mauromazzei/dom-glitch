import 'p5/lib/p5.min'
const ID = 'dom-glitch-canvas'

let __initialized = false

export default class Glitch {
  constructor() {
    // programmatic
    this.channelLen = 4
    this.flow_t1_min = 0
    this.flow_t1_max = 10000
    this.flow_speed_min = 4
    this.flow_speed_max = 240
    this.flow_randomX_min = 24
    this.flow_randomX_max = 800
    this.imgOrigin = null

    this.canvas = null
    window.setup = this.__onWindowSetup
    window.draw = this.__draw
  }

  glitch = ({ $dom, src }) => {
    if (typeof window.resizeCanvas == 'function') {
      let elemRect = $dom.getBoundingClientRect()

      // resize canvas e set the position relative to the triggerind dom element
      window.resizeCanvas(elemRect.width, elemRect.height)
      this.canvas.position(0, 0)
      this.canvas.parent($dom)

      // load image
      window.loadImage(src, img => {
        console.log('[GlitchDom] - image loaded')
        img.resize(elemRect.width, elemRect.height)
        window.tint(255, 0)

        this.__init(img)
      })
    }
  }

  off = () => {
    __initialized = false

    this.canvas.position(-1000, -1000)
  }

  __init = img => {
    this.imgOrigin = img
    this.imgOrigin.loadPixels()
    this.copyData = []
    this.flowLineImgs = []
    this.shiftLineImgs = []
    this.shiftRGBs = []
    this.scatImgs = []
    this.throughFlag = true
    this.copyData = new Uint8ClampedArray(this.imgOrigin.pixels)

    // flow line
    for (let i = 0; i < 1; i++) {
      let o = {
        pixels: null,
        t1: window.floor(window.random(this.flow_t1_min, this.flow_t1_max)),
        speed: window.floor(
          window.random(this.flow_speed_min, this.flow_speed_max)
        ),
        randX: window.floor(
          window.random(this.flow_randomX_min, this.flow_randomX_max)
        )
      }
      this.flowLineImgs.push(o)
    }

    // shift line
    for (let i = 0; i < 6; i++) {
      let o = null
      this.shiftLineImgs.push(o)
    }

    // shift RGB
    for (let i = 0; i < 1; i++) {
      let o = null
      this.shiftRGBs.push(o)
    }

    // scat imgs
    for (let i = 0; i < 3; i++) {
      let scatImg = {
        img: null,
        x: 0,
        y: 0
      }
      this.scatImgs.push(scatImg)
    }

    __initialized = true
  }

  __replaceData(destImg, srcPixels) {
    let r, g, b, a
    let index

    for (let y = 0; y < destImg.height; y++) {
      for (let x = 0; x < destImg.width; x++) {
        index = (y * destImg.width + x) * this.channelLen
        r = index
        g = index + 1
        b = index + 2
        a = index + 3
        destImg.pixels[r] = srcPixels[r]
        destImg.pixels[g] = srcPixels[g]
        destImg.pixels[b] = srcPixels[b]
        destImg.pixels[a] = srcPixels[a]
      }
    }

    destImg.updatePixels()
  }

  __flowLine(srcImg, obj) {
    let destPixels, tempY
    let r, g, b, a
    let index

    destPixels = new Uint8ClampedArray(srcImg.pixels)
    obj.t1 %= srcImg.height
    obj.t1 += obj.speed

    tempY = window.floor(window.noise(obj.t1) * srcImg.height)
    // tempY = floor(obj.t1)

    for (let y = 0; y < srcImg.height; y++) {
      if (tempY === y) {
        for (let x = 0; x < srcImg.width; x++) {
          index = (y * srcImg.width + x) * this.channelLen
          r = index
          g = index + 1
          b = index + 2
          a = index + 3
          destPixels[r] = srcImg.pixels[r] + obj.randX
          destPixels[g] = srcImg.pixels[g] + obj.randX
          destPixels[b] = srcImg.pixels[b] + obj.randX
          destPixels[a] = srcImg.pixels[a]
        }
      }
    }

    return destPixels
  }

  __shiftLine(srcImg) {
    let offsetX
    let rangeMin, rangeMax
    let destPixels
    let rangeH
    let r, g, b, a
    let r2, g2, b2
    let index

    destPixels = new Uint8ClampedArray(srcImg.pixels)
    rangeH = srcImg.height
    rangeMin = window.floor(window.random(0, rangeH))
    rangeMax = rangeMin + window.floor(window.random(1, rangeH - rangeMin))

    // offsetX = this.channelLen * window.floor(window.random(-40, 40))
    offsetX = this.channelLen * window.floor(window.random(-80, 80))

    for (let y = 0; y < srcImg.height; y++) {
      if (y > rangeMin && y < rangeMax) {
        for (let x = 0; x < srcImg.width; x++) {
          index = (y * srcImg.width + x) * this.channelLen
          r = index
          g = index + 1
          b = index + 2
          a = index + 3
          r2 = r + offsetX
          g2 = g + offsetX
          b2 = b + offsetX
          destPixels[r] = srcImg.pixels[r2]
          destPixels[g] = srcImg.pixels[g2]
          destPixels[b] = srcImg.pixels[b2]
          destPixels[a] = srcImg.pixels[a]
        }
      }
    }

    return destPixels
  }

  __shiftRGB(srcImg) {
    let randR, randG, randB
    let destPixels
    let range

    range = 16
    destPixels = new Uint8ClampedArray(srcImg.pixels)
    randR =
      (window.floor(window.random(-range, range)) * srcImg.width +
        window.floor(window.random(-range, range))) *
      this.channelLen
    randG =
      (window.floor(window.random(-range, range)) * srcImg.width +
        window.floor(window.random(-range, range))) *
      this.channelLen
    randB =
      (window.floor(window.random(-range, range)) * srcImg.width +
        window.floor(window.random(-range, range))) *
      this.channelLen

    for (let y = 0; y < srcImg.height; y++) {
      for (let x = 0; x < srcImg.width; x++) {
        let r, g, b, a
        let r2, g2, b2
        let index

        index = (y * srcImg.width + x) * this.channelLen
        r = index
        g = index + 1
        b = index + 2
        a = index + 3
        r2 = (r + randR) % srcImg.pixels.length
        g2 = (g + randG) % srcImg.pixels.length
        b2 = (b + randB) % srcImg.pixels.length
        destPixels[r] = srcImg.pixels[r2]
        destPixels[g] = srcImg.pixels[g2]
        destPixels[b] = srcImg.pixels[b2]
        destPixels[a] = srcImg.pixels[a]
      }
    }

    return destPixels
  }

  __getRandomRectImg(srcImg) {
    let startX
    let startY
    let rectW
    let rectH
    let destImg
    startX = window.floor(window.random(0, srcImg.width - 30))
    startY = window.floor(window.random(0, srcImg.height - 50))
    rectW = window.floor(window.random(30, srcImg.width - startX))
    rectH = window.floor(window.random(1, 50))
    destImg = srcImg.get(startX, startY, rectW, rectH)
    destImg.loadPixels()
    return destImg
  }

  __show() {
    if (!__initialized) {
      return
    }

    // restore the original state
    this.__replaceData(this.imgOrigin, this.copyData)

    // sometimes pass without effect processing
    let n = window.floor(window.random(100))
    if (n > 90 && this.throughFlag) {
      this.throughFlag = false
      setTimeout(() => {
        this.throughFlag = true
      }, window.floor(window.random(20, 200)))
    }

    if (!this.throughFlag) {
      window.push()
      window.translate(
        (window.width - this.imgOrigin.width) / 2,
        (window.height - this.imgOrigin.height) / 2
      )

      window.tint(255, 0) // nasconde l'immagine
      window.image(this.imgOrigin, 0, 0)
      window.pop()
      return
    }

    // flow line
    this.flowLineImgs.forEach((v, i, arr) => {
      arr[i].pixels = this.__flowLine(this.imgOrigin, v)
      if (arr[i].pixels) {
        this.__replaceData(this.imgOrigin, arr[i].pixels)
      }
    })

    // shift line
    this.shiftLineImgs.forEach((v, i, arr) => {
      if (window.floor(window.random(100)) > 50) {
        arr[i] = this.__shiftLine(this.imgOrigin)
        this.__replaceData(this.imgOrigin, arr[i])
      } else {
        if (arr[i]) {
          this.__replaceData(this.imgOrigin, arr[i])
        }
      }
    })

    // shift rgb
    this.shiftRGBs.forEach((v, i, arr) => {
      if (window.floor(window.random(100)) > 65) {
        arr[i] = this.__shiftRGB(this.imgOrigin)
        this.__replaceData(this.imgOrigin, arr[i])
      }
    })

    window.push()
    window.translate(
      (window.width - this.imgOrigin.width) / 2,
      (window.height - this.imgOrigin.height) / 2
    )
    window.image(this.imgOrigin, 0, 0)
    window.pop()

    // scat image
    this.scatImgs.forEach(obj => {
      window.push()
      window.translate(
        (window.width - this.imgOrigin.width) / 2,
        (window.height - this.imgOrigin.height) / 2
      )

      if (window.floor(window.random(100)) > 80) {
        obj.x = window.floor(
          window.random(-this.imgOrigin.width * 0.3, this.imgOrigin.width * 0.7)
        )
        obj.y = window.floor(
          window.random(-this.imgOrigin.height * 0.1, this.imgOrigin.height)
        )
        obj.img = this.__getRandomRectImg(this.imgOrigin)
      }
      if (obj.img) {
        window.image(obj.img, obj.x, obj.y)
      }
      window.pop()
    })
  }

  // init p5 window when ready
  __onWindowSetup = () => {
    window.background(0)
    this.canvas = window.createCanvas(10, 10)
    this.canvas.id(ID)
    this.canvas.position(-1000, -1000)

    document.querySelector(`#${ID}`).style.zIndex = 999999
  }

  __draw = () => {
    window.clear()

    if (__initialized) {
      this.__show()
      window.tint(255, 255)
    }
  }
}
