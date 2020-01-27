export class Camera {
  readonly document: HTMLDocument
  readonly video: HTMLVideoElement
  readonly canvas: HTMLCanvasElement

  constructor(document: HTMLDocument) {
    this.document = document
    this.video = this.document.getElementById('video') as HTMLVideoElement
    this.canvas = this.document.getElementById('canvas') as HTMLCanvasElement
  }

  capture(): Uint8ClampedArray {
    const ctx = this.canvas.getContext('2d')
    ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
    return ctx.getImageData(0, 0, this.video.videoWidth, this.video.videoHeight).data
  }

  async showStream(): Promise<void> {
    this.video.srcObject = await this._getStream()
    this.video.addEventListener('loadedmetadata', () => {
      this._adjustCanvasSize()
      this.video.play()
    })
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
