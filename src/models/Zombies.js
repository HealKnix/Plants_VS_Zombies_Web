import RegularZombieImg from '../images/zombies/regular_zombie.png'

import HitSound1 from '../music/zombies_hit_1.mp3'
import HitSound2 from '../music/zombies_hit_2.mp3'

import ChompSound1 from '../music/zombie_chomp_1.mp3'
import ChompSound2 from '../music/zombie_chomp_2.mp3'

import { deltaTime } from '/main'
import { setGameTimeout } from '/src/models/GameTimeout'

const hitSounds = [HitSound1, HitSound2]
const chompSounds = [ChompSound1, ChompSound2]
const chompSound = []

class Zombie {
  hitSound = []
  isReadyToActive = true
  htmlElement = null
  health = 181
  damage = 100
  maxSpeedX = 3
  speedX = this.maxSpeedX
  eatDelay = 650
  posX = 0
  image = ''

  allTimeouts = new Array()

  effectDuration = 0
  isEffect = false

  constructor(htmlElement) {
    this.htmlElement = htmlElement
    this.htmlElementZombie = document.createElement('img')
    this.htmlElementZombie.setAttribute('width', '85%')
    this.htmlElementZombie.classList.add('zombie_img')
    this.htmlElement.appendChild(this.htmlElementZombie)
  }

  destroy() {
    this.health = 0
    this.htmlElement.parentElement.removeChild(this.htmlElement)
    this.htmlElement = null
    this.allTimeouts.forEach(event => {
      event.clear()
    })
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
      if (plant.htmlElement === null) return
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

          if (bullet.getAttribute('effect')) {
            if (!this.isEffect) {
              this.isEffect = true
              if (bullet.getAttribute('effect') === 'freeze') {
                this.htmlElementZombie.style.filter = 'hue-rotate(180deg)'
                this.speedX = this.maxSpeedX / 2
              }
            }
          }

          this.effectDuration = 0

          this.health -= parseInt(bullet.getAttribute('damage'))
          bullet.parentElement.removeChild(bullet)

          if (this.isEffect) {
            this.htmlElementZombie.style.filter = 'brightness(1.15) hue-rotate(180deg)'
          } else {
            this.htmlElementZombie.style.filter = 'brightness(1.15)'
          }

          this.allTimeouts.push(
            setGameTimeout(
              () => {
                this.htmlElementZombie.style.filter = this.htmlElementZombie.style.filter.replace(
                  'brightness(1.15)',
                  ''
                )
              },
              100,
              true
            )
          )

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
      this.destroy()
      return
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
      lawnMower.active = true
      if (lawnMower.isFirstActive) {
        lawnMower.sound.volume = 0.25
        lawnMower.sound.play()
        lawnMower.isFirstActive = false
      }

      this.destroy()
      return
    }
  }

  checkCollision(plantsArray) {
    let result = false
    const centerPositionOfZombie =
      this.htmlElement.getBoundingClientRect().x +
      this.htmlElement.getBoundingClientRect().width / 2
    plantsArray.forEach(plant => {
      if (plant.htmlElement === null) return
      const leftSideOfPlant = plant.htmlElement.getBoundingClientRect().x
      const rightSideOfPlant =
        plant.htmlElement.getBoundingClientRect().x +
        plant.htmlElement.getBoundingClientRect().width
      if (centerPositionOfZombie >= leftSideOfPlant && centerPositionOfZombie <= rightSideOfPlant) {
        result = true
        if (this.isReadyToActive) {
          this.eat(plant)
          this.isReadyToActive = false

          this.allTimeouts.push(
            setGameTimeout(
              () => {
                this.isReadyToActive = true
              },
              this.eatDelay,
              true
            )
          )
        }
      }
    })

    return result
  }

  update(lane) {
    if (!this.htmlElement) return
    if (!this.checkCollision(lane.plantsArray)) {
      this.walk()
    }
    if (this.isEffect) {
      this.effectDuration += deltaTime * 1000
      if (this.effectDuration >= 3000) {
        this.htmlElementZombie.style.filter = 'none'
        this.speedX = this.maxSpeedX
        this.isEffect = false
      }
    }
    this.checkHit(lane.plantsArray, lane.lawnMower)
  }
}

export class RegularZombie extends Zombie {
  constructor(htmlElement) {
    super(htmlElement)
    this.image = RegularZombieImg
    this.htmlElementZombie.setAttribute('src', this.image)
    this.htmlElement.classList.add('zombie')
  }
}

import ConeHat from '/src/images/other/cone_hat_for_zombie.png'
export class ConeheadZombie extends Zombie {
  constructor(htmlElement) {
    super(htmlElement)
    this.image = RegularZombieImg
    this.imageUpdated = false
    this.health = 551
    this.htmlElementZombie.setAttribute('src', this.image)
    this.htmlElement.classList.add('zombie')

    this.htmlElementHat = document.createElement('img')
    this.htmlElementHat.setAttribute('src', ConeHat)
    this.htmlElementHat.setAttribute('width', '55%')
    this.htmlElementHat.classList.add('hat')

    this.htmlElement.appendChild(this.htmlElementHat)
  }

  update(lane) {
    super.update(lane)
    if (this.health > 0) {
      this.updateImage()
    }
  }

  updateImage() {
    if (this.health <= 181 && !this.imageUpdated) {
      this.htmlElementHat.classList.add('armor_broken')
      this.imageUpdated = true
      this.allTimeouts.push(
        setGameTimeout(
          () => {
            this.htmlElementHat.parentElement.removeChild(this.htmlElementHat)
          },
          1000,
          true
        )
      )
    }
  }
}
