import { seedPacketsList } from '/src/models/SeedPacket'
import * as Zombie from '/src/models/Zombies'

import SunPickupSound from '/src/music/sun_pickup.mp3'
import ZombieStart from '/src/music/zombies_start.mp3'
import SeedPacketSound from '/src/music/seed_packet_sound.mp3'
import LawnMowerSound from '/src/music/lawn_mower.mp3'
import ShovelDiggingSound from '/src/music/planting_sound_2.mp3'

import ShovelImage from '/src/images/other/shovel.png'

const mouse = {
  x: 0,
  y: 0
}

export const gameStatus = {
  suns: 50,
  shovelSelected: false
}
export let deltaTime = 0
let preventTime = 0

const cursorSelected = document.querySelector('.cursor_selected')
document.querySelector('.main__wrapper').addEventListener('mousemove', e => {
  mouse.x = e.clientX - document.querySelector('.main__wrapper').getBoundingClientRect().x
  mouse.y = e.clientY - document.querySelector('.main__wrapper').getBoundingClientRect().y
  if (seedPacketsList.some(packet => packet.isSelected) || gameStatus.shovelSelected) {
    cursorSelected.style.left = `${mouse.x - cursorSelected.getBoundingClientRect().width / 2}px`
    cursorSelected.style.top = `${mouse.y - cursorSelected.getBoundingClientRect().height / 1.5}px`
  }
})

document.addEventListener('mousedown', e => {
  if (e.button === 2) {
    clearCursor(document.elementFromPoint(e.clientX, e.clientY))
  }
})

const themeAudio = document.getElementById('music')
themeAudio.volume = 0.15

document.addEventListener('click', () => {
  themeAudio.play()
})

const map = [
  {
    isActive: true,
    lawnMower: {
      active: false,
      htmlElement: document.querySelectorAll('.lawn_mower')[0],
      posX: 0,
      speedX: 30,
      isFirstActive: true,
      sound: new Audio(LawnMowerSound)
    },
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    isActive: true,
    lawnMower: {
      active: false,
      htmlElement: document.querySelectorAll('.lawn_mower')[1],
      posX: 0,
      speedX: 30,
      isFirstActive: true,
      sound: new Audio(LawnMowerSound)
    },
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    isActive: true,
    lawnMower: {
      active: false,
      htmlElement: document.querySelectorAll('.lawn_mower')[2],
      posX: 0,
      speedX: 30,
      isFirstActive: true,
      sound: new Audio(LawnMowerSound)
    },
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    isActive: true,
    lawnMower: {
      active: false,
      htmlElement: document.querySelectorAll('.lawn_mower')[3],
      posX: 0,
      speedX: 30,
      isFirstActive: true,
      sound: new Audio(LawnMowerSound)
    },
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    isActive: true,
    lawnMower: {
      active: false,
      htmlElement: document.querySelectorAll('.lawn_mower')[4],
      posX: 0,
      speedX: 30,
      isFirstActive: true,
      sound: new Audio(LawnMowerSound)
    },
    plantsArray: new Array(),
    zombiesArray: new Array()
  }
]

function setCursor(image) {
  cursorSelected.style.display = 'block'
  cursorSelected.style.left = `${mouse.x - cursorSelected.getBoundingClientRect().width / 2}px`
  cursorSelected.style.top = `${mouse.y - cursorSelected.getBoundingClientRect().height / 1.5}px`
  cursorSelected.style.backgroundImage = `url('${image}')`
}

function clearShovel() {
  shovel.classList.remove('active')
  gameStatus.shovelSelected = false
}
function clearCeil(ceil) {
  if (ceil) {
    if (!ceil.classList.contains('floor__ceil')) {
      return
    }
    ceil.removeAttribute('style')
  }
}
function clearCursor(ceil) {
  clearShovel()
  clearCeil(ceil)
  clearSeedPackets()

  cursorSelected.style.display = 'none'
  cursorSelected.style.left = '-1000px'
  cursorSelected.style.top = '-1000px'
  cursorSelected.style.backgroundImage = `url()`
}

const shovelPanel = document.querySelector('.shovel_panel')
const shovel = document.querySelector('.shovel')
shovelPanel.addEventListener('click', () => {
  clearSeedPackets()
  if (shovel.classList.contains('active')) {
    gameStatus.shovelSelected = false
    shovel.classList.remove('active')
    clearCursor()
    return
  }
  gameStatus.shovelSelected = true
  shovel.classList.add('active')
  setCursor(ShovelImage)
})

let seedPackets = document.querySelectorAll('.seed_bar__seeds__packet')

function clearSeedPackets() {
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
}

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
    shovel.classList.remove('active')
    gameStatus.shovelSelected = false

    if (packet.classList.contains('disabled')) return

    if (packet.classList.contains('select')) {
      seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = false
      packet.classList.remove('select')
      clearCursor()
      return
    }

    clearSeedPackets()

    packet.classList.add('select')
    seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = true

    setCursor(seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].option.image)

    let seedPacketSound = new Audio(SeedPacketSound)
    seedPacketSound.volume = 0.35
    seedPacketSound.play()
  })
})

let floor_row = document.querySelectorAll('.floor__row')

