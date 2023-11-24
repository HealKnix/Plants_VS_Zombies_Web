import { setGameTimeout } from '/src/models/GameTimeout'
import { setGameInterval } from '/src/models/GameInterval'
import * as Zombie from '/src/models/Zombies'
import { soundFX } from '/src/assets/js/Music'

const zombiesArray = [Zombie.RegularZombie, Zombie.ConeheadZombie]
const zombieStartSound = soundFX.object.sounds.zombieStartSound

export default (startDelay, levelMap) => {
  setGameTimeout(() => {
    // Для спавна зомби на уровне
    setGameInterval(() => {
      const randomLane = Math.floor(Math.random() * levelMap.length)

      const newElement = document.createElement('div')
      const newZombie = new zombiesArray[Math.floor(Math.random() * 2)](newElement)

      let zombieSpawners = document.querySelectorAll('.zombie_spawner')
      zombieSpawners[randomLane].appendChild(newElement)

      levelMap[randomLane].zombiesArray.push(newZombie)
    }, 11500)
    // Для проигрывания звука перед началом атаки Зомби
    setGameTimeout(() => {
      zombieStartSound.play()
    }, 11500)
  }, startDelay + 17000)
}
