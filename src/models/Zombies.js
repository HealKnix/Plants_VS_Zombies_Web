import RegularZombieImg from '../images/zombies/regular_zombie.png'

import HitSound1 from '../music/zombies_hit_1.mp3'
import HitSound2 from '../music/zombies_hit_2.mp3'

import { deltaTime } from '/main'

const hitSounds = [HitSound1, HitSound2]

class Zombie {
  hitSound = []
  htmlElement = null
  damage = 20
  health = 100
  speedX = 3
  posX = 0

  constructor(htmlElement) {
    this.htmlElement = htmlElement
    this.fullHealth = this.health
  }

  eat(plant) {
    plant.health -= this.damage
  }
  walk() {
    this.htmlElement.style.transform = `translate3d(${this.posX}vh, 0, 0)`
    this.posX -= this.speedX * deltaTime
  }
  checkHit(plantsArray) {
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
          this.hitSound[this.hitSound.length - 1].volume = 0.05
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
        document.documentElement.getBoundingClientRect().height * 0.2
    ) {
      this.health = 0
      this.htmlElement.parentElement.removeChild(this.htmlElement)
    }
  }

  checkCollision(plantsArray) {
    const centerPositionOfZombie =
      this.htmlElement.getBoundingClientRect().x +
      this.htmlElement.getBoundingClientRect().width / 2
    plantsArray.forEach(plant => {
      const leftSideOfPlant = plant.htmlElement.getBoundingClientRect().x
      const rightSideOfPlant =
        plant.htmlElement.getBoundingClientRect().x +
        plant.htmlElement.getBoundingClientRect().width
      if (centerPositionOfZombie >= leftSideOfPlant && centerPositionOfZombie <= rightSideOfPlant) {
        this.eat(plant)
      }
    })
  }
}

export class RegularZombie extends Zombie {
  image = RegularZombieImg
  health = 200
  damage = 20
  fullHealth = this.health

  constructor(htmlElement) {
    super(htmlElement)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
  }
}
