import OpenPauseMenuSound from '/src/music/pause.mp3'
import ButtonClickSound from '/src/music/button_click.mp3'

import { readySetPlantSound, isReady } from '/src/assets/js/StartLevelText'
import { setGameTimeout } from '/src/models/GameTimeout'
import { gameStatus, musicLevel } from '/main'

const openMenuSound = new Audio(OpenPauseMenuSound)
openMenuSound.volume = 0.15
const buttonClickSound = new Audio(ButtonClickSound)
buttonClickSound.volume = 0.25

const allAnimationsOnLevel = document.querySelectorAll('.animated')

let isAllAnimationStylesDelete = false
setGameTimeout(() => {
  allAnimationsOnLevel.forEach(animation => {
    animation.style.animation = 'none'
  })

  isAllAnimationStylesDelete = true
}, 12000)

function openPauseMenu() {
  if (gameStatus.isPaused || gameStatus.isMenu) return
  document.querySelector('.pause_menu__wrapper').classList.add('paused')
  gameStatus.isPaused = true

  openMenuSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'paused'
    })
    readySetPlantSound.pause()
  }

  musicLevel.object.pause()
}

function closePauseMenu() {
  document.querySelector('.pause_menu__wrapper').classList.remove('paused')
  gameStatus.isPaused = false

  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'running'
    })
    if (isReady) readySetPlantSound.play()
  }

  musicLevel.object.play()
}

function openMenu() {
  if (gameStatus.isMenu) return
  document.querySelector('.menu__wrapper').classList.add('active')
  gameStatus.isMenu = true

  openMenuSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'paused'
    })
    readySetPlantSound.pause()
  }

  readySetPlantSound.pause()
  musicLevel.object.pause()
}

function closeMenu() {
  document.querySelector('.menu__wrapper').classList.remove('active')
  gameStatus.isMenu = false

  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'running'
    })
    if (isReady) readySetPlantSound.play()
  }

  musicLevel.object.play()
}

document.querySelector('.pause_menu__button').onclick = closePauseMenu
document.querySelector('.menu__button').onclick = closeMenu

export default {
  openPauseMenu,
  closePauseMenu,
  openMenu,
  closeMenu
}
