import { gameStatus } from '../../main'

import PeashooterImg from '../images/plants/peashooter.png'
import SunflowerImg from '../images/plants/sunflower.png'

import * as Plants from '../models/Plants'

import SelectSeedPacketSound from '../music/seed_packet_sound.mp3'

export class SeedPacket {
  selectSound = new Audio(SelectSeedPacketSound)
  isSelected = false

  constructor(option) {
    this.option = Object.assign(option, {
      plant: option.plant,
      image: option.image,
      cost: option.cost,
      id: option.id
    })

    const packetHtml = /*html*/ `
      <div class="seed_bar__seeds__packet" id='${this.option.id}'>
        <div
          class="seed_bar__seeds__packet__image"
          style='background-image: url(${this.option.image})'></div>
        <div class="seed_bar__seeds__packet__cost">${this.option.cost}</div>
        <div class="seed_bar__seeds__packet__info">${this.option.plant.name}</div>
      </div>
    `

    document.querySelector('.seed_bar__seeds').innerHTML += packetHtml
  }

  createPlant(htmlElement) {
    gameStatus.suns -= this.option.cost
    return new this.option.plant(htmlElement, this.option.image)
  }
}

export const seedPacketsList = [
  new SeedPacket({
    plant: Plants.Peashooter,
    image: PeashooterImg,
    cost: 100,
    id: 0
  }),
  new SeedPacket({
    plant: Plants.Sunflower,
    image: SunflowerImg,
    cost: 50,
    id: 1
  })
]
