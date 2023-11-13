import OpenPauseMenuSound from '/src/music/pause.mp3'
import ButtonClickSound from '/src/music/button_click.mp3'

import { readySetPlantSound, isReady } from '/src/assets/js/StartLevelText'
import { setGameTimeout } from '/src/models/GameTimeout'
import { gameStatus, musicLevel } from '/main'

const openMenuSound = new Audio(OpenPauseMenuSound)
const buttonClickSound = new Audio(ButtonClickSound)

const mainWrapperAnim = document.querySelector('.main__wrapper')
const seedBarAnim = document.querySelector('.seed_bar')
const shovelPanelAnim = document.querySelector('.shovel_panel')
const armorBrokenAnim = document.querySelectorAll('.armor_broken')
const lawnMowerAnim = document.querySelectorAll('.lawn_mower')
const readySetPlantTextAnim = document.querySelector('.ready_set_plant__text')

let isAllAnimationStylesDelete = false
setGameTimeout(() => {
  mainWrapperAnim.removeAttribute('style')
  seedBarAnim.removeAttribute('style')
  shovelPanelAnim.removeAttribute('style')
  armorBrokenAnim.forEach(anim => {
    anim.removeAttribute('style')
  })
  lawnMowerAnim.forEach(anim => {
    anim.removeAttribute('style')
  })
  readySetPlantTextAnim.removeAttribute('style')

  mainWrapperAnim.style.animation = 'none'
  seedBarAnim.style.animation = 'none'
  shovelPanelAnim.style.animation = 'none'
  armorBrokenAnim.forEach(anim => {
    anim.style.animation = 'none'
  })
  lawnMowerAnim.forEach(anim => {
    anim.style.animation = 'none'
  })
  readySetPlantTextAnim.style.animation = 'none'

  isAllAnimationStylesDelete = true
}, 12000)

function openPauseMenu() {
  if (gameStatus.isPaused || gameStatus.isMenu) return
  document.querySelector('.pause_menu__wrapper').classList.add('paused')
  gameStatus.isPaused = true

  openMenuSound.volume = 0.15
  openMenuSound.play()

  if (!isAllAnimationStylesDelete) {
    mainWrapperAnim.style.animationPlayState = 'paused'
    seedBarAnim.style.animationPlayState = 'paused'
    shovelPanelAnim.style.animationPlayState = 'paused'
    armorBrokenAnim.forEach(anim => {
      anim.style.animationPlayState = 'paused'
    })
    lawnMowerAnim.forEach(anim => {
      anim.style.animationPlayState = 'paused'
    })
    readySetPlantTextAnim.style.animationPlayState = 'paused'
    readySetPlantSound.pause()
  }

  musicLevel.object.pause()
}

function closePauseMenu() {
  document.querySelector('.pause_menu__wrapper').classList.remove('paused')
  gameStatus.isPaused = false

  buttonClickSound.volume = 0.25
  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    mainWrapperAnim.style.animationPlayState = 'running'
    seedBarAnim.style.animationPlayState = 'running'
    shovelPanelAnim.style.animationPlayState = 'running'
    armorBrokenAnim.forEach(anim => {
      anim.style.animationPlayState = 'running'
    })
    lawnMowerAnim.forEach(anim => {
      anim.style.animationPlayState = 'running'
    })
    readySetPlantTextAnim.style.animationPlayState = 'running'
    readySetPlantSound.pause()
    if (isReady) readySetPlantSound.play()
  }

  musicLevel.object.play()
}

function openMenu() {
  if (gameStatus.isMenu) return
  document.querySelector('.menu__wrapper').classList.add('active')
  gameStatus.isMenu = true

  openMenuSound.volume = 0.15
  openMenuSound.play()

  if (!isAllAnimationStylesDelete) {
    mainWrapperAnim.style.animationPlayState = 'paused'
    seedBarAnim.style.animationPlayState = 'paused'
    shovelPanelAnim.style.animationPlayState = 'paused'
    armorBrokenAnim.forEach(anim => {
      anim.style.animationPlayState = 'paused'
    })
    lawnMowerAnim.forEach(anim => {
      anim.style.animationPlayState = 'paused'
    })
    readySetPlantTextAnim.style.animationPlayState = 'paused'
    readySetPlantSound.pause()
  }

  readySetPlantSound.pause()
  musicLevel.object.pause()
}

function closeMenu() {
  document.querySelector('.menu__wrapper').classList.remove('active')
  gameStatus.isMenu = false

  buttonClickSound.volume = 0.25
  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    mainWrapperAnim.style.animationPlayState = 'running'
    seedBarAnim.style.animationPlayState = 'running'
    shovelPanelAnim.style.animationPlayState = 'running'
    armorBrokenAnim.forEach(anim => {
      anim.style.animationPlayState = 'running'
    })
    lawnMowerAnim.forEach(anim => {
      anim.style.animationPlayState = 'running'
    })
    readySetPlantTextAnim.style.animationPlayState = 'running'
    readySetPlantSound.pause()
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
