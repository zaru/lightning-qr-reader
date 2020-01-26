console.log('hello world')

class LightningQrReader {
  readonly document: HTMLDocument
  readonly video: HTMLVideoElement
  readonly canvas: HTMLCanvasElement

  constructor(document: HTMLDocument) {
    this.document = document
    this.video = this.document.getElementById('video') as HTMLVideoElement
    this.canvas = this.document.getElementById('canvas') as HTMLCanvasElement
  }

  takePhotosContinuously() {
    this.capture(blob => {
      const img = new Image()
      img.src = URL.createObjectURL(blob)
    })
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
      this.video.play()
    })
  }
}

class ContinuousShootPlayer{
  constructor(document: HTMLDocument) {
    const lightningQrReader = new LightningQrReader(document)
    lightningQrReader.showStream()
  }

  start() {

  }

  stop() {

  }

  appendPicture() {

  }
}


window.onload = () => {
  const player = new ContinuousShootPlayer(document)
}
