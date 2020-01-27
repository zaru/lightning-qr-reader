import { Camera } from './camera'

window.onload = (): void => {
  const resultElm = document.getElementById('result') as HTMLTextAreaElement
  const canvasElm = document.getElementById('canvas') as HTMLCanvasElement

  const reader = new Camera(window)
  reader.updateCallback = (result): void => {
    resultElm.value = result.join("\n")
    resultElm.scrollTop = resultElm.scrollHeight
    console.log(result)
    canvasElm.classList.add('fadeoutin')
  }
  reader.showStream()

  canvasElm.addEventListener('animationend', () => {
    canvasElm.classList.remove('fadeoutin')
  })

  document.getElementById('copy').addEventListener('click', () => {
    resultElm.select()
    document.execCommand('copy')
  })
}
