import Menu from '/src/assets/js/Menu';
import { currentRoute } from '/src/router/routes';
import { music, soundFX } from '/src/assets/js/Music';
import { musicSliderHtmlValue, soundFXSliderHtmlValue } from '/src/components/modals/GameMenu';

export function open() {
  if (currentRoute.value === 'AWARD_SCREEN') return;

  document.querySelector('Modal').innerHTML = /*html*/ `
    <div class="pause_menu__wrapper">
      <div class="pause_menu">
        <div class="pause_menu__title">
          <p class="pause_menu__title_text">GAME PAUSED</p>
          <img src="/src/images/zombies/newspaper_zombie.png" width="25%" />
          <p class="pause_menu__title_help">Click to resume game</p>
        </div>
        <div class="pause_menu__button__shadow"></div>
        <button class="pause_menu__button">RESUME GAME</button>
      </div>
    </div>
  `;

  music.value = musicSliderHtmlValue;
  soundFX.value = soundFXSliderHtmlValue;
  soundFX.object.sounds.openMenuSound.volume = soundFXSliderHtmlValue;

  document.querySelector('.pause_menu__button').onclick = Menu.closePauseMenu;
}

export function close() {
  document.querySelector('Modal').innerHTML = '';
}
