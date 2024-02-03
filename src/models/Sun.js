import { setGameTimeout } from '/src/models/GameTimeout';
import { gameStatus, deltaTime } from '/src/views/Game';
import { soundFX } from '/src/assets/js/Music';

export class Sun {
  pickupSound = soundFX.object.sounds.sunPickupSound;
  currentTime = 0;
  lifeTime = 8000;
  capacity = 0;
  goalY = 0;
  isFall = false;
  htmlElement = null;
  isClicked = false;
  allTimeouts = new Array();
  posX = 0;
  posY = 0;

  createNewSun() {
    if (this.htmlElement.classList.contains('sun_from_sunflower')) return;

    setGameTimeout(() => {
      const newElement = document.createElement('div');
      newElement.classList.add('sun_from_level', 'sun');

      const randomX = Math.floor(Math.random() * 68 + 12);

      const newSun = new Sun(newElement, randomX, 18, 25);

      newSun.goalY = Math.floor(Math.random() * 70 + 20);
      newSun.isFall = true;

      gameStatus.sunsArray.push(newSun);
    }, 5000);
  }

  constructor(htmlElement, x, y, capacity) {
    this.htmlElement = htmlElement;
    this.posX = x;
    this.posY = y;
    this.capacity = capacity;

    this.htmlElement.setAttribute('style', `left: ${this.posX}%; top: ${this.posY}%`);

    this.htmlElement.addEventListener('click', () => {
      const goal = document.querySelector('.seed_bar__suns_present__sun');
      this.htmlElement.style.transition = '0.65s ease-in-out';

      this.htmlElement.style.left = `calc(${
        goal.getBoundingClientRect().x -
        document.querySelector('.main__wrapper').getBoundingClientRect().x
      }px + 4.5vh)`;
      this.htmlElement.style.top = `calc(${
        goal.getBoundingClientRect().y -
        document.querySelector('.main__wrapper').getBoundingClientRect().y
      }px + 4.5vh)`;

      this.htmlElement.style.opacity = `0.2`;
      this.htmlElement.style.pointerEvents = 'none';

      this.pickupSound.play();

      this.isClicked = true;
      this.isFall = false;

      this.allTimeouts.push(
        setGameTimeout(() => {
          gameStatus.suns.value += this.capacity;
          this.destroy();
        }, 650),
      );
    });

    document.querySelector('.main__wrapper').appendChild(this.htmlElement);
  }

  destroy() {
    this.createNewSun();
    this.htmlElement.parentElement.removeChild(this.htmlElement);
    this.htmlElement = null;
    this.allTimeouts.forEach(item => {
      item.clear();
    });
  }

  update() {
    if (!this.htmlElement) return;

    if (this.isFall) {
      this.posY += deltaTime * 5;
      this.htmlElement.style.top = `${this.posY}vh`;
      if (this.posY >= this.goalY) {
        this.isFall = false;
      }
      return;
    }
    this.currentTime += deltaTime * 1000;
    if (this.currentTime >= this.lifeTime) {
      if (this.isClicked) return;
      this.destroy();
      return;
    }
  }
}
