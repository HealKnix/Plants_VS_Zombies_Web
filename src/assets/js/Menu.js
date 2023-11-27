import { Howler } from 'howler'
import { gameStatus } from '/src/views/Game'
import { music, soundFX } from '/src/assets/js/Music'
import { isAllAnimationStylesDelete } from '/src/assets/js/StartLevelText'
import * as GameMenu from '/src/components/modals/GameMenu'
import * as GamePauseMenu from '/src/components/modals/GamePauseMenu'
import { currentRoute } from '/src/router/routes'

const allAnimationsOnLevel = document.querySelectorAll('.animated')

function openPauseMenu() {
  if (
    gameStatus.isPaused.value ||
    gameStatus.isMenu.value ||
    currentRoute.value === 'SELECTOR_SCREEN'
  )
    return

  GamePauseMenu.open()

  gameStatus.isPaused.value = true

  soundFX.object.sounds.openMenuSound.play()

  Howler.mute(true)
  music.object.pause()
}

function closePauseMenu() {
  GamePauseMenu.close()

  gameStatus.isPaused.value = false

  soundFX.object.sounds.buttonClickSound.play()

  Howler.mute(false)
  music.object.play()
}

function openMenu() {
  if (gameStatus.isMenu.value) return

  GameMenu.open()

  gameStatus.isMenu.value = true

  if (currentRoute.value !== 'SELECTOR_SCREEN') {
    soundFX.object.sounds.openMenuSound.play()
    Howler.mute(true)
    music.object.pause()
  }
}

function closeMenu() {
  gameStatus.isMenu.value = false

  GameMenu.close()

  soundFX.object.sounds.buttonClickSound.play()

  if (currentRoute.value !== 'SELECTOR_SCREEN') {
    Howler.mute(false)
    music.object.play()
  }
}

export default {
  openPauseMenu,
  closePauseMenu,
  openMenu,
  closeMenu
}
