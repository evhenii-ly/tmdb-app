<template>
  <div class="player">
    <div v-if="!token">
      <Button severity="contrast" @click="handleGetAccessTokenasync">
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
        >
          <path
            d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"
          />
        </svg>

        Sign in
      </Button>
    </div>
    <div v-else>
      <div class="playlist">
        <h2>Playlist</h2>
        <ul>
          <li
            v-for="(song, index) in store.activeMovieOST"
            :key="index"
            @click="playTrack(song.uri)"
            :class="{ playing: currentTrackId === song.uri }">
            {{ song.name }} - {{ song.artist }}
          </li>
        </ul>
      </div>

      <div :class="['song-item', {'playing': isPlaying}]">
        <div :class="['song-item__image-box', {'song-item__image-box--no-image': !currentTrackImage}]">
          <img :src="`${currentTrackImage}`"
               v-if="currentTrackImage"
               alt=""
               class="song-item__image">
        </div>

        <div class="progress-container">
          <input
            type="range"
            min="0"
            :max="trackDuration"
            :value="trackPosition"
            @input="handleSeek"
            class="progress-bar"
          />
          <div class="time-display">
            <span>{{ formatTime(trackPosition) }}</span>
            <span>{{ formatTime(trackDuration) }}</span>
          </div>
        </div>
      </div>

      <div class="controls">
        <Button variant="text" @click="play">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM18.5 15.1262L33.5 23.1933C34.1667 23.5518 34.1667 24.4482 33.5 24.8067L18.5 32.8738C17.8333 33.2323 17 32.7842 17 32.0671V15.9329C17 15.2158 17.8333 14.7677 18.5 15.1262Z" fill="white"/>
          </svg>
        </Button>
        <Button variant="text" @click="pause">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24ZM17 16C17 15.4477 17.4477 15 18 15H21C21.5523 15 22 15.4477 22 16V32C22 32.5523 21.5523 33 21 33H18C17.4477 33 17 32.5523 17 32V16ZM27 15C26.4477 15 26 15.4477 26 16V32C26 32.5523 26.4477 33 27 33H30C30.5523 33 31 32.5523 31 32V16C31 15.4477 30.5523 15 30 15H27Z" fill="white"/>
          </svg>
        </Button>
        <Button @click="next">Next</Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.player {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  padding: 10px;
  background-color: #000;
  border-radius: 17px;
}

.song-item {
  display: flex;
  gap: 16px;

  &__image-box {
    position: relative;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;

    &:not(.song-item__image-box--no-image) {
      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        width: 26px;
        height: 26px;
        background-color: rgba(255, 255, 255, 0.6);
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }

      &::after {
        width: 6px;
        height: 6px;
        background-color: #000;
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: rotating 7s infinite linear;
    animation-play-state: paused;
  }

  &.playing .song-item__image {
    animation-play-state: running;
  }
}

.playlist ul {
  list-style: none;
  padding: 0;
}

.playlist li {
  cursor: pointer;
  padding: 5px;
  transition: background-color 0.3s;
}

.playlist li.playing {
  background-color: #1db954;
  color: white;
}

.progress-container {
  width: 100%;
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #4f4f4f;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
  cursor: pointer;
}

.progress-bar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #b3b3b3;
  margin-top: 4px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

@keyframes rotating {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Button } from 'primevue'
import { useSpotify } from '@/composables/api/useSpotify'
import { store } from '@/stores/store'

const { getAccessToken } = useSpotify()

const currentTrackId = ref(null)
const player = ref(null)
const deviceId = ref(null)
const token = ref(null)
const trackPosition = ref(0)
const trackDuration = ref(0)
const currentTrackImage = ref('')
const isPlaying = ref(false)
const isInitialized = ref(false)
const progressInterval = ref(null)

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleSeek = async (event) => {
  const position = parseInt(event.target.value)
  try {
    await player.value?.seek(position)
    trackPosition.value = position
  } catch (error) {
    console.error('Error seeking:', error)
  }
}

const initializePlayer = () => {
  if (isInitialized.value) return

  player.value = new Spotify.Player({
    name: 'Spotify Player',
    getOAuthToken: (cb) => {
      cb(token.value)
    },
    volume: 0.5,
  })

  player.value.addListener('ready', ({ device_id }) => {
    deviceId.value = device_id
    console.log('Device ID:', device_id)
  })

  player.value.addListener('not_ready', ({ device_id }) => {
    console.error('Device ID has gone offline:', device_id)
  })

  player.value.addListener('player_state_changed', (state) => {
    if (!state) return

    currentTrackId.value = state.track_window.current_track.uri.split(':').pop()
    currentTrackImage.value = state.track_window.current_track.album.images[2].url
    trackPosition.value = state.position
    trackDuration.value = state.duration
    isPlaying.value = !state.paused

    if (progressInterval.value) {
      clearInterval(progressInterval.value)
    }

    if (isPlaying.value) {
      progressInterval.value = setInterval(() => {
        if (trackPosition.value < trackDuration.value) {
          trackPosition.value += 1000
        } else {
          clearInterval(progressInterval.value)
        }
      }, 1000)
    }
  })

  player.value.connect()
  isInitialized.value = true
}

if (!window.onSpotifyWebPlaybackSDKReady) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    initializePlayer()
  }
}

onMounted(() => {
  const savedToken = localStorage.getItem('spotify_token')
  const tokenExpiry = localStorage.getItem('spotify_token_expiry')

  if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
    token.value = savedToken
    if (!isInitialized.value) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)
    }
  }
})

const handleGetAccessTokenasync = async () => {
  try {
    if (!token.value && !isInitialized.value) {
      token.value = await getAccessToken()
      if (token.value) {
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true
        document.body.appendChild(script)
      }
    }
  } catch (error) {
    console.error('Failed to get access token:', error)
  }
}

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
  if (player.value) {
    player.value.disconnect()
  }
  isInitialized.value = false

  const sdkScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')
  if (sdkScript) {
    sdkScript.remove()
  }
})

const playTrack = async (trackId) => {
  try {
    if (!deviceId.value || !token.value) {
      console.error('Device ID or token not available')
      return
    }

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [`${trackId}`],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    })
  } catch (error) {
    console.error('Error playing track:', error)
  }
}

const play = async () => {
  try {
    await player.value?.resume()
    isPlaying.value = true
  } catch (error) {
    console.error('Error resuming playback:', error)
  }
}

const pause = async () => {
  try {
    await player.value?.pause()
    isPlaying.value = false
    if (progressInterval.value) {
      clearInterval(progressInterval.value)
    }
  } catch (error) {
    console.error('Error pausing playback:', error)
  }
}

const next = async () => {
  try {
    await player.value?.nextTrack()
  } catch (error) {
    console.error('Error skipping track:', error)
  }
}
</script>
