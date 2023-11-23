import RegularZombieImg from '../images/zombies/regular_zombie.png'
import CoinSilverGif from '../images/other/coin_silver.gif'

import { deltaTime } from '/main'
import { setGameTimeout } from '/src/models/GameTimeout'
import { dropRandomJewel } from './Jewels'
import { soundFX } from '/src/assets/js/Music'

const hitSounds = [soundFX.object.sounds.hitSound1, soundFX.object.sounds.hitSound2]
const chompSounds = [soundFX.object.sounds.chompSound1, soundFX.object.sounds.chompSound2]

class Zombie {
  hitSound = new Array() // Массив звуков попадания

  isReadyToActive = true // Готовность что-либо сделать

  htmlElement = null

  health = 181 // Здоровье
  damage = 100 // Урон
  maxSpeedX = 3 // Макс скорость передвижения
  speedX = this.maxSpeedX // Текущая скорость передвижения

  eatDelay = 650 // Задержка между укусами
  offsetPosX = 0 // Смещение Зомби по X

  image = '' // Картинка Зомби

  allTimeouts = new Array() // Пул таймаутов

  effectDuration = 0 // Продолжительность эффекта
  isEffect = false // Есть ли эффект

  constructor(htmlElement) {
    this.htmlElement = htmlElement
    this.htmlElementZombie = document.createElement('img')
    this.htmlElementZombie.setAttribute('width', '85%')
    this.htmlElementZombie.classList.add('zombie_img')
    this.htmlElement.appendChild(this.htmlElementZombie)
  }

  getScreenPos() {
    let offsetX =
      (document.documentElement.getBoundingClientRect().width -
        document.querySelector('.main__wrapper').getBoundingClientRect().width) /
      2

    if (offsetX <= 0) {
      offsetX = 0
    }

    return {
      x:
        ((this.htmlElement.getBoundingClientRect().x - offsetX) /
          document.querySelector('.main__wrapper').getBoundingClientRect().width) *
        100,
      y:
        (this.htmlElement.getBoundingClientRect().y /
          document.querySelector('.main__wrapper').getBoundingClientRect().height) *
        100
    }
  }

  dropCoin() {
    const newCoinHtml = document.createElement('img')
    newCoinHtml.classList.add('coin')
    newCoinHtml.setAttribute('src', CoinSilverGif)
    newCoinHtml.style.left = `${this.getScreenPos().x}%`
    newCoinHtml.style.top = `${this.getScreenPos().y}%`

    document.querySelector('.main__wrapper').appendChild(newCoinHtml)
  }

  destroy() {
    const random = Math.random()
    if (random <= 0.25) {
      dropRandomJewel(this.getScreenPos().x, this.getScreenPos().y)
    }

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

    chompSounds[Math.floor(Math.random() * chompSounds.length)].play()
  }

  walk() {
    this.htmlElement.style.transform = `translate3d(${this.offsetPosX}vh, 0, 0)`
    this.offsetPosX -= this.speedX * deltaTime
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
          hitSounds[Math.floor(Math.random() * hitSounds.length)].play()

          for (let i = 0; i < this.hitSound.length; i++) {
            this.hitSound[i].addEventListener('ended', () => {
              this.hitSound.splice(i, 1)
            })
          }

          // Если пуля содержит в себе эффект, то накладываем его
          if (bullet.getAttribute('effect')) {
            if (!this.isEffect) {
              this.isEffect = true
              if (bullet.getAttribute('effect') === 'freeze') {
                this.htmlElementZombie.style.filter = 'hue-rotate(180deg)'
                this.speedX = this.maxSpeedX / 2
              }
            }
          }

          // При попадании сбрасываем время эффекта
          this.effectDuration = 0

          // При попадании отнимаем хп, в зависимости от дамага
          this.health -= parseInt(bullet.getAttribute('damage'))

          // Удаляем пулю
          bullet.parentElement.removeChild(bullet)

          if (this.isEffect) {
            // Если есть эффект, то делаем подсветку с изменённой ротацией цвета
            this.htmlElementZombie.style.filter = 'brightness(1.15) hue-rotate(180deg)'
          } else {
            // Иначе просто делаем подсветку
            this.htmlElementZombie.style.filter = 'brightness(1.15)'
          }

          this.allTimeouts.push(
            setGameTimeout(
              // Убираем подсветку через 100 мс.
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

          // Подтверждаем попадание и выходим из цикла
          isHit = true
          return
        }
      })
      if (isHit) return
    })

    if (
      // Уничтожаем, если хп < 0 или позиция меньше X начала экрана
      this.health <= 0 ||
      this.htmlElement.getBoundingClientRect().x <=
        document.querySelector('.main__wrapper').getBoundingClientRect().x -
          this.htmlElement.getBoundingClientRect().width
    ) {
      this.destroy()
      return
    }

    if (!lawnMower.htmlElement) return

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
        lawnMower.sound.play()
        lawnMower.isFirstActive = false
      }

      this.destroy()
      return
    }
  }

  checkCollision(plantsArray) {
    let isCollision = false

    // Центр по X
    const centerPositionOfZombie =
      this.htmlElement.getBoundingClientRect().x +
      this.htmlElement.getBoundingClientRect().width / 2

    plantsArray.forEach(plant => {
      if (!plant.htmlElement) return

      // Левая сторона растения по X
      const leftSideOfPlant = plant.htmlElement.getBoundingClientRect().x
      // Правая сторона растения по X
      const rightSideOfPlant =
        plant.htmlElement.getBoundingClientRect().x +
        plant.htmlElement.getBoundingClientRect().width

      // Если попали в этот диапазон, то едим растение
      if (centerPositionOfZombie >= leftSideOfPlant && centerPositionOfZombie <= rightSideOfPlant) {
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
        isCollision = true
      }
    })

    return isCollision
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
