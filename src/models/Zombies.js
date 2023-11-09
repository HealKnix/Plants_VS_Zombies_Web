import RegularZombieImg from '../images/zombies/regular_zombie.png'

import HitSound1 from '../music/zombies_hit_1.mp3'
import HitSound2 from '../music/zombies_hit_2.mp3'

const hitSounds = [HitSound1, HitSound2]

class Zombie {
  hitSound = new Audio()
  htmlElement = null
  health = 100
  speedX = 0.015
  posX = 0

  constructor(htmlElement) {
    this.htmlElement = htmlElement
    this.fullHealth = this.health
    this.hitSound.volume = 0.05
  }

  eat() {}
  walk() {
    this.htmlElement.style.transform = `translate3d(${this.posX}vh, 0, 0)`
    this.posX -= this.speedX
  }
  checkHit(plantsArray) {
    let isHit = false
    plantsArray.forEach(plant => {
      ;[...plant.htmlElement.children].forEach(bullet => {
        if (
          bullet.getBoundingClientRect().x - bullet.getBoundingClientRect().width >=
            this.htmlElement.getBoundingClientRect().x &&
          bullet.getBoundingClientRect().x - bullet.getBoundingClientRect().width <=
            this.htmlElement.getBoundingClientRect().x +
              this.htmlElement.getBoundingClientRect().width
        ) {
          this.hitSound.src = hitSounds[Math.floor(Math.random() * 2)]
          this.hitSound.play()
          this.health -= 25
          this.htmlElement.children[0].style.width = `${(this.health / this.fullHealth) * 100}%`
          bullet.parentElement.removeChild(bullet)
          isHit = true
          return
        }
      })
      if (isHit) return
    })

    if (this.health <= 0) {
      this.health = 0
      this.htmlElement.parentElement.removeChild(this.htmlElement)
    }
  }
}

export class RegularZombie extends Zombie {
  image = RegularZombieImg
  health = 250
  fullHealth = this.health

  constructor(htmlElement) {
    super(htmlElement)
    this.htmlElement.style.backgroundImage = `url("${this.image}")`
  }
}
