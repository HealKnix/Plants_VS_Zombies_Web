import { rel } from '/src/models/Relation'

import { Howl, Howler } from 'howler'

import MusicMainTheme from '/src/music/main_theme.mp3'
import MusicDayTimeTheme from '/src/music/daytime_theme.mp3'

import SeedPacketSound from '/src/music/seed_packet_sound.mp3'
import ShovelSound from '/src/music/shovel.mp3'
import LawnMowerSound from '/src/music/lawn_mower.mp3'
import ShovelDiggingSound from '/src/music/planting_sound_2.mp3'
import OpenPauseMenuSound from '/src/music/pause.mp3'
import ButtonClickSound from '/src/music/button_click.mp3'
import ReadySetPlantSound from '/src/music/ready_set_plant.mp3'
import ZombieStartSound from '/src/music/zombies_start.mp3'
import CoinSound from '/src/music/coin.mp3'
import PlantingSound1 from '/src/music/planting_sound_1.mp3'
import PlantingSound2 from '/src/music/planting_sound_2.mp3'
import SnowPeaSparklesSound from '/src/music/snow_pea_sparkles.mp3'
import CherryExplodeSound from '/src/music/cherry_explode.mp3'
import SelectSeedPacketSound from '/src/music/seed_packet_sound.mp3'
import SunPickupSound from '/src/music/sun_pickup.mp3'
import HitSound1 from '/src/music/zombies_hit_1.mp3'
import HitSound2 from '/src/music/zombies_hit_2.mp3'
import ChompSound1 from '/src/music/zombie_chomp_1.mp3'
import ChompSound2 from '/src/music/zombie_chomp_2.mp3'
import Moneyfalls from '/src/music/moneyfalls.mp3'
import Diamond from '/src/music/diamond.mp3'
import Tap from '/src/music/tap.mp3'

////////? Music ////////
const musicSliderHtml = document.querySelector('#Music')

export const music = rel(new Audio(MusicMainTheme), 'volume', value => {
  musicSliderHtml.value = value
})
music.value = 0.25
music.object.play()

music.object.addEventListener('ended', () => {
  music.object.play()
})

musicSliderHtml.addEventListener('change', () => {
  music.value = musicSliderHtml.value
})
//////////////////////////?END Music

////////? SoundFX ////////
const soundFXSliderHtml = document.querySelector('#SoundFX')

export const soundFX = rel(
  {
    sounds: {
      seedPacketSound: new Howl({
        src: [SeedPacketSound]
      }),
      shovelSound: new Howl({
        src: [ShovelSound]
      }),
      lawnMowerSound: new Howl({
        src: [LawnMowerSound]
      }),
      shovelDiggingSound: new Howl({
        src: [ShovelDiggingSound]
      }),
      openMenuSound: new Audio(OpenPauseMenuSound),
      buttonClickSound: new Howl({
        src: [ButtonClickSound]
      }),
      readySetPlantSound: new Howl({
        src: [ReadySetPlantSound]
      }),
      zombieStartSound: new Howl({
        src: [ZombieStartSound]
      }),
      coinSound: new Howl({
        src: [CoinSound]
      }),
      plantingSound1: new Howl({
        src: [PlantingSound1]
      }),
      plantingSound2: new Howl({
        src: [PlantingSound2]
      }),
      snowPeaSparklesSound: new Howl({
        src: [SnowPeaSparklesSound]
      }),
      cherryExplodeSound: new Howl({
        src: [CherryExplodeSound]
      }),
      selectSeedPacketSound: new Howl({
        src: [SelectSeedPacketSound]
      }),
      sunPickupSound: new Howl({
        src: [SunPickupSound]
      }),
      hitSound1: new Howl({
        src: [HitSound1]
      }),
      hitSound2: new Howl({
        src: [HitSound2]
      }),
      chompSound1: new Howl({
        src: [ChompSound1]
      }),
      chompSound2: new Howl({
        src: [ChompSound2]
      }),
      moneyfalls: new Howl({
        src: [Moneyfalls]
      }),
      diamond: new Howl({
        src: [Diamond]
      }),
      tap: new Howl({
        src: [Tap]
      })
    },
    volume: 0.185
  },
  'volume',
  value => {
    Howler.volume(value)
    soundFXSliderHtml.value = value
  }
)

soundFXSliderHtml.addEventListener('change', () => {
  soundFX.object.sounds.openMenuSound.volume = soundFXSliderHtml.value
  Howler.volume(soundFXSliderHtml.value)
})

soundFX.object.sounds.openMenuSound.volume = soundFXSliderHtml.value
//////////////////////////?END SoundFX
