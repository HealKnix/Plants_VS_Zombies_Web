import { setGameTimeout } from '/src/models/GameTimeout'
import { gameStatus, deltaTime } from '/src/views/Game'
import { soundFX } from '/src/assets/js/Music'

export class Sun {
  pickupSound = soundFX.object.sounds.sunPickupSound
  currentTime = 0
  lifeTime = 8000
  capacity = 0
  goalY = 0
  isFall = false
  htmlElement = null
  isClicked = false
  allTimeouts = new Array()
  posX = 0
  posY = 0

  constructor(htmlElement, x, y, capacity) {
    this.htmlElement = htmlElement
    this.posX = x
    this.posY = y
    this.capacity = capacity

    this.htmlElement.setAttribute('style', `left: ${this.posX}%; top: ${this.posY}%`)

    this.htmlElement.addEventListener('click', () => {
      const goal = document.querySelector('.seed_bar__suns_present__sun')
      this.htmlElement.style.transition = '0.75s ease-in-out'

      this.htmlElement.style.left = `calc(${
        goal.getBoundingClientRect().x -
        document.querySelector('.main__wrapper').getBoundingClientRect().x
      }px + 4.5vh)`
      this.htmlElement.style.top = `calc(${
        goal.getBoundingClientRect().y -
        document.querySelector('.main__wrapper').getBoundingClientRect().y
      }px + 4.5vh)`

      this.htmlElement.style.opacity = `0.2`
      this.htmlElement.style.pointerEvents = 'none'

      this.pickupSound.play()

      this.isClicked = true
      this.isFall = false

      this.allTimeouts.push(
        setGameTimeout(() => {
          gameStatus.suns.value += this.capacity
          this.destroy()
        }, 750)
      )
    })

    document.querySelector('.main__wrapper').appendChild(this.htmlElement)
  }

  destroy() {
    this.htmlElement.parentElement.removeChild(this.htmlElement)
    this.htmlElement = null
    this.allTimeouts.forEach(item => {
      item.clear()
    })
  }

  update() {
    if (!this.htmlElement) return

    if (this.isFall) {
      this.posY += deltaTime * 5
      this.htmlElement.style.top = `${this.posY}vh`
      if (this.posY >= this.goalY) {
        this.isFall = false
      }
      return
    }
    this.currentTime += deltaTime * 1000
    if (this.currentTime >= this.lifeTime) {
      if (this.isClicked) return
      this.destroy()
      return
    }
  }
}
