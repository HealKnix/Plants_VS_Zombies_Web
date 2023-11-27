import { setGameInterval } from '/src/models/GameInterval'
import { setGameTimeout } from '/src/models/GameTimeout'
import { Sun } from '/src/models/Sun'
import { gameStatus } from '/src/views/Game'

export default startDelay => {
  setGameTimeout(() => {
    setGameTimeout(() => {
      const newElement = document.createElement('div')
      newElement.classList.add('sun_from_level', 'sun')

      const randomX = Math.floor(Math.random() * 68 + 12)

      const newSun = new Sun(newElement, randomX, 18, 25)

      newSun.goalY = Math.floor(Math.random() * 70 + 20)
      newSun.isFall = true

      gameStatus.sunsArray.push(newSun)
    }, 5000)
  }, startDelay + 2000)
}
