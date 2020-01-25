console.log('hello world')

function getStream() {
  const config = {
    video: {
      audio: false,
      facingMode: { exact: 'environment' }
    }
  }
  return navigator.mediaDevices.getUserMedia(config)
}

async function showStream() {
  const stream = await getStream()
  const video = document.getElementById('video') as HTMLVideoElement
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}

window.onload = () => {
  showStream()
}
