import * as Game from '/src/views/Game';
import Menu from '/src/assets/js/Menu';
import { currentSaveData } from '/src/store/gameStore';
import { mainHTML } from '/main';
import { clearAllGameTimeouts } from '/src/models/GameTimeout';
import { clearAllGameIntervals } from '/src/models/GameInterval';
import { music, soundFX } from '/src/assets/js/Music';
import MusicMainTheme from '/src/music/main_theme.mp3';
import { currentRoute } from '/src/router/routes';

export function render() {
  currentRoute.value = 'SELECTOR_SCREEN';

  let html = /*html*/ `
    <div class='selector_screen' id='selector_screen'>
      <div class='selector_screen__center'></div>
      <div class='selector_screen__left'>
        <a class='achievements_pedestal tap' href='#achievement_section'></a>
      </div>
      <div class='selector_screen__right'>
        <div class='selector_screen_button_adventure btn_press'></div>
        <div class='selector_screen_button_minigames btn_press disabled'></div>
        <div class='selector_screen_button_challenges btn_press disabled'></div>
        <div class='selector_screen_button_survival btn_press disabled'></div>
        <div class='selector_screen_options tap'></div>
        <div class='selector_screen_help tap'></div>
        <div class='selector_screen_quit tap'></div>
        <div class='selector_screen__leaves tap'></div>
      </div>
      <div class="selector_screen_woodsign__wrapper">
        <div class="selector_screen_woodsign_welcome">
          <span class='selector_screen_woodsign_welcome__user-name'>${
            currentSaveData.userName.value + '!'
          }</span>
        </div>
        <div class="selector_screen_woodsign_user tap"></div>
      </div>
      <div id='achievement_section' class='selector_screen_achievement_section'>
        <div class="selector_screen_achievement_top">
          <a class="selector_screen_achievement_back tap" href='#selector_screen'></a>
        </div>
  `;
  for (let i = 0; i < 40; i++) {
    html += /*html*/ `
        <div class="selector_screen_achievement_tile"></div>
    `;
  }
  html += /*html*/ `
        <div class="selector_screen_achievement_china"></div>
      </div>
    </div>
  `;

  mainHTML.innerHTML = html;

  document.querySelectorAll('.tap').forEach((element) => {
    element.onclick = () => {
      soundFX.object.sounds.tap.play();
    };
  });

  document.querySelector('.selector_screen_options').onclick = () => {
    soundFX.object.sounds.tap.play();
    Menu.openMenu();
  };

  clearAllGameTimeouts();
  clearAllGameIntervals();

  Game.resetGame();

  music.object.src = MusicMainTheme;
  music.object.play();

  // Menu.closePauseMenu()
  // Menu.closeMenu()

  // Для всех ссылок делаем плавный скролл до якоря
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelector('.selector_screen_button_adventure').onclick = Game.render;
}
