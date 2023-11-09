import SelectSeedPacketSound from '../music/seed_packet_sound.mp3'

export class SeedPacket {
  selectSound = new Audio(SelectSeedPacketSound)
  plant = null
  htmlElement = null
  cost = 0
}
