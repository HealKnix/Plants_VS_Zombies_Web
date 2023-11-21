import { gameStatus } from '../../main'
import { deltaTime } from '/main'

import PeashooterImg from '../images/plants/peashooter.png'
import SunflowerImg from '../images/plants/sunflower.png'
import CherryBombImg from '../images/plants/cherry_bomb.png'
import WallNutImg from '../images/plants/wall_nut.png'
import RepeaterImg from '../images/plants/repeater.png'

import * as Plants from '../models/Plants'

import SelectSeedPacketSound from '../music/seed_packet_sound.mp3'

export class SeedPacket {
  selectSound = new Audio(SelectSeedPacketSound)
  htmlElement = null
  isSelected = false
  isReloaded = false
  currentReloadTime = 0

  constructor(option) {
    this.option = Object.assign(option, {
      plant: option.plant,
      image: option.image,
      cost: option.cost,
      reloadTime: option.reloadTime,
      id: option.id
    })

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

    document.querySelector('.seed_bar__seeds').appendChild(this.htmlElement)
  }

  updateReload() {
    if (this.isReloaded) {
      this.currentReloadTime -= deltaTime * 1000
      if (this.currentReloadTime <= 0) {
        this.htmlElement.children[2].innerText = this.option.plant.name
        this.isReloaded = false
        this.currentReloadTime = 0
        this.htmlElement.children[3].classList.remove('show')
      }
      this.htmlElement.setAttribute(
        'style',
        `--reloaded-height: ${(this.currentReloadTime / this.option.reloadTime) * 100}%`
      )
    }
  }

  createPlant(htmlElement) {
    gameStatus.suns.value -= this.option.cost
    this.isReloaded = true
    this.currentReloadTime = this.option.reloadTime
    this.htmlElement.classList.add('disabled')
    this.htmlElement.children[3].classList.add('show')
    return new this.option.plant(htmlElement, this.option.image)
  }
}

export const seedPacketsList = [
  new SeedPacket({
    plant: Plants.Peashooter,
    image: PeashooterImg,
    cost: 100,
    reloadTime: 8000,
    id: 0
  }),
  new SeedPacket({
    plant: Plants.Sunflower,
    image: SunflowerImg,
    cost: 50,
    reloadTime: 7500,
    id: 1
  }),
  new SeedPacket({
    plant: Plants.CherryBomb,
    image: CherryBombImg,
    cost: 150,
    reloadTime: 15000,
    id: 2
  }),
  new SeedPacket({
    plant: Plants.WallNut,
    image: WallNutImg,
    cost: 50,
    reloadTime: 25000,
    id: 3
  }),
  new SeedPacket({
    plant: Plants.Repeater,
    image: RepeaterImg,
    cost: 200,
    reloadTime: 8000,
    id: 4
  })
]
