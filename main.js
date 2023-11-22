import { seedPacketsList } from '/src/models/SeedPacket'
import { setGameTimeout, gameTimeoutsArray } from '/src/models/GameTimeout'
import { gameIntervalsArray } from '/src/models/GameInterval'
import { rel } from '/src/models/Relation'
import { music, soundFX } from '/src/assets/js/Music'

const seedPacketSound = soundFX.object.sounds.seedPacketSound
const shovelSound = soundFX.object.sounds.shovelSound

import ShovelImage from '/src/images/other/shovel.png'

import * as StartLevelText from '/src/assets/js/StartLevelText'

import StartSpawnZombie from '/src/assets/js/StartSpawnZombie.js'

import StartSpawnSun from '/src/assets/js/StartSpawnSun.js'

import Menu from '/src/assets/js/Menu.js'

const mouse = {
  x: 0,
  y: 0
}

export const startLevelDelay = 0
StartLevelText.start(startLevelDelay, music)

export let sunsArray = new Array()

export const gameStatus = {
  suns: rel(50, '', value => {
    document.querySelector('.count_of_suns').innerText = value
  }),
  shovelSelected: false,
  isStart: false,
  isPaused: rel(false, '', value => {
    if (value) {
      document.querySelector('.pause_menu__wrapper').classList.add('paused')
    } else {
      document.querySelector('.pause_menu__wrapper').classList.remove('paused')
    }
  }),
  isMenu: rel(false, '', value => {
    if (value) {
      document.querySelector('.menu__wrapper').classList.add('active')
    } else {
      document.querySelector('.menu__wrapper').classList.remove('active')
    }
  })
}

export let deltaTime = 0
let preventTime = Date.now()

const cursorSelectedHtml = document.querySelector('.cursor_selected')

const mainWrapperHtml = document.querySelector('.main__wrapper')
mainWrapperHtml.addEventListener('mousemove', e => {
  mouse.x = e.clientX - mainWrapperHtml.getBoundingClientRect().x
  mouse.y = e.clientY - mainWrapperHtml.getBoundingClientRect().y
  if (seedPacketsList.some(packet => packet.isSelected) || shovelSelected.value) {
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

export const map = [
  {
    isActive: true,
    lawnMower: {
      active: false,
      htmlElement: document.querySelectorAll('.lawn_mower')[0],
      posX: 0,
      speedX: 30,
      isFirstActive: true,
      sound: soundFX.object.sounds.lawnMowerSound
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
      sound: soundFX.object.sounds.lawnMowerSound
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
      sound: soundFX.object.sounds.lawnMowerSound
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
      sound: soundFX.object.sounds.lawnMowerSound
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
      sound: soundFX.object.sounds.lawnMowerSound
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

function clearCeil(ceil) {
  if (ceil) {
    if (!ceil.classList.contains('floor__ceil')) {
      return
    }
    ceil.removeAttribute('style')
  }
}

function clearCursor(ceil) {
  shovelSelected.value = false
  clearCeil(ceil)
  clearSeedPackets()

  cursorSelectedHtml.style.display = 'none'
  cursorSelectedHtml.style.left = '-1000px'
  cursorSelectedHtml.style.top = '-1000px'
  cursorSelectedHtml.style.backgroundImage = `url()`
}

const shovel = document.querySelector('.shovel')
const shovelPanel = document.querySelector('.shovel_panel')
shovelPanel.addEventListener('click', () => {
  clearSeedPackets()
  if (shovelSelected.value) {
    clearCursor()
    return
  }
  shovelSelected.value = true
  shovelSound.play()
  setCursor(ShovelImage)
})

let floor_row = document.querySelectorAll('.floor__row')
const shovelSelected = rel(false, '', value => {
  if (value) {
    shovel.classList.add('active')
  } else {
    shovel.classList.remove('active')
    floor_row.forEach(row => {
      if (!map[parseInt(row.id)].isActive) return
      ;[...row.children].forEach(ceil => {
        if (ceil.classList.contains('planted')) {
          ceil.style.filter = 'brightness(1)'
        }
      })
    })
  }
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

    if (seedPacket.isRecharged) {
      packet.children[2].innerHTML = /*html*/ `
        <span style="font-size: 1.5vh; color: red">перезарядка...</span>
        <span>${seedPacket.option.plant.name}</span>
      `
      return
    }

    if (gameStatus.suns.value < seedPacket.option.cost) {
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
    if (packet.classList.contains('disabled')) {
      return
    }

    if (packet.classList.contains('select')) {
      seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = false
      packet.classList.remove('select')
      return
    }

    clearCursor()

    clearSeedPackets()

    packet.classList.add('select')
    seedPacketsList[parseInt(packet.getAttribute('id'))].isSelected = true

    setCursor(seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].option.image)

    seedPacketSound.play()
  })
})

const shovelDiggingSound = soundFX.object.sounds.shovelDiggingSound

floor_row.forEach(row => {
  if (!map[parseInt(row.id)].isActive) return
  ;[...row.children].forEach(ceil => {
    ceil.addEventListener('mouseenter', e => {
      if (ceil.classList.contains('planted') && shovelSelected.value) {
        ceil.style.filter = `brightness(1.25)`
      }

      if (
        ceil.classList.contains('planted') ||
        ceil.classList.contains('zombie_spawner') ||
        ceil.classList.contains('lawn_mower') ||
        !seedPacketsList.some(packet => packet.isSelected)
      ) {
        return
      }

      if (ceil.children.length === 0) {
        ceil.style.backgroundImage = `url("${
          seedPacketsList[seedPacketsList.findIndex(packet => packet.isSelected)].option.image
        }")`
        ceil.style.opacity = `0.5`
      }
    })
    ceil.addEventListener('mouseleave', e => {
      if (ceil.classList.contains('planted') && shovelSelected.value) {
        ceil.style.filter = `brightness(1)`
      }

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
      if (ceil.classList.contains('planted') && shovelSelected.value) {
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
  if (!gameStatus.isPaused.value && !gameStatus.isMenu.value) {
    timeoutsAndIntervalsUpdate()

    sunsArray = sunsArray.filter(sun => sun.htmlElement !== null)
    sunsArray.forEach(sun => {
      sun.update()
    })

    seedPacketsList.forEach(packet => {
      packet.updateReload()
      if (gameStatus.suns.value < packet.option.cost) {
        seedPackets[packet.option.id].classList.add('disabled')
      } else if (!packet.isRecharged) {
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
  }

  preventTime = Date.now()
  requestAnimationFrame(gameLogic)
}
// Обновление игровой логики
const gameUpdateLogic = requestAnimationFrame(gameLogic)

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (gameStatus.isPaused.value) {
      Menu.closePauseMenu()
      return
    }
    if (!gameStatus.isMenu.value) {
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
StartSpawnZombie(startLevelDelay, map)

// Для спавна солнышек на уровне
StartSpawnSun(startLevelDelay)