floor_row.forEach(row => {
  if (!map[parseInt(row.id)].isActive) return
  ;[...row.children].forEach(ceil => {
    ceil.addEventListener('mouseenter', e => {
      if (
        ceil.classList.contains('planted') ||
        ceil.classList.contains('zombie_spawner') ||
        ceil.classList.contains('lawn_mower') ||
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
        ceil.classList.contains('lawn_mower') ||
        !seedPacketsList.some(packet => packet.isSelected)
      )
        return

      if (ceil.children.length === 0) {
        ceil.removeAttribute('style')
      }
    })
    ceil.addEventListener('click', e => {
      if (ceil.classList.contains('planted') && gameStatus.shovelSelected) {
        const shovelDiggingSound = new Audio(ShovelDiggingSound)
        shovelDiggingSound.volume = 0.15
        shovelDiggingSound.play()

        const indexDelete = map[parseInt(row.id)].plantsArray.findIndex(
          plant => plant.htmlElement === ceil.children[0]
        )
        const plant = map[parseInt(row.id)].plantsArray[indexDelete]
        plant.destroy()

        map[parseInt(row.id)].plantsArray = map[parseInt(row.id)].plantsArray.filter(
          plant => plant.htmlElement !== null
        )

        ceil.classList.remove('planted')
        clearCursor()
      }

      if (
        ceil.classList.contains('planted') ||
        ceil.classList.contains('zombie_spawner') ||
        ceil.classList.contains('lawn_mower') ||
        ceil.children.length !== 0 ||
        !seedPacketsList.some(packet => packet.isSelected)
      ) {
        return
      }

      let newElement = document.createElement('div')
      newElement.classList.add('plant')

      ceil.classList.add('planted')
      ceil.appendChild(newElement)

      map[parseInt(row.id)].plantsArray.push(
        seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].createPlant(
          newElement
        )
      )

      clearCursor(ceil)

      ceil.style.opacity = `1`
    })
  })
})

// Игровая логика
let y = 10
requestAnimationFrame(function selectedCeil() {
  deltaTime = (Date.now() - preventTime) / 1000

  document.querySelectorAll('.sun_from_level.sun').forEach(sun => {
    if (sun.classList.contains('fall')) return
    sun.classList.add('fall')
    sun.style.top = `${Math.floor(Math.random() * 70 + 20)}vh`
  })

  seedPacketsList.forEach(packet => {
    packet.updateReload()
    if (gameStatus.suns < packet.option.cost) {
      seedPackets[packet.option.id].classList.add('disabled')
    } else if (!packet.isReloaded) {
      seedPackets[packet.option.id].classList.remove('disabled')
    }
  })

  map.forEach(lane => {
    lane.plantsArray.forEach(plant => {
      plant.update(lane)
    })
    lane.zombiesArray.forEach(zombie => {
      zombie.update(lane)
    })
    if (lane.zombiesArray.some(zombie => zombie.health === 0))
      lane.zombiesArray = lane.zombiesArray.filter(zombie => zombie.health !== 0)
    if (lane.plantsArray.some(plant => plant.health === 0))
      lane.plantsArray = lane.plantsArray.filter(plant => plant.health !== 0)

    if (lane.lawnMower.htmlElement === null) return
    if (lane.lawnMower.active) {
      lane.lawnMower.posX += 25 * deltaTime
      lane.lawnMower.htmlElement.style.left = `${lane.lawnMower.posX}vh`
      if (
        lane.lawnMower.htmlElement.getBoundingClientRect().x >
        document.querySelector('.main__wrapper').clientWidth +
          document.querySelector('.main__wrapper').clientWidth / 3
      ) {
        lane.lawnMower.htmlElement.parentElement.removeChild(lane.lawnMower.htmlElement)
        lane.lawnMower.htmlElement = null
      }
    }
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
  }, 7500)
  setTimeout(() => {
    const zombieStartSound = new Audio(ZombieStart)
    zombieStartSound.volume = 0.5
    zombieStartSound.play()
  }, 7500)
}, 20000)

// Для спавна солнышек на уровне
setInterval(() => {
  const newElement = document.createElement('div')
  newElement.classList.add('sun_from_level', 'sun')

  const randomX = Math.floor(Math.random() * 100 + 25)
  newElement.setAttribute('style', `left: ${randomX}vh`)

  const timeoutToRemoveSun = setTimeout(() => {
    newElement.parentElement.removeChild(newElement)
  }, 18000)

  newElement.addEventListener('click', () => {
    gameStatus.suns += 25
    const pickupSound = new Audio(SunPickupSound)
    pickupSound.volume = 0.25
    pickupSound.play()
    const goal = document.querySelector('.seed_bar__suns_present__sun')
    newElement.style.transition = '0.5s ease-in-out'
    newElement.style.left = `calc(${
      goal.getBoundingClientRect().x -
      document.querySelector('.main__wrapper').getBoundingClientRect().x
    }px + 4.5vh)`
    newElement.style.top = `calc(${
      goal.getBoundingClientRect().y -
      document.querySelector('.main__wrapper').getBoundingClientRect().y
    }px + 4.5vh)`
    newElement.style.opacity = `0.2`
    newElement.style.pointerEvents = 'none'
    setTimeout(() => {
      newElement.parentElement.removeChild(newElement)
      clearTimeout(timeoutToRemoveSun)
    }, 500)
  })

  document.querySelector('.main__wrapper').appendChild(newElement)
}, 5000)
