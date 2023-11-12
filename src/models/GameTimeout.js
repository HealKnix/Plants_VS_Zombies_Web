import { deltaTime } from '/main'

export class GameTimeout {
  constructor(option) {
    this.durationTime = 0
    this.isComplete = false
    this.option = Object.assign(option, {
      callback: option.callback,
      goalTime: option.goalTime
    })
  }

  method() {
    if (this.isComplete) return
    this.durationTime += deltaTime * 1000
    if (this.durationTime <= this.option.goalTime) return
    this.option.callback()
    this.isComplete = true
  }
}

export const gameTimeoutsArray = new Array()

export function setGameTimeout(callback, ms) {
  gameTimeoutsArray.push(
    new GameTimeout({
      callback: callback,
      goalTime: ms
    })
  )
}
