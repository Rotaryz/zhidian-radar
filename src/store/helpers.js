import {mapGetters, mapActions} from 'vuex'

export const musicComputed = {
  ...mapGetters('music', ['musicAudio'])
}

export const musicMethods = {
  ...mapActions('music', ['setMusicAudio', 'playAudio'])
}
