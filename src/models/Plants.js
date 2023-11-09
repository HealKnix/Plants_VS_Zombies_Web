import PeashooterImg from '../images/plants/peashooter.png'
import SunflowerImg from '../images/plants/sunflower.png'

import PlantingSound from '/src/music/planting_sound.mp3'

import { deltaTime } from '/main'

class Plant {
  plantingSound = new Audio(PlantingSound)
  htmlElement = null
  image = ''
  isReadyToShoot = true
  isReadyToActive = true
  health = 100
  cost = 0

  constructor(htmlElement) {
    this.plantingSound.volume = 0.1
    this.htmlElement = htmlElement
    this.htmlElement.classList.add('planted')
    this.plantingSound.play()
  }

  shoot() {}

  active() {}
}

export class Peashooter extends Plant {
  image = PeashooterImg
  health = 125
  cost = 100

  bulletSpeed = 85

  constructor(htmlElement) {
    super(htmlElement)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
  }

  shoot() {
    if (this.isReadyToShoot) {
      this.htmlElement.innerHTML += /*html*/ `<div class="bullet" posX="0"></div>`
      this.isReadyToShoot = false
      setTimeout(() => {
        this.isReadyToShoot = true
      }, 2000)
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
        document.getElementsByTagName('main')[0].clientWidth - 50
      ) {
        bullets[i].parentElement.removeChild(bullets[i])
        return
      }

      bulletsX += this.bulletSpeed * deltaTime
      bullets[i].setAttribute('posX', bulletsX)
    }
  }
}

export class Sunflower extends Plant {
  image = SunflowerImg
  health = 150
  cost = 50

  constructor(htmlElement) {
    super(htmlElement)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
  }

  active() {
    if (this.isReadyToActive) {
      this.htmlElement.innerHTML = /*html*/ `<div class='sun_from_sunflower'></div>`

      this.isReadyToActive = false
      setTimeout(() => {
        this.isReadyToActive = true
      }, 25000)
    }
  }

  updateActive() {
    const suns = this.htmlElement.children

    suns
  }
}

export function getPlantsImages() {
  return { peashooter: PeashooterImg, sunflower: SunflowerImg }
}
