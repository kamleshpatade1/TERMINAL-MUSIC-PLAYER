const path = require('path')

function getSongsDirectory() {
  return path.join(__dirname, '..', 'songs')
}

function formatSong(song, index) {
  return `${index + 1}. ${song.title} - ${song.artist}`
}

module.exports = {
  getSongsDirectory,
  formatSong
}
