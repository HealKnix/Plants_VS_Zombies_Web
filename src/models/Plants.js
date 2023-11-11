import SunPickupSound from '/src/music/sun_pickup.mp3'
import PlantingSound1 from '/src/music/planting_sound_1.mp3'
import PlantingSound2 from '/src/music/planting_sound_2.mp3'

import { gameStatus } from '../../main'
import { deltaTime } from '/main'

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
      clearTimeout(event)
    })
    this.health = 0
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
      setTimeout(() => {
        this.isReadyToActive = true
      }, 1000)
    )
  }

  shoot() {
    if (this.isReadyToActive) {
      this.htmlElement.innerHTML += /*html*/ `<div class="bullet" damage="${this.bulletDamage}" posX="0"></div>`
      this.isReadyToActive = false
      this.allTimeouts.push(
        setTimeout(() => {
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
  pickupSound = new Audio(SunPickupSound)
  static name = 'Подсолнух'

  constructor(htmlElement, image) {
    super(htmlElement, image)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.pickupSound.volume = 0.25
    this.health = 120

    this.allTimeouts.push(
      setTimeout(() => {
        this.isReadyToActive = true
      }, 5000)
    )
  }

  update() {
    if (this.isReadyToActive) {
      const goal = document.querySelector('.seed_bar__suns_present__sun')

      const newElement = document.createElement('div')
      newElement.classList.add('sun_from_sunflower', 'sun')
      newElement.style.position = 'absolute'
      newElement.style.left = `${
        this.htmlElement.getBoundingClientRect().x -
        document.querySelector('.main__wrapper').getBoundingClientRect().x +
        this.htmlElement.getBoundingClientRect().width
      }px`
      newElement.style.top = `${
        this.htmlElement.getBoundingClientRect().y -
        document.querySelector('.main__wrapper').getBoundingClientRect().y +
        this.htmlElement.getBoundingClientRect().height / 1.25
      }px`

      const timeoutToRemoveSun = setTimeout(() => {
        newElement.parentElement.removeChild(newElement)
      }, 8000)

      this.allTimeouts.push(timeoutToRemoveSun)

      newElement.addEventListener('click', () => {
        gameStatus.suns += 25
        this.pickupSound.play()
        newElement.style.position = 'absolute'
        newElement.style.transition = '0.5s ease-in-out'
        newElement.style.left = `calc(${
          goal.getBoundingClientRect().x -
          document.querySelector('.main__wrapper').getBoundingClientRect().x
        }px + 4.5vh)`
        newElement.style.top = `calc(${
          goal.getBoundingClientRect().y -
          document.querySelector('.main__wrapper').getBoundingClientRect().y
        }px + 4.5vh)`
        newElement.style.opacity = `0.2`
        newElement.style.pointerEvents = 'none'
        this.allTimeouts.push(
          setTimeout(() => {
            newElement.parentElement.removeChild(newElement)
            clearTimeout(timeoutToRemoveSun)
          }, 500)
        )
      })

      this.htmlElement.style.filter = 'brightness(1.4)'
      this.allTimeouts.push(
        setTimeout(() => {
          this.htmlElement.style.filter = 'none'
          document.querySelector('.main__wrapper').appendChild(newElement)
        }, 1000)
      )

      this.isReadyToActive = false
      this.allTimeouts.push(
        setTimeout(() => {
          this.isReadyToActive = true
        }, 24000)
      )
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
