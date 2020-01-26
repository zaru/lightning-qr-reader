import { LightningQrReader } from './lightning_qr_reader'

class ContinuousShootPlayer{
  readonly document: HTMLDocument
  readonly reader: LightningQrReader
  private timerId

  constructor(document: HTMLDocument) {
    this.document = document
    this.reader = new LightningQrReader(this.document)
    this.reader.showStream()
  }

  start() {
    this._appendPicture()
    this.timerId = setInterval(() => {
      this._appendPicture()
    }, 1000)
  }

  stop() {
    clearInterval(this.timerId)
  }

  _appendPicture() {
    this.reader.capture(blob => {
      const img = new Image()
      img.src = URL.createObjectURL(blob)
      this.document.getElementById('photos').appendChild(img)
    })
  }
}


window.onload = () => {
  const player = new ContinuousShootPlayer(document)
  document.getElementById('start').addEventListener('click', () => {
    player.start()
  })
  document.getElementById('stop').addEventListener('click', () => {
    player.stop()
  })
}
