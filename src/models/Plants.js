import { Sun } from '/src/models/Sun'

import { setGameTimeout } from '/src/models/GameTimeout'
import { map, deltaTime, sunsArray } from '/main'

import { soundFX } from '/src/assets/js/Music'

const plantSounds = [soundFX.object.sounds.plantingSound1, soundFX.object.sounds.plantingSound2]

class Plant {
  plantingSound = null
  seedPacket = null
  htmlElement = null
  image = ''
  name = ''
  isReadyToActive = false
  health = 300
  attackInterval = 1500
  damage = 20
  allTimeouts = new Array()

  constructor(htmlElement, image) {
    this.plantingSound = plantSounds[Math.floor(Math.random() * plantSounds.length)]
    this.htmlElement = htmlElement
    this.image = image
    this.plantingSound.play()
  }

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

import PeashooterBulletImg from '/src/images/plants/peashooter_bullet.png'
export class Peashooter extends Plant {
  static name = 'Горохострел'

  bulletImage = PeashooterBulletImg

  bulletSpeed = 50

  constructor(htmlElement, image) {
    super(htmlElement, image)

    this.attackInterval = 1425

    this.htmlElement.style.backgroundImage = `url("${this.image}")`

    this.allTimeouts.push(
      setGameTimeout(() => {
        this.isReadyToActive = true
      }, 1000)
    )
  }

  createBullet() {
    const newBulletHtml = document.createElement('div')
    newBulletHtml.classList.add('bullet')
    newBulletHtml.setAttribute('damage', this.damage)
    newBulletHtml.setAttribute('posX', 0)
    newBulletHtml.style.backgroundImage = `url(${this.bulletImage})`

    if (this.effectName) {
      newBulletHtml.setAttribute('effect', this.effectName)
    }

    this.htmlElement.appendChild(newBulletHtml)
  }

  shoot() {
    this.createBullet()

    this.isReadyToActive = false

    this.allTimeouts.push(
      setGameTimeout(
        () => {
          this.isReadyToActive = true
        },
        this.attackInterval,
        true
      )
    )
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
    if (!this.htmlElement) return
    if (
      lane.zombiesArray.length > 0 &&
      lane.zombiesArray.some(zombie => {
        const centerOfZombie =
          zombie.htmlElement.getBoundingClientRect().x +
          zombie.htmlElement.getBoundingClientRect().width / 3
        const plantPosX = this.htmlElement.getBoundingClientRect().x
        return centerOfZombie > plantPosX
      }) &&
      this.isReadyToActive
    ) {
      this.shoot()
    }
    this.updateBullet()
  }
}

import SnowPeaBulletImg from '/src/images/plants/snow_pea_bullet.png'
export class SnowPea extends Peashooter {
  static name = 'Морозный горох'
  bulletImage = SnowPeaBulletImg
  effectName = 'freeze'
  sparklesSound = soundFX.object.sounds.snowPeaSparklesSound

  constructor(htmlElement, image) {
    super(htmlElement, image)
  }

  shoot() {
    super.shoot()
    this.sparklesSound.play()
  }
}

export class Sunflower extends Plant {
  static name = 'Подсолнух'
  sunCharge = 25

  constructor(htmlElement, image) {
    super(htmlElement, image)

    this.attackInterval = 24250

    this.htmlElement.style.backgroundImage = `url("${this.image}")`

    this.allTimeouts.push(
      setGameTimeout(() => {
        this.isReadyToActive = true
      }, 5000)
    )
  }

  update() {
    if (!this.htmlElement) return
    if (this.isReadyToActive) {
      const newElement = document.createElement('div')
      newElement.classList.add('sun_from_sunflower', 'sun')

      let offsetX =
        (document.documentElement.getBoundingClientRect().width -
          document.querySelector('.main__wrapper').getBoundingClientRect().width) /
        2

      if (offsetX <= 0) {
        offsetX = 0
      }

      const posX =
        ((this.htmlElement.getBoundingClientRect().x +
          this.htmlElement.getBoundingClientRect().width -
          offsetX) /
          document.querySelector('.main__wrapper').getBoundingClientRect().width) *
        100

      const posY =
        ((this.htmlElement.getBoundingClientRect().y +
          this.htmlElement.getBoundingClientRect().height / 1.5) /
          document.querySelector('.main__wrapper').getBoundingClientRect().height) *
        100

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
        }, this.attackInterval)
      )
    }
  }
}

export class CherryBomb extends Plant {
  static name = 'Вишневая бомба'

  constructor(htmlElement, image) {
    super(htmlElement, image)
    this.health = Infinity

    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.htmlElement.style.transition = `1s ease-in-out`
    this.htmlElement.style.scale = '1'
    this.isExplode = true

    this.damage = 1800
    this.attackInterval = 1200

    this.cherryExplodeSound = soundFX.object.sounds.cherryExplodeSound

    this.bombCenter = 0
    this.bombRadius = 55
  }

  destroy() {
    super.destroy()
    this.allTimeouts.push(
      setGameTimeout(() => {
        this.bombHtml.parentElement.removeChild(this.bombHtml)
        this.bombHtml = null
        this.allTimeouts.forEach(item => {
          item.clear()
        })
      }, 500)
    )
  }

  explode() {
    this.isExplode = false

    this.bombHtml = document.createElement('div')
    this.bombHtml.classList.add('bomb_explode')
    this.bombHtml.style.width = `${this.bombRadius}vh`
    this.bombHtml.style.height = `${this.bombRadius}vh`

    document.querySelector('.main__wrapper').appendChild(this.bombHtml)
    this.htmlElement.style.backgroundSize = '100%'

    let offsetX =
      (document.documentElement.getBoundingClientRect().width -
        document.querySelector('.main__wrapper').getBoundingClientRect().width) /
      2

    if (offsetX <= 0) {
      offsetX = 0
    }

    const posX =
      ((this.htmlElement.getBoundingClientRect().x -
        this.htmlElement.getBoundingClientRect().width * 1.5 -
        offsetX) /
        document.querySelector('.main__wrapper').getBoundingClientRect().width) *
      100

    const posY =
      ((this.htmlElement.getBoundingClientRect().y -
        this.htmlElement.getBoundingClientRect().height) /
        document.querySelector('.main__wrapper').getBoundingClientRect().height) *
      100

    this.bombHtml.style.left = `${posX}%`
    this.bombHtml.style.top = `${posY}%`

    this.allTimeouts.push(
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
              zombie.htmlElement.style.filter = 'brightness(0)'
              zombie.speedX = 0
              setGameTimeout(
                () => {
                  zombie.health -= this.damage
                },
                1200,
                true
              )
            }
          })
        })

        this.cherryExplodeSound.play()
        this.bombHtml.style.backgroundColor = 'rgb(0, 0, 0, 0.5)'

        this.destroy()
      }, this.attackInterval)
    )
  }

  update() {
    if (!this.htmlElement) return
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
    this.health = 4000
  }

  update() {}
}

export class Repeater extends Peashooter {
  static name = 'Повторитель'
  bulletImage = PeashooterBulletImg

  currentNumberOfBullet = 1

  shoot() {
    this.createBullet()
    this.isReadyToActive = false
    if (this.currentNumberOfBullet >= 2) {
      this.currentNumberOfBullet = 1
      this.allTimeouts.push(
        setGameTimeout(
          () => {
            this.isReadyToActive = true
          },
          this.attackInterval,
          true
        )
      )
    } else {
      this.currentNumberOfBullet++
      this.allTimeouts.push(
        setGameTimeout(
          () => {
            this.isReadyToActive = true
          },
          200,
          true
        )
      )
    }
  }
}
