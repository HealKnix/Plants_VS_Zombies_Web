import * as Game from '/src/views/Game';
import { mainHTML } from '../../main';
import { awards } from '../models/Awards';
import { clearAllGameTimeouts } from '/src/models/GameTimeout';
import { clearAllGameIntervals } from '/src/models/GameInterval';
import { currentRoute } from '/src/router/routes';
import { music, soundFX } from '/src/assets/js/Music';
import ZenGarden from '/src/music/zen_garden.mp3';

export function render(award) {
  currentRoute.value = 'AWARD_SCREEN';

  mainHTML.innerHTML = /*html*/ `
    <div class="award_screen_bg"></div>

    <div class="award_screen__wrapper">
      <div class="award_screen__title">
        You got a new plant!
      </div>

      <div class="award_screen__image">
        ${award.image}
      </div>

      <div class="award_screen__name" style="textTransform: lowercase;">
        ${award.name}
      </div>

      <div class="award_screen__description">
        <span>
        ${award.description}
        </span>
      </div>

      <button class="award_screen__next_level_bth">
        Next Level!
      </button>
    </div> 
  `;

  document.querySelector('.award_bg').style.display = 'none';

  setTimeout(() => {
    document.querySelector('.award_screen_bg').style.backgroundColor = 'transparent';
    document.querySelector('.award_screen_bg').style.pointerEvents = 'none';
  }, 1);

  clearAllGameTimeouts();
  clearAllGameIntervals();

  Game.resetGame();

  document.querySelector('.award_screen__next_level_bth').onclick = () => {
    soundFX.object.sounds.tap.play();
    Howler.mute(true);
    music.object.pause();
    Game.render();
  };
}
