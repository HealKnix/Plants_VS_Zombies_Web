export const mainHTML = document.querySelector('.main__wrapper');

import route from '/src/router/routes';
import * as Game from '/src/views/Game';
import Menu from '/src/assets/js/Menu';

// import Menu from '/src/assets/js/Menu'

// Для всех ссылок делаем плавный скролл до якоря
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

route.toSelectorScreen();

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!Game.gameStatus.isStart) return;
    if (Game.gameStatus.isPaused.value) {
      Menu.closePauseMenu();
      return;
    }
    if (!Game.gameStatus.isMenu.value) {
      Menu.openMenu();
    } else {
      Menu.closeMenu();
    }
  }
});

window.onblur = function () {
  if (!Game.gameStatus.isStart) return;
  Menu.openPauseMenu();
};
