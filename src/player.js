const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

function createPlayer(songsDirectory) {
  let audioProcess = null
  let paused = false
  let volume = 70
  let currentSong = null

  function play(song) {
    const filePath = path.join(songsDirectory, song.file)

    if (!fs.existsSync(filePath)) {
      throw new Error(`Song file not found: ${filePath}`)
    }

    stop()
    audioProcess = spawn('afplay', ['-v', String(volume / 100), filePath], { stdio: 'ignore' })
    paused = false
    currentSong = song

    const startedProcess = audioProcess

    audioProcess.on('error', () => {
      if (audioProcess !== startedProcess) return
      console.log('Could not start afplay. Make sure this application is running on macOS.')
      clearState()
    })

    audioProcess.on('close', () => {
      if (audioProcess === startedProcess) clearState()
    })
  }

  function pause() {
    if (!audioProcess || paused) return false
    audioProcess.kill('SIGSTOP')
    paused = true
    return true
  }

  function resume() {
    if (!audioProcess || !paused) return false
    audioProcess.kill('SIGCONT')
    paused = false
    return true
  }

  function stop() {
    if (audioProcess) audioProcess.kill('SIGTERM')
    clearState()
  }

  function replay(song) {
    play(song)
  }

  function changeVolume(amount) {
    const nextVolume = Math.max(0, Math.min(100, volume + amount))
    if (nextVolume === volume) return volume

    volume = nextVolume
    if (currentSong) {
      const wasPaused = paused
      play(currentSong)
      if (wasPaused) pause()
    }
    return volume
  }

  function clearState() {
    audioProcess = null
    paused = false
    currentSong = null
  }

  function getVolume() {
    return volume
  }

  return { play, pause, resume, stop, replay, changeVolume, getVolume }
}

module.exports = createPlayer
