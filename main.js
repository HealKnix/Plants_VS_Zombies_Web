import { seedPacketsList } from '/src/models/SeedPacket'
import * as Zombie from '/src/models/Zombies'
import { Sun } from '/src/models/Sun'
import { setGameTimeout, gameTimeoutsArray } from '/src/models/GameTimeout'
import { setGameInterval, gameIntervalsArray } from '/src/models/GameInterval'
import { rel } from '/src/models/Relation'

const zombiesArray = [Zombie.RegularZombie, Zombie.ConeheadZombie]

import ZombieStartSound from '/src/music/zombies_start.mp3'
import SeedPacketSound from '/src/music/seed_packet_sound.mp3'
import LawnMowerSound from '/src/music/lawn_mower.mp3'
import ShovelDiggingSound from '/src/music/planting_sound_2.mp3'
import OpenPauseMenuSound from '/src/music/pause.mp3'
import ButtonClickSound from '/src/music/button_click.mp3'

import ShovelSound from '/src/music/shovel.mp3'
import ShovelImage from '/src/images/other/shovel.png'

const shovelSound = new Audio(ShovelSound)
shovelSound.volume = 0.25

const mouse = {
  x: 0,
  y: 0
}

const countOfSunsHtml = document.querySelector('.count_of_suns')

export let sunsArray = new Array()

export const gameStatus = {
  suns: 50,
  shovelSelected: false,
  isPaused: false,
  isMenu: false
}
export let deltaTime = 0
let preventTime = Date.now()

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

const musicLevelHtml = document.getElementById('music_level')
const musicSliderHtml = document.querySelector('#Music')

musicLevelHtml.volume = musicSliderHtml.value

const musicLevel = rel(musicLevelHtml, 'volume', function () {
  musicSliderHtml.value = musicLevel.value
})
musicSliderHtml.addEventListener('change', () => {
  musicLevel.value = musicSliderHtml.value
})

document.addEventListener('click', () => {
  musicLevel.object.play()
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
  shovelSound.play()
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

function timeoutsAndIntervalsUpdate() {
  if (gameTimeoutsArray.array.some(item => item.option === null)) {
    gameTimeoutsArray.array = gameTimeoutsArray.array.filter(item => item.option !== null)
  }
  if (gameIntervalsArray.array.some(item => item.option === null)) {
    gameIntervalsArray.array = gameIntervalsArray.array.filter(item => item.option !== null)
  }

  gameTimeoutsArray.array.forEach(item => {
    item.method()
  })
  gameIntervalsArray.array.forEach(item => {
    item.method()
  })
}

// Игровая логика
function gameLogic() {
  deltaTime = (Date.now() - preventTime) / 1000
  if (!gameStatus.isPaused && !gameStatus.isMenu) {
    timeoutsAndIntervalsUpdate()

    sunsArray = sunsArray.filter(sun => sun.htmlElement !== null)
    sunsArray.forEach(sun => {
      sun.update()
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

    if (parseInt(countOfSunsHtml.innerText) !== gameStatus.suns) {
      countOfSunsHtml.innerText = gameStatus.suns
    }
  }

  preventTime = Date.now()
  requestAnimationFrame(gameLogic)
}
// Обновление игровой логики
const gameUpdateLogic = requestAnimationFrame(gameLogic)

function openPauseMenu() {
  if (gameStatus.isPaused || gameStatus.isMenu) return
  document.querySelector('.pause_menu__wrapper').classList.add('paused')
  gameStatus.isPaused = true
  const openPauseMenuSound = new Audio(OpenPauseMenuSound)
  openPauseMenuSound.volume = 0.15
  openPauseMenuSound.play()

  musicLevel.object.pause()
}

function closePauseMenu() {
  document.querySelector('.pause_menu__wrapper').classList.remove('paused')
  gameStatus.isPaused = false
  const buttonClickSound = new Audio(ButtonClickSound)
  buttonClickSound.volume = 0.25
  buttonClickSound.play()
}

function openMenu() {
  if (gameStatus.isMenu) return
  document.querySelector('.menu__wrapper').classList.add('active')
  gameStatus.isMenu = true
  const openPauseMenuSound = new Audio(OpenPauseMenuSound)
  openPauseMenuSound.volume = 0.15
  openPauseMenuSound.play()

  musicLevel.object.pause()
}

function closeMenu() {
  document.querySelector('.menu__wrapper').classList.remove('active')
  gameStatus.isMenu = false
  const buttonClickSound = new Audio(ButtonClickSound)
  buttonClickSound.volume = 0.25
  buttonClickSound.play()
}

document.querySelector('.pause_menu__button').onclick = closePauseMenu
document.querySelector('.menu__button').onclick = closeMenu

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (gameStatus.isPaused) {
      closePauseMenu()
      return
    }
    if (!gameStatus.isMenu) {
      openMenu()
    } else {
      closeMenu()
    }
  }
  if (e.key === 'm') {
    musicLevel.value = 0
  }
})

window.onblur = function () {
  openPauseMenu()
}

// Для начала волны Зомби
setGameTimeout(() => {
  // Для спавна зомби на уровне
  setGameInterval(() => {
    const randomLane = Math.floor(Math.random() * map.length)

    const newElement = document.createElement('div')
    const newZombie = new zombiesArray[Math.floor(Math.random() * 2)](newElement)

    let zombieSpawners = document.querySelectorAll('.zombie_spawner')
    zombieSpawners[randomLane].appendChild(newElement)

    map[randomLane].zombiesArray.push(newZombie)
  }, 7500)
  // Для проигрывания звука перед началом атаки Зомби
  setGameTimeout(() => {
    const zombieStartSound = new Audio(ZombieStartSound)
    zombieStartSound.volume = 0.5
    zombieStartSound.play()
  }, 7500)
}, 15000)

// Для спавна солнышек на уровне
setGameInterval(() => {
  const newElement = document.createElement('div')
  newElement.classList.add('sun_from_level', 'sun')

  const randomX = Math.floor(Math.random() * 100 + 25)

  const newSun = new Sun(newElement, randomX, 18, 25)

  newSun.goalY = Math.floor(Math.random() * 70 + 20)
  newSun.isFall = true

  sunsArray.push(newSun)
}, 5000)
