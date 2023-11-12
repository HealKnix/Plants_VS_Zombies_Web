import { deltaTime } from '/main'

export class GameInterval {
  constructor(option) {
    this.durationTime = 0
    this.option = Object.assign(option, {
      callback: option.callback,
      goalTime: option.goalTime
    })
  }

  method() {
    this.durationTime += deltaTime * 1000
    if (this.durationTime >= this.option.goalTime) {
      this.option.callback()
      this.durationTime = 0
    }
  }
}

export const gameIntervalsArray = new Array()

export function setGameInterval(callback, ms) {
  gameIntervalsArray.push(
    new GameInterval({
      callback: callback,
      goalTime: ms
    })
  )
}
