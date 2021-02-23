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
import dragonblue from '@/game/assets/dragonblue.png'
import dragonorrange from '@/game/assets/dragonorrange.png'
import coin from '@/game/assets/coin.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  init(data)
  {
      this.sceneToStart=data.startnamescene;
  }

  preload () {

    this.createLoadingBox();

    this.load.image('sky', sky);
    this.load.image('ground', ground);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet("dragonblue", dragonblue,  { frameWidth: 64, frameHeight: 64 });
    this.load.image("dragonorrange", dragonorrange);
    this.load.spritesheet('dude', 
        dude,
        { frameWidth: 32, frameHeight: 48 }
    );
    this.load.spritesheet('coin', coin, { frameWidth: 20, frameHeight: 20 });
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
    console.log(this.sceneToStart);
    this.scene.start(this.sceneToStart);
  }

  createLoadingBox()
  {
    var progressBar = this.add.graphics();
            var progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 270, 320, 50);
            
            var width = this.cameras.main.width;
            var height = this.cameras.main.height;
            var loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: 'Loading...',
                style: {
                    font: '20px monospace',
                    fill: '#ffffff'
                }
            });
            loadingText.setOrigin(0.5, 0.5);
            
            var percentText = this.make.text({
                x: width / 2,
                y: height / 2 - 5,
                text: '0%',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            percentText.setOrigin(0.5, 0.5);
            
            var assetText = this.make.text({
                x: width / 2,
                y: height / 2 + 50,
                text: '',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
 
            assetText.setOrigin(0.5, 0.5);
            
            this.load.on('progress', function (value) {
                percentText.setText(parseInt(value * 100) + '%');
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(250, 280, 300 * value, 30);
            });
            
            this.load.on('fileprogress', function (file) {
                assetText.setText('Loading asset: ' + file.key);
            });
 
            this.load.on('complete', function () {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                assetText.destroy();
            });
            
  }
}
