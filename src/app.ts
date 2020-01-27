import { Camera } from './camera'
import jsQR from 'jsqr'

class QrReader {
  readonly document: HTMLDocument
  readonly camera: Camera
  private timerId
  private interval: number
  private result: string[]
  private callback: (result: string[]) => void

  constructor(document: HTMLDocument) {
    this.document = document
    this.camera = new Camera(this.document)
    this.camera.showStream()
    this.result = []
  }

  get intervalTime(): number {
    return this.interval
  }

  set intervalTime(msec) {
    this.interval = msec
  }

  set updateCallback(callback: (result: string[]) => void) {
    this.callback = callback
  }

  start(): void {
    this._parseQR()
    this.timerId = setInterval(() => {
      this._parseQR()
    }, this.intervalTime)
  }

  stop(): void  {
    clearInterval(this.timerId)
  }

  _parseQR(): void  {
    const data = this.camera.capture()
    const code = jsQR(data, this.camera.video.videoWidth, this.camera.video.videoHeight)
    if (code && !this.result.includes(code.data)) {
      this.result.push(code.data)
      this.callback(this.result)
    }
  }
}

window.onload = (): void => {
  const resultElm = document.getElementById('result') as HTMLTextAreaElement

  const reader = new QrReader(document)
  reader.intervalTime = 1000
  reader.updateCallback = (result): void => {
    resultElm.value = result.join("\n")
    resultElm.scrollTop = resultElm.scrollHeight
    console.log(result)
  }

  document.getElementById('start').addEventListener('click', () => {
    reader.start()
  })
  document.getElementById('stop').addEventListener('click', () => {
    reader.stop()
  })
  document.getElementById('copy').addEventListener('click', () => {
    resultElm.select()
    document.execCommand('copy')
  })
}
