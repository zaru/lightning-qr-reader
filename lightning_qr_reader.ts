export class LightningQrReader {
  readonly document: HTMLDocument
  readonly video: HTMLVideoElement
  readonly canvas: HTMLCanvasElement

  constructor(document: HTMLDocument) {
    this.document = document
    this.video = this.document.getElementById('video') as HTMLVideoElement
    this.canvas = this.document.getElementById('canvas') as HTMLCanvasElement
  }

  capture(callback: BlobCallback) {
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
    this.canvas.toBlob(callback)
  }

  getStream() {
    const config = {
      video: {
        audio: false,
        facingMode: { exact: 'environment' }
      }
    }
    return navigator.mediaDevices.getUserMedia(config)
  }

  async showStream() {
    const stream = await this.getStream()
    this.video.srcObject = stream
    this.video.addEventListener('loadedmetadata', () => {
      this.adjustCanvasSize()
      this.video.play()
    })
  }

  adjustCanvasSize() {
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight
  }
}
