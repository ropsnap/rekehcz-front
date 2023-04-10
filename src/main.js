/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import util from '../util.js'

Object.assign(window, {
  ...util
})

// Composables
import { createApp } from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown';
import { fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

app.use(fpjsPlugin, {
    loadOptions: {
      apiKey: "BtvMLx5bnv5n8pLW5nbz"
    }
})

registerPlugins(app)

app.component(VueCountdown.name, VueCountdown)
app.mount('#app')

