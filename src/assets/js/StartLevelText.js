import { setGameTimeout } from '/src/models/GameTimeout'
import { gameStatus } from '/main'

import ReadySetPlantSound from '/src/music/ready_set_plant.mp3'

export const readySetPlantSound = new Audio(ReadySetPlantSound)

export function start(startLevelDelay, musicLevel) {
  setGameTimeout(() => {
    readySetPlantSound.play()
    const startWrapperText = document.querySelector('.ready_set_plant')
    const startText = document.querySelector('.ready_set_plant__text')
    startText.style.animationName = 'scaleStartText1'
    startText.style.opacity = '1'
    setGameTimeout(() => {
      startText.style.animationName = 'scaleStartText2'
      startText.innerText = 'Set...'
      setGameTimeout(() => {
        startText.style.animationName = 'scaleStartText3'
        startText.innerText = 'PLANT!'
        setGameTimeout(() => {
          startText.style.display = 'none'
          startWrapperText.style.display = 'none'

          musicLevel.object.play()
          gameStatus.isStart = true

          document.querySelector('.level_menu_button').classList.add('show')
          document.querySelector('.seed_bar').classList.add('show')
          document.querySelector('.shovel_panel').classList.add('show')
          document.querySelectorAll('.lawn_mower').forEach(animation => {
            animation.classList.add('show')
          })
        }, 650)
      }, 650)
    }, 650)
  }, startLevelDelay)
}
