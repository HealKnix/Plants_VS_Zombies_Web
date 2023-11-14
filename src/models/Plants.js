import { Sun } from '/src/models/Sun'

import SunPickupSound from '/src/music/sun_pickup.mp3'
const pickupSound = new Audio(SunPickupSound)
pickupSound.volume = 0.25
import PlantingSound1 from '/src/music/planting_sound_1.mp3'
import PlantingSound2 from '/src/music/planting_sound_2.mp3'

import CherryExplodeSound from '/src/music/cherry_explode.mp3'

import { setGameTimeout } from '/src/models/GameTimeout'
import { map, deltaTime, sunsArray } from '/main'

const plantSounds = [PlantingSound1, PlantingSound2]

class Plant {
  plantingSound = new Audio()
  seedPacket = null
  htmlElement = null
  image = ''
  name = ''
  isReadyToActive = false
  health = 100
  allTimeouts = new Array()

  constructor(htmlElement, image) {
    this.plantingSound.src = plantSounds[Math.floor(Math.random() * 2)]
    this.plantingSound.volume = 0.1
    this.htmlElement = htmlElement
    this.image = image
    this.plantingSound.play()
  }

  update(lane) {}

  destroy() {
    this.allTimeouts.forEach(event => {
      event.clear()
    })
    this.health = 0
    if (!this.htmlElement) return
    this.htmlElement.parentElement.classList.remove('planted')
    this.htmlElement.parentElement.removeChild(this.htmlElement)
    this.htmlElement = null
  }
}

export class Peashooter extends Plant {
  static name = 'Горохострел'
  bulletDamage = 20

  bulletSpeed = 50

  constructor(htmlElement, image) {
    super(htmlElement, image)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.health = 120

    this.allTimeouts.push(
      setGameTimeout(() => {
        this.isReadyToActive = true
      }, 1000)
    )
  }

  shoot() {
    if (this.isReadyToActive) {
      this.htmlElement.innerHTML += /*html*/ `<div class="bullet" damage="${this.bulletDamage}" posX="0"></div>`
      this.isReadyToActive = false
      this.allTimeouts.push(
        setGameTimeout(() => {
          this.isReadyToActive = true
        }, 1500)
      )
    }
  }

  updateBullet() {
    let bullets = this.htmlElement.children

    if (bullets.length === 0) return

    for (let i = 0; i < bullets.length; i++) {
      let bulletsX = parseFloat(bullets[i].getAttribute('posX'))

      bullets[i].style.transform = `translate3d(${bulletsX}vh, 0, 0)`
      if (
        bullets[i].getBoundingClientRect().x >
        document.querySelector('.main__wrapper').clientWidth +
          document.querySelector('.main__wrapper').clientWidth / 3
      ) {
        bullets[i].parentElement.removeChild(bullets[i])
        return
      }

      bulletsX += this.bulletSpeed * deltaTime
      bullets[i].setAttribute('posX', bulletsX)
    }
  }

  update(lane) {
    if (
      lane.zombiesArray.length > 0 &&
      lane.zombiesArray.some(zombie => {
        const centerOfZombie =
          zombie.htmlElement.getBoundingClientRect().x +
          zombie.htmlElement.getBoundingClientRect().width / 3
        const plantPosX = this.htmlElement.getBoundingClientRect().x
        return centerOfZombie > plantPosX
      })
    ) {
      this.shoot()
    }
    this.updateBullet()
  }
}

export class Sunflower extends Plant {
  static name = 'Подсолнух'
  sunCharge = 25

  constructor(htmlElement, image) {
    super(htmlElement, image)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.health = 120

    this.allTimeouts.push(
      setGameTimeout(() => {
        this.isReadyToActive = true
      }, 5000)
    )
  }

