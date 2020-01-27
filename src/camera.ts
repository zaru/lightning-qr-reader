import jsQR from 'jsqr'

export class Camera {
  readonly window: Window
  readonly document: HTMLDocument
  readonly video: HTMLVideoElement
  readonly canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private result: string[]
  private callback: (result: string[]) => void

  constructor(window: Window) {
    this.window = window
    this.document = this.window.document
    this.video = this.document.getElementById('video') as HTMLVideoElement
    this.canvas = this.document.getElementById('canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')
    this.result = []
  }

  set updateCallback(callback: (result: string[]) => void) {
    this.callback = callback
  }

  async showStream(): Promise<void> {
    this.video.srcObject = await this._getStream()
    this.video.addEventListener('loadedmetadata', () => {
      this._adjustCanvasSize()
      this.video.play()
      this.window.requestAnimationFrame(() => this._syncCanvas())
    })
  }

  _drawBox(location, color): void {
    const rect = [
      [location.topLeftCorner, location.topRightCorner],
      [location.topRightCorner, location.bottomRightCorner],
      [location.bottomRightCorner, location.bottomLeftCorner],
      [location.bottomLeftCorner, location.topLeftCorner]
    ]
    rect.forEach(combi => {
      this.ctx.beginPath()
      this.ctx.moveTo(combi[0].x, combi[0].y)
      this.ctx.lineTo(combi[1].x, combi[1].y)
      this.ctx.lineWidth = 4
      this.ctx.strokeStyle = color
      this.ctx.stroke()
    })
  }

  _syncCanvas(): void {
    this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
    const data = this.ctx.getImageData(0, 0, this.video.videoWidth, this.video.videoHeight).data
    const code = jsQR(data, this.video.videoWidth, this.video.videoHeight)
    if (code) {
      this._drawBox(code.location, '#ff0000')
       if (!this.result.includes(code.data)) {
         this.result.push(code.data)
         this.callback(this.result)
       }
    }
    this.window.requestAnimationFrame(() => this._syncCanvas())
  }

  _getStream(): Promise<MediaStream> {
    const config = {
      video: {
        audio: false,
        facingMode: { exact: 'environment' }
      }
    }
    return navigator.mediaDevices.getUserMedia(config)
  }

  _adjustCanvasSize(): void {
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight
  }
}
