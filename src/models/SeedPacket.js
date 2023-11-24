import { gameStatus, deltaTime } from '/src/views/Game'
import { soundFX } from '/src/assets/js/Music'

import PeashooterImg from '../images/plants/peashooter.png'
import SnowPeaImg from '../images/plants/snow_pea.png'
import SunflowerImg from '../images/plants/sunflower.png'
import CherryBombImg from '../images/plants/cherry_bomb.png'
import WallNutImg from '../images/plants/wall_nut.png'
import RepeaterImg from '../images/plants/repeater.png'

import * as Plants from '../models/Plants'
import RechargeTime from '../models/RechargeTime'

export class SeedPacket {
  selectSound = soundFX.object.sounds.selectSound
  htmlElement = null
  isSelected = false
  isRecharged = false
  defaultRecharge = this.isRecharged
  currentRechargedTime = 0

  constructor(option) {
    this.option = Object.assign(option, {
      plant: option.plant,
      image: option.image,
      cost: option.cost,
      rechargeTime: option.rechargeTime,
      isRecharged: option.isRecharged,
      id: option.id
    })

    this.defaultRecharge = this.option.isRecharged

    this.createNewHtmlElement()
  }

  createNewHtmlElement() {
    this.isSelected = false
    this.isRecharged = this.defaultRecharge
    this.currentRechargedTime = 0

    this.htmlElement = document.createElement('div')
    this.htmlElement.setAttribute('class', 'seed_bar__seeds__packet')
    this.htmlElement.setAttribute('style', '--reloaded-height: 100%')
    this.htmlElement.setAttribute('id', `${this.option.id}`)
    this.htmlElement.innerHTML = /*html*/ `
      <div
        class="seed_bar__seeds__packet__image"
        style='background-image: url(${this.option.image})'></div>
      <div class="seed_bar__seeds__packet__cost">${this.option.cost}</div>
      <div class="seed_bar__seeds__packet__info">${this.option.plant.name}</div>
      <div class="seed_bar__seeds__packet__reloaded_wrapper"></div>
    `

    if (this.option.isRecharged) {
      this.startRecharge()
    }
  }

  updateReload() {
    if (this.isRecharged) {
      this.currentRechargedTime -= deltaTime * 1000
      if (this.currentRechargedTime <= 0) {
        this.htmlElement.children[2].innerText = this.option.plant.name
        this.isRecharged = false
        this.currentRechargedTime = 0
        this.htmlElement.children[3].classList.remove('show')
      }
      this.htmlElement.setAttribute(
        'style',
        `--reloaded-height: ${(this.currentRechargedTime / this.option.rechargeTime) * 100}%`
      )
    }
  }

  startRecharge() {
    this.isRecharged = true
    this.currentRechargedTime = this.option.rechargeTime
    this.htmlElement.classList.add('disabled')
    this.htmlElement.children[3].classList.add('show')
  }

  createPlant(htmlElement) {
    gameStatus.suns.value -= this.option.cost
    this.startRecharge()
    return new this.option.plant(htmlElement, this.option.image)
  }
}

export const seedPacketsList = [
  new SeedPacket({
    plant: Plants.Peashooter,
    image: PeashooterImg,
    cost: 100,
    rechargeTime: RechargeTime.fast,
    isRecharged: false,
    id: 0
  }),
  new SeedPacket({
    plant: Plants.Sunflower,
    image: SunflowerImg,
    cost: 50,
    rechargeTime: RechargeTime.fast,
    isRecharged: false,
    id: 1
  }),
  new SeedPacket({
    plant: Plants.CherryBomb,
    image: CherryBombImg,
    cost: 150,
    rechargeTime: RechargeTime.verySlow,
    isRecharged: true,
    id: 2
  }),
  new SeedPacket({
    plant: Plants.WallNut,
    image: WallNutImg,
    cost: 50,
    rechargeTime: RechargeTime.slow,
    isRecharged: true,
    id: 3
  }),
  new SeedPacket({
    plant: Plants.SnowPea,
    image: SnowPeaImg,
    cost: 175,
    rechargeTime: RechargeTime.fast,
    isRecharged: true,
    id: 4
  })
  // new SeedPacket({
  //   plant: Plants.Repeater,
  //   image: RepeaterImg,
  //   cost: 200,
  //   rechargeTime: RechargeTime.fast,
  // isRecharged: true,
  //   id: 4
  // }),
]
