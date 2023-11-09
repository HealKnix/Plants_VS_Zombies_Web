import { seedPacketsList } from '/src/models/SeedPacket'
import * as Plants from '/src/models/Plants'
import * as Zombie from '/src/models/Zombies'

import SeedPacketSound from '/src/music/seed_packet_sound.mp3'

let themeAudio = document.getElementById('music')
themeAudio.volume = 0.15

document.addEventListener('click', () => {
  themeAudio.play()
})

let suns = 0
export let deltaTime = 0
let preventTime = 0

const map = [
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  }
]

let seedBar = document.querySelector('.seed_bar')
let seedPackets = document.querySelectorAll('.seed_bar__seeds__packet')

seedPackets.forEach(packet => {
  packet.addEventListener('click', e => {
    if (packet.classList.contains('select')) {
      seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = false
      packet.classList.remove('select')
      return
    }

    let countIndex = 0

    seedPacketsList.forEach(packet => {
      if (packet.isSelected) countIndex++
    })

    if (countIndex > 0) {
      seedPackets.forEach(packet => {
        packet.classList.remove('select')
      })
      seedPacketsList.forEach(packet => {
        packet.isSelected = false
      })
    }

    packet.classList.add('select')
    seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = true

    let opa = new Audio(SeedPacketSound)
    opa.volume = 0.35
    opa.play()
  })
})

let floor_row = document.querySelectorAll('.floor__row')

floor_row.forEach(row => {
  ;[...row.children].forEach(ceil => {
    ceil.addEventListener('mouseenter', e => {
      if (
        ceil.classList.contains('planted') ||
        ceil.classList.contains('zombie_spawner') ||
        !seedPacketsList.some(packet => packet.isSelected)
      )
        return

      if (ceil.children.length === 0) {
        ceil.style.backgroundImage = `url("${
          seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].option.image
        }")`
        ceil.style.opacity = `0.5`
      }
    })
    ceil.addEventListener('mouseleave', e => {
      if (
        ceil.classList.contains('planted') ||
        ceil.classList.contains('zombie_spawner') ||
        !seedPacketsList.some(packet => packet.isSelected)
      )
        return

      if (ceil.children.length === 0) {
        ceil.removeAttribute('style')
      }
    })
    ceil.addEventListener('click', e => {
      if (
        ceil.classList.contains('planted') ||
        ceil.classList.contains('zombie_spawner') ||
        ceil.children.length !== 0 ||
        !seedPacketsList.some(packet => packet.isSelected)
      ) {
        return
      }

      ceil.removeAttribute('style')

      let newElement = document.createElement('div')
      newElement.classList.add('plant')

      ceil.appendChild(newElement)

      map[parseInt(row.id)].plantsArray.push(
        seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].createPlant(
          newElement
        )
      )

      seedPackets.forEach(packet => {
        packet.classList.remove('select')
      })
      seedPacketsList.forEach(packet => {
        packet.isSelected = false
      })

      ceil.style.opacity = `1`
    })
  })
})

requestAnimationFrame(function selectedCeil() {
  deltaTime = (Date.now() - preventTime) / 1000
  map.forEach(lane => {
    lane.plantsArray.forEach(plant => {
      plant.activate(lane)
    })
    lane.zombiesArray.forEach(zombie => {
      zombie.walk()
      zombie.checkHit(lane.plantsArray)
    })
    if (lane.zombiesArray.some(zombie => zombie.health === 0))
      lane.zombiesArray = lane.zombiesArray.filter(zombie => zombie.health !== 0)
  })
  preventTime = Date.now()
  requestAnimationFrame(selectedCeil)
})

let zombieSpawners = document.querySelectorAll('.zombie_spawner')

setInterval(() => {
  const randomLane = Math.floor(Math.random() * map.length)

  let newElement = document.createElement('div')
  newElement.classList.add('zombie')

  let healthBar = document.createElement('div')
  healthBar.classList.add('health_bar')

  newElement.appendChild(healthBar)

  zombieSpawners[randomLane].appendChild(newElement)

  map[randomLane].zombiesArray.push(new Zombie.RegularZombie(newElement))
}, 2500)
