import route from '/src/router/routes'
import { currentRoute } from '/src/router/routes'
import Menu from '/src/assets/js/Menu'
import { music, soundFX } from '/src/assets/js/Music'

export let musicSliderHtml = null
export let musicSliderHtmlValue = 0.25

export let soundFXSliderHtml = null
export let soundFXSliderHtmlValue = 0.25

export let fullScreenCheckBoxHtml = null

export function open() {
  let html = /*html*/ `
    <div class="menu__wrapper">
      <div class="menu">
        <div class="menu__title">
          <label for="Music">
            <span>Music</span>
            <input type="range" min="0" max="0.75" step="0.001" value="0.25" id="Music" />
          </label>
          <br />
          <label for="SoundFX">
            <span>Sound FX</span>
            <input type="range" min="0" max="0.75" step="0.001" id="SoundFX" />
          </label>
          <br />
          <label for="3DAcceleration">
            <span>3D Acceleration</span>
            <input type="checkbox" id="3DAcceleration" />
          </label>
          <br />
          <label for="FullScreen">
            <span>Full Screen</span>
            <input type="checkbox" id="FullScreen" />
          </label>
          <br />
  `
  if (currentRoute.value === 'ADVENTURE') {
    html += /*html*/ `
          <div class="menu__title__buttons__wrapper">
            <button class="menu__title__button button__restart_level">
              <span>Restart Level</span>
            </button>
            <br />
            <button class="menu__title__button button__main_menu">
              <span>Main Menu</span>
            </button>
          </div>
        </div>
        <button class="menu__button button__back_to_game">
          <span>Back To Game</span>
        </button>
      </div>
    `
  } else if (currentRoute.value === 'SELECTOR_SCREEN') {
    html += /*html*/ `
        </div>
        <button class="menu__button button__back_to_game">
          <span>Back</span>
        </button>
      </div>
    `
  }
  html += /*html*/ `
    </div>
  `

  document.querySelector('Modal').innerHTML = html

  if (currentRoute.value === 'ADVENTURE') {
    document.querySelector('.button__restart_level').onclick = route.toAdventure
    document.querySelector('.button__main_menu').onclick = route.toSelectorScreen
  }

  document.querySelector('.button__back_to_game').onclick = Menu.closeMenu

  musicSliderHtml = document.querySelector('#Music')
  soundFXSliderHtml = document.querySelector('#SoundFX')
  fullScreenCheckBoxHtml = document.querySelector('#FullScreen')

  music.value = musicSliderHtmlValue
  musicSliderHtml.addEventListener('change', e => {
    music.value = musicSliderHtml.value
  })

  soundFX.value = soundFXSliderHtmlValue
  soundFX.object.sounds.openMenuSound.volume = soundFXSliderHtmlValue
  soundFXSliderHtml.addEventListener('change', e => {
    soundFX.value = soundFXSliderHtml.value
    soundFX.object.sounds.openMenuSound.volume = soundFXSliderHtml.value
    Howler.volume(soundFXSliderHtml.value)
  })

  musicSliderHtml.value = music.value
  soundFXSliderHtml.value = soundFX.value

  fullScreenCheckBoxHtml.addEventListener('change', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  })
}

export function close() {
  document.querySelector('Modal').innerHTML = ''
  musicSliderHtmlValue = music.value
  soundFXSliderHtmlValue = soundFX.value
}
