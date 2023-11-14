import OpenPauseMenuSound from '/src/music/pause.mp3'
import ButtonClickSound from '/src/music/button_click.mp3'

import { readySetPlantSound } from '/src/assets/js/StartLevelText'
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
  setGameTimeout(() => {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.transition = 'none'
    })
  }, 500)
}, 2000)

function openPauseMenu() {
  if (gameStatus.isPaused.value || gameStatus.isMenu.value) return

  gameStatus.isPaused.value = true

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
  gameStatus.isPaused.value = false

  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'running'
    })
    if (!gameStatus.isStart) readySetPlantSound.play()
  }

  if (gameStatus.isStart) musicLevel.object.play()
}

function openMenu() {
  if (gameStatus.isMenu.value) return
  gameStatus.isMenu.value = true

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
  gameStatus.isMenu.value = false

  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'running'
    })
    if (!gameStatus.isStart) readySetPlantSound.play()
  }

  if (gameStatus.isStart) musicLevel.object.play()
}

document.querySelector('.level_menu_button').onclick = openMenu
document.querySelector('.pause_menu__button').onclick = closePauseMenu
document.querySelector('.menu__button').onclick = closeMenu

export default {
  openPauseMenu,
  closePauseMenu,
  openMenu,
  closeMenu
}
