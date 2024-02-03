import { seedPacketsList } from './SeedPacket';

import ZenGarden from '/src/music/zen_garden.mp3';

import { setGameTimeout } from '/src/models/GameTimeout';
import { music, soundFX } from '../assets/js/Music';
import routes from '../router/routes';

export class Award {
  name = '';
  dropSound = new Audio();
  pickupSound = soundFX.object.sounds.seedPacketSound;
  htmlElement = null;
  gameTimeout = null;
  browserTimeout = null;

  constructor(name, description, image, method) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.method = method;
  }

  callMethod() {
    this.method();
  }

  destroy() {
    if (this.htmlElement) {
      this.htmlElement.parentElement.removeChild(this.htmlElement);
    }
    this.htmlElement = null;
    this.gameTimeout.clear();
    clearTimeout(this.browserTimeout);
  }

  playDropSound() {
    this.dropSound.play();
  }

  create(x, y, award) {
    this.playDropSound();

    const awardBackground = document.createElement('div');
    awardBackground.classList.add('award_bg');
    awardBackground.style.backgroundColor = 'transparent';

    const awardBlurBackground = document.createElement('div');
    awardBlurBackground.classList.add('award_bg_blur');

    this.htmlElement = document.createElement('div');
    document.querySelector('.main__wrapper').appendChild(awardBackground);
    document.querySelector('.main__wrapper').appendChild(awardBlurBackground);
    document.querySelector('.main__wrapper').appendChild(this.htmlElement);

    this.htmlElement.classList.add('award__wrapper');
    this.htmlElement.style.scale = '0.5';
    this.htmlElement.style.width = '6vh';
    this.htmlElement.style.cursor = 'pointer';
    this.htmlElement.style.position = 'absolute';
    this.htmlElement.innerHTML = this.image;

    this.htmlElement.addEventListener('click', () => {
      this.pickupSound.play();

      this.htmlElement.style.transition = '4s ease-in-out';

      this.htmlElement.style.left = `${
        document.querySelector('.main__wrapper').getBoundingClientRect().width / 2 -
        this.htmlElement.getBoundingClientRect().width
      }px`;
      this.htmlElement.style.top = `${
        document.querySelector('.main__wrapper').getBoundingClientRect().height / 2 -
        this.htmlElement.getBoundingClientRect().height
      }px`;

      music.object.pause();

      soundFX.object.sounds.victorySound.play();

      setTimeout(() => {
        awardBackground.style.backgroundColor = 'white';
        awardBlurBackground.style.width = '300vh';
        awardBlurBackground.style.height = '300vh';
      }, 2000);

      awardBackground.style.pointerEvents = 'all';
      awardBlurBackground.style.pointerEvents = 'all';
      this.htmlElement.style.scale = '1';
      this.htmlElement.style.top = '30vh';
      this.htmlElement.style.pointerEvents = 'none';

      this.gameTimeout = setGameTimeout(
        () => {
          soundFX.object.sounds.pickupAward.play();
          this.htmlElement.style.opacity = '0';
        },
        4250,
        true,
      );

      this.gameTimeout = setGameTimeout(
        () => {
          music.object.src = ZenGarden;
          music.object.play();
          this.destroy();
          routes.toAwardScreen(award);
        },
        9000,
        true,
      );
    });
    this.htmlElement.style.left = `${x}%`;
    this.htmlElement.style.top = `${y}%`;
  }
}

export const awards = {
  sunflowerSeed: new Award(
    seedPacketsList[1].option.plant.name,
    'Gives you additional sun',
    seedPacketsList[1].getSeedElement(),
    () => {},
  ),
  cherryBombSeed: new Award(
    seedPacketsList[2].option.plant.name,
    'Blows up all zombies in an area',
    seedPacketsList[2].getSeedElement(),
    () => {},
  ),
  wallNut: new Award(
    seedPacketsList[3].option.plant.name,
    'Blocks off zombies and protected your other plants',
    seedPacketsList[3].getSeedElement(),
    () => {},
  ),
  snowPea: new Award(
    seedPacketsList[4].option.plant.name,
    'Shoots frozen peas that damage and slow the enemy',
    seedPacketsList[4].getSeedElement(),
    () => {
      seedPacketsList[4].option.isAvailable = true;
    },
  ),
};

export function dropAward(x, y, award) {
  award.create(x, y, award);
}
