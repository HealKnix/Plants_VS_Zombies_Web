import * as Plants from '/src/models/Plants'
import * as Zombie from '/src/models/Zombies'

let suns = 0
let deltaTime = 0

const map = [
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  },
  {
    plantsArray: new Array(),
    zombiesArray: new Array()
  }
]

let floor_row = document.querySelectorAll('.floor__row')

floor_row.forEach(row => {
  ;[...row.children].forEach(ceil => {
    ceil.addEventListener('click', e => {
      if (ceil.classList.contains('planted') || ceil.classList.contains('zombie_spawner')) return

      map[parseInt(row.id)].plantsArray.push(new Plants.Peashooter(ceil))
    })
  })
})

requestAnimationFrame(function selectedCeil() {
  map.forEach(lane => {
    lane.plantsArray.forEach(plant => {
      if (
        lane.zombiesArray.length > 0 &&
        lane.zombiesArray.some(
          zombie =>
            zombie.htmlElement.getBoundingClientRect().x +
              zombie.htmlElement.getBoundingClientRect().width / 3 >
            plant.htmlElement.getBoundingClientRect().x
        )
      ) {
        plant.shoot()
      }
      plant.updateBullet()
    })
    lane.zombiesArray.forEach(zombie => {
      zombie.walk()
      zombie.checkHit(lane.plantsArray)
    })
    if (lane.zombiesArray.some(zombie => zombie.health === 0))
      lane.zombiesArray = lane.zombiesArray.filter(zombie => zombie.health !== 0)
  })
  requestAnimationFrame(selectedCeil)
})

let zombieSpawners = document.querySelectorAll('.zombie_spawner')

zombieSpawners.forEach(spawn => {
  spawn.addEventListener('click', e => {
    let newElement = document.createElement('div')
    newElement.classList.add('zombie')

    spawn.appendChild(newElement)

    map[parseInt(spawn.id)].zombiesArray.push(new Zombie.RegularZombie(newElement))

    console.log(map)
  })
})
