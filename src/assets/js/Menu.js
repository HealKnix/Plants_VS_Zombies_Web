import { Howler } from 'howler'

import { rel } from '/src/models/Relation'
import { currentSaveData } from '/src/store/gameStore'

import Menu from '/src/assets/js/Menu'
import * as Game from '/src/views/Game'
import { mainHTML } from '/main'
import { setGameTimeout, clearAllGameTimeouts } from '/src/models/GameTimeout'
import { clearAllGameIntervals } from '/src/models/GameInterval'
import { gameStatus, render, resetGame, gameUpdateLogic } from '/src/views/Game'
import { music, soundFX } from '/src/assets/js/Music'
import { isAllAnimationStylesDelete } from '/src/assets/js/StartLevelText'

import MusicMainTheme from '/src/music/main_theme.mp3'

const openMenuSound = soundFX.object.sounds.openMenuSound
const buttonClickSound = soundFX.object.sounds.buttonClickSound

const allAnimationsOnLevel = document.querySelectorAll('.animated')

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

document.querySelector('.pause_menu__button').onclick = closePauseMenu
document.querySelector('.menu__button').onclick = closeMenu

document.querySelector('#FullScreen').addEventListener('change', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
})

document.querySelector('.button__main_menu').onclick = () => {
  mainHTML.innerHTML = /*html*/ `
    <div class='selector_screen' id='selector_screen'>
      <div class='selector_screen__center'></div>
      <div class='selector_screen__left'>
        <a class='achievements_pedestal' href='#achievement_section'></a>
      </div>
      <div class='selector_screen__right'>
        <div class='selector_screen_button_adventure btn_press'></div>
        <div class='selector_screen_button_minigames btn_press disabled'></div>
        <div class='selector_screen_button_challenges btn_press disabled'></div>
        <div class='selector_screen_button_survival btn_press disabled'></div>
        <div class='selector_screen_options'></div>
        <div class='selector_screen_help'></div>
        <div class='selector_screen_quit'></div>
        <div class='selector_screen__leaves'></div>
      </div>
      <div class="selector_screen_woodsign__wrapper">
        <div class="selector_screen_woodsign_welcome">
          <span class='selector_screen_woodsign_welcome__user-name'>${
            currentSaveData.userName.value + '!'
          }</span>
        </div>
        <div class="selector_screen_woodsign_user"></div>
      </div>
      <div id='achievement_section' class='selector_screen_achievement_section'>
        <div class="selector_screen_achievement_top">
          <a class="selector_screen_achievement_back" href='#selector_screen'></a>
        </div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_tile"></div>
        <div class="selector_screen_achievement_china"></div>
      </div>
    </div>
  `

  clearAllGameTimeouts()
  clearAllGameIntervals()

  resetGame()
  gameStatus.isExit = true

  music.object.src = MusicMainTheme

  closePauseMenu()
  closeMenu()

  // Для всех ссылок делаем плавный скролл до якоря
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' })
    })
  })

  document.querySelector('.selector_screen_button_adventure').onclick = Game.render
}

export default {
  openPauseMenu,
  closePauseMenu,
  openMenu,
  closeMenu
}
