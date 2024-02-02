import { setGameTimeout } from '/src/models/GameTimeout';
import { gameStatus } from '/src/views/Game';
import { soundFX } from '/src/assets/js/Music';
import MusicDayTimeTheme from '/src/music/daytime_theme.mp3';

export const readySetPlantSound = soundFX.object.sounds.readySetPlantSound;
export let isAllAnimationStylesDelete = false;

export function start(startLevelDelay, music) {
  isAllAnimationStylesDelete = false;
  music.object.pause();
  music.object.src = MusicDayTimeTheme;

  setGameTimeout(() => {
    readySetPlantSound.play();
    const startWrapperText = document.querySelector('.ready_set_plant');
    const startText = document.querySelector('.ready_set_plant__text');

    startText.style.display = 'block';
    startWrapperText.style.display = 'flex';
    startText.innerText = 'Ready...';

    startText.style.animationName = 'scaleStartText1';
    startText.style.opacity = '1';
    setGameTimeout(() => {
      startText.style.animationName = 'scaleStartText2';
      startText.innerText = 'Set...';
      setGameTimeout(() => {
        startText.style.animationName = 'scaleStartText3';
        startText.innerText = 'PLANT!';
        setGameTimeout(() => {
          startText.style.display = 'none';
          startWrapperText.style.display = 'none';

          music.object.src = MusicDayTimeTheme;
          music.object.play();
          gameStatus.isStart = true;

          // Показываем игровой интерфейс
          document.querySelector('.level_menu_button').classList.add('show');
          document.querySelector('.seed_bar').classList.add('show');
          document.querySelector('.shovel_panel').classList.add('show');
          document.querySelectorAll('.lawn_mower').forEach(animation => {
            animation.classList.add('show');
          });

          const allTransitionOnLevel = document.querySelectorAll('.show');
          // Через 500 мс. удаляем transition со всех показанных интерфейсов
          setGameTimeout(() => {
            allTransitionOnLevel.forEach(animation => {
              animation.style.transition = 'none';
            });
          }, 500);

          const allAnimationsOnLevel = document.querySelectorAll('.animated');
          setGameTimeout(() => {
            allAnimationsOnLevel.forEach(animation => {
              animation.style.animation = 'none';
            });
            isAllAnimationStylesDelete = true;
          }, 2000);
        }, 650);
      }, 650);
    }, 650);
  }, startLevelDelay);
}
