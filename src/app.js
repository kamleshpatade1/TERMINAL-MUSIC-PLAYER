const fs = require('fs')
const path = require('path')
const songs = require('./songs')
const createMenu = require('./menu')
const createPlayer = require('./player')
const { getSongsDirectory, formatSong } = require('./utils')

const songsDirectory = getSongsDirectory()
const menu = createMenu()
const player = createPlayer(songsDirectory)

async function run() {
  if (!fs.existsSync(songsDirectory)) {
    console.log(`Songs folder not found: ${songsDirectory}`)
    return
  }

  menu.showSongs(songs, formatSong)
  const answer = await menu.ask('Select a song: ')
  const selectedIndex = Number.parseInt(answer.trim(), 10) - 1
  const song = songs[selectedIndex]

  if (!song) {
    console.log('\nInvalid song number.')
    menu.close()
    return
  }

  try {
    player.play(song)
    console.log(`\n▶ Playing: ${song.title}`)
    console.log(`\nVolume: ${player.getVolume()}%`)
    console.log('\nP - Pause\nR - Resume\n+ - Volume Up\n- - Volume Down\nL - Replay\nQ - Quit')
  } catch (error) {
    console.log(`\nUnable to play song: ${error.message}`)
    menu.close()
    return
  }

  const stopControls = menu.startControls({
    pause: () => console.log(player.pause() ? '\nPaused' : '\nNothing is playing'),
    resume: () => console.log(player.resume() ? '\nResumed' : '\nNothing is paused'),
    volumeUp: () => console.log(`\nVolume: ${player.changeVolume(10)}%`),
    volumeDown: () => console.log(`\nVolume: ${player.changeVolume(-10)}%`),
    replay: () => {
      try {
        player.replay(song)
        console.log(`\n▶ Playing: ${song.title}`)
      } catch (error) {
        console.log(`\nUnable to replay song: ${error.message}`)
      }
    },
    quit: () => {
      stopControls()
      player.stop()
      menu.close()
      process.exit(0)
    }
  })
}

process.on('SIGINT', () => {
  player.stop()
  menu.close()
  process.exit(0)
})

run().catch((error) => {
  player.stop()
  menu.close()
  console.error(`Application error: ${error.message}`)
  process.exitCode = 1
})
