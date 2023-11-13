import { seedPacketsList } from '/src/models/SeedPacket'
import { setGameTimeout, gameTimeoutsArray } from '/src/models/GameTimeout'
import { gameIntervalsArray } from '/src/models/GameInterval'
import { rel } from '/src/models/Relation'

import SeedPacketSound from '/src/music/seed_packet_sound.mp3'
let seedPacketSound = new Audio(SeedPacketSound)
seedPacketSound.volume = 0.35

import LawnMowerSound from '/src/music/lawn_mower.mp3'
import ShovelDiggingSound from '/src/music/planting_sound_2.mp3'

import ShovelSound from '/src/music/shovel.mp3'
const shovelSound = new Audio(ShovelSound)
shovelSound.volume = 0.25

import ShovelImage from '/src/images/other/shovel.png'

import * as StartLevelText from '/src/assets/js/StartLevelText'

import StartSpawnZombie from '/src/assets/js/StartSpawnZombie.js'

import StartSpawnSun from '/src/assets/js/StartSpawnSun.js'

import Menu from '/src/assets/js/Menu.js'

const mouse = {
  x: 0,
  y: 0
}

const startDelay = 10000

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

StartLevelText.start(startDelay)

const cursorSelectedHtml = document.querySelector('.cursor_selected')
const mainWrapperHtml = document.querySelector('.main__wrapper')
mainWrapperHtml.addEventListener('mousemove', e => {
  mouse.x = e.clientX - mainWrapperHtml.getBoundingClientRect().x
  mouse.y = e.clientY - mainWrapperHtml.getBoundingClientRect().y
  if (seedPacketsList.some(packet => packet.isSelected) || gameStatus.shovelSelected) {
    cursorSelectedHtml.style.left = `${
      mouse.x - cursorSelectedHtml.getBoundingClientRect().width / 2
    }px`
    cursorSelectedHtml.style.top = `${
      mouse.y - cursorSelectedHtml.getBoundingClientRect().height / 1.5
    }px`
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

export const musicLevel = rel(musicLevelHtml, 'volume', function () {
  musicSliderHtml.value = musicLevel.value
})

musicSliderHtml.addEventListener('change', () => {
  musicLevel.value = musicSliderHtml.value
})

setGameTimeout(() => {
  musicLevel.object.play()
}, startDelay)

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
  cursorSelectedHtml.style.display = 'block'
  cursorSelectedHtml.style.left = `${
    mouse.x - cursorSelectedHtml.getBoundingClientRect().width / 2
  }px`
  cursorSelectedHtml.style.top = `${
    mouse.y - cursorSelectedHtml.getBoundingClientRect().height / 1.5
  }px`
  cursorSelectedHtml.style.backgroundImage = `url('${image}')`
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

  cursorSelectedHtml.style.display = 'none'
  cursorSelectedHtml.style.left = '-1000px'
  cursorSelectedHtml.style.top = '-1000px'
  cursorSelectedHtml.style.backgroundImage = `url()`
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

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (gameStatus.isPaused) {
      Menu.closePauseMenu()
      return
    }
    if (!gameStatus.isMenu) {
      Menu.openMenu()
    } else {
      Menu.closeMenu()
    }
  }
})

window.onblur = function () {
  Menu.openPauseMenu()
}

// Для начала волны Зомби
StartSpawnZombie(startDelay, map)

// Для спавна солнышек на уровне
StartSpawnSun(startDelay)
