import { LightningQrReader } from './lightning_qr_reader'

class ContinuousShootPlayer{
  readonly document: HTMLDocument
  readonly reader: LightningQrReader
  private timerId
  private interval: number

  constructor(document: HTMLDocument) {
    this.document = document
    this.reader = new LightningQrReader(this.document)
    this.reader.showStream()
  }

  get intervalTime(): number {
    return this.interval
  }

  set intervalTime(msec) {
    this.interval = msec
  }

  start(): void {
    this._appendPicture()
    this.timerId = setInterval(() => {
      this._appendPicture()
    }, this.intervalTime)
  }

  stop(): void  {
    clearInterval(this.timerId)
  }

  _appendPicture(): void  {
    this.reader.capture(blob => {
      const img = new Image()
      img.src = URL.createObjectURL(blob)
      this.document.getElementById('photos').appendChild(img)
    })
  }
}

window.onload = (): void => {
  const player = new ContinuousShootPlayer(document)
  player.intervalTime = 1000

  document.getElementById('start').addEventListener('click', () => {
    player.start()
  })
  document.getElementById('stop').addEventListener('click', () => {
    player.stop()
  })
}
