import { Scene } from 'phaser'
import sky from '@/game/assets/sky2.png'
import bomb from '@/game/assets/bomb.png'
import ground from '@/game/assets/platform.png'
import star from '@/game/assets/star.png'
import dude from '@/game/assets/dude.png'
import thudMp3 from '@/game/assets/thud.mp3'
import thudOgg from '@/game/assets/thud.ogg'
import tiles from '@/game/assets/tilesets/buch-tileset-48px-extruded.png'
import player from '@/game/assets/spritesheets/buch-characters-64px-extruded.png'
import sword from '@/game/assets/sword.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', sky);
    this.load.image('ground', ground);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', 
        dude,
        { frameWidth: 32, frameHeight: 48 }
    );
    this.load.audio('thud', [thudMp3, thudOgg])
    this.load.image("tiles", tiles);
    this.load.spritesheet(
      "characters",
      player,
      {
        frameWidth: 64,
        frameHeight: 64,
        margin: 1,
        spacing: 2
      }
    );

    this.load.image("sword",sword);
  }

  create () {
    this.scene.start('PlayScene')
  }
}
