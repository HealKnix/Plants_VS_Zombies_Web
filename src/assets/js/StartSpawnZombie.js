import { setGameTimeout } from '/src/models/GameTimeout';
import { setGameInterval } from '/src/models/GameInterval';
import * as Zombie from '/src/models/Zombies';
import { soundFX } from '/src/assets/js/Music';
import { awards } from '../../models/Awards';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export let level = null;

export default (startDelay, curLevel, levelMap) => {
  const zombieStartSound = soundFX.object.sounds.zombieStartSound;

  level = {
    '1-1': {
      zombies: {
        array: [Zombie.RegularZombie],
        count: 6,
      },
      award: awards.sunflowerSeed,
      delayBetweenSpawnOne: 9000,
      delayBetweenSpawnTwo: 10000,
    },
    '1-2': {
      zombies: {
        array: [Zombie.RegularZombie, Zombie.ConeheadZombie],
        count: 12,
      },
      award: awards.cherryBombSeed,
      delayBetweenSpawnOne: 9000,
      delayBetweenSpawnTwo: 10000,
    },
  };

  setGameTimeout(() => {
    // Для спавна зомби на уровне
    setGameInterval(
      () => {
        if (level[curLevel].zombies.count <= 0) return;
        level[curLevel].zombies.count -= 1;

        const randomLane = Math.floor(Math.random() * levelMap.length);

        const newElement = document.createElement('div');
        const newZombie = new level[curLevel].zombies.array[
          Math.floor(Math.random() * level[curLevel].zombies.array.length)
        ](newElement);

        let zombieSpawners = document.querySelectorAll('.zombie_spawner');
        zombieSpawners[randomLane].appendChild(newElement);

        levelMap[randomLane].zombiesArray.push(newZombie);
      },
      getRandom(level[curLevel].delayBetweenSpawnOne, level[curLevel].delayBetweenSpawnTwo),
    );
    // Для проигрывания звука перед началом атаки Зомби
    setGameTimeout(
      () => {
        zombieStartSound.play();
      },
      getRandom(level[curLevel].delayBetweenSpawnOne, level[curLevel].delayBetweenSpawnTwo),
    );
  }, startDelay + 17000);
};
