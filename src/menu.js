const readline = require('readline')

function createMenu() {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  function showSongs(songs, formatSong) {
    console.log(`================================
       TERMINAL MUSIC PLAYER
================================
`)
    songs.forEach((song, index) => console.log(formatSong(song, index)))
    console.log()
  }

  function ask(question) {
    return new Promise((resolve) => input.question(question, resolve))
  }

  function close() {
    input.close()
  }

  function startControls(handlers) {
    readline.emitKeypressEvents(process.stdin)
    if (process.stdin.isTTY) process.stdin.setRawMode(true)
    process.stdin.resume()

    const onKeypress = (str, key) => {
      const choice = str.toLowerCase()
      if (choice === 'p') handlers.pause()
      if (choice === 'r') handlers.resume()
      if (choice === '+') handlers.volumeUp()
      if (choice === '-') handlers.volumeDown()
      if (choice === 'l') handlers.replay()
      if (choice === 'q' || (key && key.ctrl && key.name === 'c')) handlers.quit()
    }

    process.stdin.on('keypress', onKeypress)

    return () => {
      process.stdin.removeListener('keypress', onKeypress)
      if (process.stdin.isTTY) process.stdin.setRawMode(false)
    }
  }

  return { showSongs, ask, close, startControls }
}

module.exports = createMenu
