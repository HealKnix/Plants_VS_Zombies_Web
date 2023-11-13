import { setGameTimeout } from '/src/models/GameTimeout'
import { setGameInterval } from '/src/models/GameInterval'
import ZombieStartSound from '/src/music/zombies_start.mp3'
import * as Zombie from '/src/models/Zombies'

const zombiesArray = [Zombie.RegularZombie, Zombie.ConeheadZombie]

export default (startDelay, map) => {
  setGameTimeout(() => {
    // Для спавна зомби на уровне
    setGameInterval(() => {
      const randomLane = Math.floor(Math.random() * map.length)

      const newElement = document.createElement('div')
      const newZombie = new zombiesArray[Math.floor(Math.random() * 2)](newElement)

      let zombieSpawners = document.querySelectorAll('.zombie_spawner')
      zombieSpawners[randomLane].appendChild(newElement)

      map[randomLane].zombiesArray.push(newZombie)
    }, startDelay + 7500)
    // Для проигрывания звука перед началом атаки Зомби
    setGameTimeout(() => {
      const zombieStartSound = new Audio(ZombieStartSound)
      zombieStartSound.volume = 0.5
      zombieStartSound.play()
    }, startDelay + 7500)
  }, startDelay + 15000)
}
