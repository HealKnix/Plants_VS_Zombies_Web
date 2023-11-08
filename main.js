import * as Plants from '/src/models/Plants'
import * as Zombie from '/src/models/Zombies'

let themeAudio = document.getElementById('music')
themeAudio.volume = 0.15

document.addEventListener('click', () => {
  themeAudio.play()
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

      if (ceil.children.length === 0) {
        ceil.style.backgroundImage = `url("${Plants.getPlantsImages().peashooter}")`
        ceil.style.opacity = `0.5`
      }
    })
    ceil.addEventListener('mouseleave', e => {
      if (ceil.classList.contains('planted') || ceil.classList.contains('zombie_spawner')) return

      if (ceil.children.length === 0) {
        ceil.removeAttribute('style')
      }
    })
    ceil.addEventListener('click', e => {
      if (ceil.classList.contains('planted') || ceil.classList.contains('zombie_spawner')) return

      ceil.removeAttribute('style')

      let newElement = document.createElement('div')
      newElement.classList.add('plant')

      ceil.appendChild(newElement)

      map[parseInt(row.id)].plantsArray.push(new Plants.Peashooter(newElement))

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

setInterval(() => {
  const randomLane = Math.floor(Math.random() * map.length)

  let newElement = document.createElement('div')
  newElement.classList.add('zombie')

  let healthBar = document.createElement('div')
  healthBar.classList.add('health_bar')

  newElement.appendChild(healthBar)

  zombieSpawners[randomLane].appendChild(newElement)

  map[randomLane].zombiesArray.push(new Zombie.RegularZombie(newElement))

  console.log(map)
}, 2500)
