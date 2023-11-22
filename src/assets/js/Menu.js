import { Howler } from 'howler'

import { setGameTimeout } from '/src/models/GameTimeout'
import { gameStatus } from '/main'
import { music, soundFX } from '/src/assets/js/Music'

const openMenuSound = soundFX.object.sounds.openMenuSound
const buttonClickSound = soundFX.object.sounds.buttonClickSound

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
  }

  Howler.mute(true)

  music.object.pause()
}

function closePauseMenu() {
  gameStatus.isPaused.value = false

  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'running'
    })
  }

  Howler.mute(false)

  if (gameStatus.isStart) music.object.play()
}

function openMenu() {
  if (gameStatus.isMenu.value) return
  gameStatus.isMenu.value = true

  openMenuSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'paused'
    })
  }

  Howler.mute(true)

  music.object.pause()
}

function closeMenu() {
  gameStatus.isMenu.value = false

  buttonClickSound.play()

  if (!isAllAnimationStylesDelete) {
    allAnimationsOnLevel.forEach(animation => {
      animation.style.animationPlayState = 'running'
    })
  }

  Howler.mute(false)

  if (gameStatus.isStart) music.object.play()
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