  update() {
    if (this.isReadyToActive) {
      const newElement = document.createElement('div')
      newElement.classList.add('sun_from_sunflower', 'sun')

      const posX =
        (this.htmlElement.getBoundingClientRect().x * 90) /
        document.querySelector('.main__wrapper').getBoundingClientRect().height

      const posY =
        (this.htmlElement.getBoundingClientRect().y * 220) /
        (document.querySelector('.main__wrapper').getBoundingClientRect().height * 2)

      this.allTimeouts.push(
        setGameTimeout(() => {
          sunsArray.push(new Sun(newElement, posX, posY, this.sunCharge))
        }, 1000)
      )

      this.htmlElement.style.filter = 'brightness(1.4)'
      this.allTimeouts.push(
        setGameTimeout(() => {
          this.htmlElement.style.filter = 'none'
          document.querySelector('.main__wrapper').appendChild(newElement)
        }, 1000)
      )

      this.isReadyToActive = false
      this.allTimeouts.push(
        setGameTimeout(() => {
          this.isReadyToActive = true
        }, 24000)
      )
    }
  }
}

export class CherryBomb extends Plant {
  static name = 'Вишневая бомба'

  constructor(htmlElement, image) {
    super(htmlElement, image)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.htmlElement.style.transition = `1s ease-in-out`
    this.htmlElement.style.scale = '1'
    this.health = 100
    this.isExplode = true

    this.explodeDamage = 1800

    this.cherryExplodeSound = new Audio(CherryExplodeSound)
    this.cherryExplodeSound.volume = 0.5

    this.bombCenter = 0
    this.bombRadius = 55
    this.bombHtml = document.createElement('div')
    this.bombHtml.classList.add('bomb_explode')
    this.bombHtml.style.width = `${this.bombRadius}vh`
    this.bombHtml.style.height = `${this.bombRadius}vh`
  }

  explode() {
    document.querySelector('.main__wrapper').appendChild(this.bombHtml)
    this.isExplode = false
    this.htmlElement.style.backgroundSize = '100%'

    setGameTimeout(() => {
      map.forEach(lane => {
        lane.zombiesArray.forEach(zombie => {
          const distanceX =
            zombie.htmlElement.getBoundingClientRect().x +
            zombie.htmlElement.getBoundingClientRect().width / 2 -
            (this.bombHtml.getBoundingClientRect().x +
              this.bombHtml.getBoundingClientRect().width / 2)
          const distanceY =
            zombie.htmlElement.getBoundingClientRect().y +
            zombie.htmlElement.getBoundingClientRect().height / 2 -
            (this.bombHtml.getBoundingClientRect().y +
              this.bombHtml.getBoundingClientRect().height / 2)
          const length = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
          if (length <= this.bombHtml.getBoundingClientRect().width / 2) {
            zombie.health -= this.explodeDamage
          }
        })
      })
      this.cherryExplodeSound.play()
      this.destroy()
      this.bombHtml.style.backgroundColor = 'rgb(0, 0, 0, 0.5)'
      setGameTimeout(() => {
        this.bombHtml.parentElement.removeChild(this.bombHtml)
      }, 500)
    }, 1000)
  }

  update(lane) {
    if (!this.htmlElement) return
    this.bombCenter = {
      x:
        this.htmlElement.getBoundingClientRect().x -
        this.htmlElement.getBoundingClientRect().width / 0.75,
      y:
        this.htmlElement.getBoundingClientRect().y - this.htmlElement.getBoundingClientRect().height
    }
    this.bombHtml.style.left = `calc(${this.bombCenter.x}px - 35.5vh)`
    this.bombHtml.style.top = `${this.bombCenter.y}px`
    if (this.isExplode) {
      this.explode()
    }
  }
}

export class WallNut extends Plant {
  static name = 'Стеноорех'

  constructor(htmlElement, image) {
    super(htmlElement, image)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.health = 2120
  }
}

export class Repeater extends Peashooter {
  static name = 'Повторитель'

  currentNumberOfBullet = 1

  shoot() {
    if (this.isReadyToActive) {
      this.isReadyToActive = false
      this.htmlElement.innerHTML += /*html*/ `
        <div class="bullet" damage="${this.bulletDamage}" posX="0"></div>
      `
      if (this.currentNumberOfBullet >= 2) {
        this.currentNumberOfBullet = 1
        this.allTimeouts.push(
          setGameTimeout(() => {
            this.isReadyToActive = true
          }, 1000)
        )
      } else {
        this.currentNumberOfBullet++
        this.allTimeouts.push(
          setGameTimeout(() => {
            this.isReadyToActive = true
          }, 200)
        )
      }
    }
  }
}
