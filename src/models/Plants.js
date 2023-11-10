import { gameStatus } from '../../main'

import PlantingSound from '/src/music/planting_sound.mp3'

import { deltaTime } from '/main'

class Plant {
  plantingSound = new Audio(PlantingSound)
  seedPacket = null
  htmlElement = null
  image = ''
  name = ''
  isReadyToActive = false
  health = 100

  constructor(htmlElement, image) {
    this.plantingSound.volume = 0.1
    this.htmlElement = htmlElement
    this.image = image
    this.htmlElement.classList.add('planted')
    this.plantingSound.play()

    setTimeout(() => {
      this.isReadyToActive = true
    }, 1000)
  }

  activate() {}
}

export class Peashooter extends Plant {
  static name = 'Горохострел'
  health = 125

  bulletSpeed = 50

  constructor(htmlElement, seedPacket) {
    super(htmlElement, seedPacket)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
  }

  shoot() {
    if (this.isReadyToActive) {
      this.htmlElement.innerHTML += /*html*/ `<div class="bullet" posX="0"></div>`
      this.isReadyToActive = false
      setTimeout(() => {
        this.isReadyToActive = true
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

  activate(lane) {
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
  health = 150

  constructor(htmlElement, seedPacket) {
    super(htmlElement, seedPacket)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
  }

  activate() {
    if (this.isReadyToActive) {
      this.htmlElement.innerHTML = /*html*/ `<div class='sun_from_sunflower sun' style="pos"></div>`

      this.htmlElement.children[0].addEventListener('click', () => {
        gameStatus.suns += 25
        this.htmlElement.children[0].parentElement.removeChild(this.htmlElement.children[0])
        console.log('sun!')
      })

      this.isReadyToActive = false
      setTimeout(() => {
        this.isReadyToActive = true
      }, 25000)
    }
  }
}
