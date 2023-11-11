import RegularZombieImg from '../images/zombies/regular_zombie.png'

import HitSound1 from '../music/zombies_hit_1.mp3'
import HitSound2 from '../music/zombies_hit_2.mp3'

import ChompSound1 from '../music/zombie_chomp_1.mp3'
import ChompSound2 from '../music/zombie_chomp_2.mp3'

import { deltaTime } from '/main'

const hitSounds = [HitSound1, HitSound2]
const chompSounds = [ChompSound1, ChompSound2]
const chompSound = []

class Zombie {
  hitSound = []
  isReadyToActive = true
  htmlElement = null
  health = 200
  damage = 20
  speedX = 3
  eatDelay = 500
  posX = 0

  constructor(htmlElement) {
    this.htmlElement = htmlElement
  }

  eat(plant) {
    plant.health -= this.damage
    if (plant.health <= 0) {
      plant.destroy()
    }
    chompSound.push(new Audio(chompSounds[Math.floor(Math.random() * 2)]))
    chompSound[chompSound.length - 1].volume = 0.075 / chompSound.length
    chompSound[chompSound.length - 1].play()
    for (let i = 0; i < chompSound.length; i++) {
      chompSound[i].addEventListener('ended', () => {
        chompSound.splice(i, 1)
      })
    }
  }

  walk() {
    this.htmlElement.style.transform = `translate3d(${this.posX}vh, 0, 0)`
    this.posX -= this.speedX * deltaTime
  }

  checkHit(plantsArray, lawnMower) {
    let isHit = false
    plantsArray.forEach(plant => {
      ;[...plant.htmlElement.children].forEach(bullet => {
        if (!bullet.classList.contains('bullet')) return
        if (
          bullet.getBoundingClientRect().x - bullet.getBoundingClientRect().width * 1.75 >=
            this.htmlElement.getBoundingClientRect().x &&
          bullet.getBoundingClientRect().x <=
            this.htmlElement.getBoundingClientRect().x +
              this.htmlElement.getBoundingClientRect().width
        ) {
          this.hitSound.push(new Audio(hitSounds[Math.floor(Math.random() * 2)]))
          this.hitSound[this.hitSound.length - 1].volume = 0.1
          this.hitSound[this.hitSound.length - 1].play()
          for (let i = 0; i < this.hitSound.length; i++) {
            this.hitSound[i].addEventListener('ended', () => {
              this.hitSound.splice(i, 1)
            })
          }
          this.health -= parseInt(bullet.getAttribute('damage'))
          bullet.parentElement.removeChild(bullet)
          isHit = true
          return
        }
      })
      if (isHit) return
    })

    if (
      this.health <= 0 ||
      this.htmlElement.getBoundingClientRect().x <=
        document.querySelector('.main__wrapper').getBoundingClientRect().x -
          this.htmlElement.getBoundingClientRect().width
    ) {
      this.health = 0
      this.htmlElement.parentElement.removeChild(this.htmlElement)
    }

    if (lawnMower.htmlElement === null) return
    if (
      this.htmlElement.getBoundingClientRect().x <=
        lawnMower.htmlElement.getBoundingClientRect().x +
          lawnMower.htmlElement.getBoundingClientRect().width &&
      this.htmlElement.getBoundingClientRect().x +
        lawnMower.htmlElement.getBoundingClientRect().width >=
        lawnMower.htmlElement.getBoundingClientRect().x
    ) {
      this.health = 0
      this.htmlElement.parentElement.removeChild(this.htmlElement)
      lawnMower.active = true
    }
  }

  checkCollision(plantsArray) {
    let result = false
    const centerPositionOfZombie =
      this.htmlElement.getBoundingClientRect().x +
      this.htmlElement.getBoundingClientRect().width / 2
    plantsArray.forEach(plant => {
      const leftSideOfPlant = plant.htmlElement.getBoundingClientRect().x
      const rightSideOfPlant =
        plant.htmlElement.getBoundingClientRect().x +
        plant.htmlElement.getBoundingClientRect().width
      if (centerPositionOfZombie >= leftSideOfPlant && centerPositionOfZombie <= rightSideOfPlant) {
        result = true
        if (this.isReadyToActive) {
          this.eat(plant)
          this.isReadyToActive = false

          setTimeout(() => {
            this.isReadyToActive = true
          }, this.eatDelay)
        }
      }
    })

    return result
  }

  update(lane) {
    if (!this.checkCollision(lane.plantsArray)) {
      this.walk()
    }
    this.checkHit(lane.plantsArray, lane.lawnMower)
  }
}

export class RegularZombie extends Zombie {
  constructor(htmlElement) {
    super(htmlElement)
    this.image = RegularZombieImg
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
    this.eatDelay = 650
    this.health = 200
  }
}
