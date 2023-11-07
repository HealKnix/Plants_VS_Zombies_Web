import PeashooterImg from '../images/plants/peashooter.png'

class Plant {
  htmlElement = null
  image = ''
  isReadyToShoot = false
  health = 100

  bulletSpeed = 0.2

  constructor(htmlElement) {
    this.htmlElement = htmlElement
    this.htmlElement.classList.add('planted')
  }

  shoot() {}
}

export class Peashooter extends Plant {
  image = PeashooterImg
  isReadyToShoot = true
  health = 125

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

      bulletsX += this.bulletSpeed
      bullets[i].setAttribute('posX', bulletsX)
    }
  }
}
