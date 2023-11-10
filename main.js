import { seedPacketsList } from '/src/models/SeedPacket'
import * as Zombie from '/src/models/Zombies'

import SunPickupSound from '/src/music/sun_pickup.mp3'

import SeedPacketSound from '/src/music/seed_packet_sound.mp3'

const cursorSelectedPlant = document.querySelector('.cursor_selected_plant')
document.addEventListener('mousemove', e => {
  if (!seedPacketsList.some(packet => packet.isSelected)) return
  cursorSelectedPlant.style.left = `${
    e.clientX - cursorSelectedPlant.getBoundingClientRect().width / 2
  }px`
  cursorSelectedPlant.style.top = `${
    e.clientY - cursorSelectedPlant.getBoundingClientRect().height / 1.5
  }px`
})

function clearCursor() {
  cursorSelectedPlant.style.display = 'none'
  cursorSelectedPlant.style.left = '-1000px'
  cursorSelectedPlant.style.top = '-1000px'
  cursorSelectedPlant.style.backgroundImage = `url()`
}

const themeAudio = document.getElementById('music')
themeAudio.volume = 0.15

document.addEventListener('click', () => {
  themeAudio.play()
})

export const gameStatus = {
  suns: 50
}
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
  packet.addEventListener('mouseenter', () => {
    packet.children[2].classList.add('show')

    const seedPacket = seedPacketsList[parseInt(packet.getAttribute('id'))]

    if (seedPacket.isReloaded) {
      packet.children[2].innerHTML = /*html*/ `
        <span style="font-size: 1.5vh; color: red">перезарядка...</span>
        <span>${seedPacket.option.plant.name}</span>
      `
      return
    }

    if (gameStatus.suns < seedPacket.option.cost) {
      packet.children[2].innerHTML = /*html*/ `
        <span style="font-size: 1.5vh; color: red">недостаточно солнышек</span>
        <span>${seedPacket.option.plant.name}</span>
      `
    } else {
      packet.children[2].innerText = seedPacket.option.plant.name
    }
  })
  packet.addEventListener('mouseleave', () => {
    packet.children[2].classList.remove('show')
  })
  packet.addEventListener('click', e => {
    if (packet.classList.contains('disabled')) return

    if (packet.classList.contains('select')) {
      seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = false
      packet.classList.remove('select')
      clearCursor()
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

    cursorSelectedPlant.style.display = 'block'
    cursorSelectedPlant.style.backgroundImage = `url(${
      seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].option.image
    })`

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

      clearCursor()

      ceil.style.opacity = `1`
    })
  })
})

// Игровая логика
requestAnimationFrame(function selectedCeil() {
  seedPacketsList.forEach(packet => {
    packet.updateReload()
    if (gameStatus.suns < packet.option.cost) {
      seedPackets[packet.option.id].classList.add('disabled')
    } else if (!packet.isReloaded) {
      seedPackets[packet.option.id].classList.remove('disabled')
    }
  })

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

  document.querySelector('.count_of_suns').innerText = gameStatus.suns

  preventTime = Date.now()
  requestAnimationFrame(selectedCeil)
})

// Для спавна зомби на уровне
let zombieSpawners = document.querySelectorAll('.zombie_spawner')
setTimeout(() => {
  setInterval(() => {
    const randomLane = Math.floor(Math.random() * map.length)

    let newElement = document.createElement('div')
    newElement.classList.add('zombie')

    zombieSpawners[randomLane].appendChild(newElement)

    map[randomLane].zombiesArray.push(new Zombie.RegularZombie(newElement))
  }, 12500)
}, 20000)

// Для спавна солнышек на уровне
setInterval(() => {
  const newElement = document.createElement('div')
  newElement.classList.add('sun_from_level', 'sun')

  newElement.style.animationName = `sunFall${Math.floor(Math.random() * 9) + 1}`

  const timeoutToRemoveSun = setTimeout(() => {
    newElement.parentElement.removeChild(newElement)
  }, 18000)

  newElement.addEventListener('click', () => {
    gameStatus.suns += 25
    const pickupSound = new Audio(SunPickupSound)
    pickupSound.volume = 0.25
    pickupSound.play()
    newElement.parentElement.removeChild(newElement)
    clearTimeout(timeoutToRemoveSun)
  })

  document.querySelector('main').appendChild(newElement)
}, 5000)
