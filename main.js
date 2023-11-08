import * as Plants from '/src/models/Plants'
import * as Zombie from '/src/models/Zombies'

document.addEventListener('DOMContentLoaded', function () {
  var audio = document.getElementById('music')
  audio.volume = 0.25

  audio.play()
})

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
    ceil.addEventListener('mouseenter', e => {
      if (ceil.classList.contains('planted') || ceil.classList.contains('zombie_spawner')) return

      ceil.style.backgroundImage = `url("${Plants.getPlantsImages().peashooter}")`
      ceil.style.opacity = `0.5`
    })
    ceil.addEventListener('mouseleave', e => {
      if (ceil.classList.contains('planted') || ceil.classList.contains('zombie_spawner')) return

      ceil.style.backgroundImage = `url("")`
      ceil.style.opacity = `1`
    })
    ceil.addEventListener('click', e => {
      if (ceil.classList.contains('planted') || ceil.classList.contains('zombie_spawner')) return

      map[parseInt(row.id)].plantsArray.push(new Plants.Peashooter(ceil))

      ceil.style.opacity = `1`
    })
  })
})

requestAnimationFrame(function selectedCeil() {
  map.forEach(lane => {
    lane.plantsArray.forEach(plant => {
      if (
        lane.zombiesArray.length > 0 &&
        lane.zombiesArray.some(zombie => {
          const centerOfZombie =
            zombie.htmlElement.getBoundingClientRect().x +
            zombie.htmlElement.getBoundingClientRect().width / 3
          const plantPosX = plant.htmlElement.getBoundingClientRect().x
          return centerOfZombie > plantPosX
        })
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

    let healthBar = document.createElement('div')
    healthBar.classList.add('health_bar')

    newElement.appendChild(healthBar)

    spawn.appendChild(newElement)

    map[parseInt(spawn.id)].zombiesArray.push(new Zombie.RegularZombie(newElement))
  })
})
