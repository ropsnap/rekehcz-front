<template>
  
  <v-row>

    <v-col 
      cols="12" 
      class="pa-3"
      style="border: 1px solid lightgray;">
      <v-row>
        
          <v-col md="3">
              <span class="mr-2">Sessão: </span> 
              <span style="font-weight: bolder;">{{ routeKey }}</span>
          </v-col>

          <v-col md="6">
            <vue-countdown 
              :time="2 * 24 * 60 * 60 * 30" 
              v-slot="{ days, hours, minutes, seconds }">
              Tempo restante：{{ days }} dias, {{ hours }} horas, 
              {{ minutes }} min, {{ seconds }} sec
            </vue-countdown>
          </v-col>

          <v-col>
            <v-btn size="small" color="black">
              Finalizar 
              <v-icon class="ml-2">mdi-stop-circle-outline</v-icon>
            </v-btn>
          </v-col>
        
        </v-row>
    </v-col>

    <v-col md="5" cols="12" class="pa-2">
      <v-sheet rounded="lg" >
        
        <br>

        <h3 class="pb-2 mr-2" style="display: inline-block;">
          Cole suas infos
        </h3>
        
        <small>→ Máximo 25 por check</small>
        
        <v-textarea 
          v-model="infosText"
          :loading="loading"
          :disabled="loading"
          clearable 
          rows="10"
          ref="infosTextarea"
          label="infos" 
          placeholder="5674336375574532|09|2026|957"
          variant="outlined" />

        <v-btn 
          @click="checkInfos"
          :loading="loading"
          color="primary"
          block>
          <span class="mr-3">checar</span>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>

      </v-sheet>
    </v-col>

    <v-col md="7" cols="12">
      <v-sheet
        min-height="25vh"
        rounded="lg">

        <br>

        <v-row class="mb-1">
        
          <v-col md="3">
              <v-icon size="small" class="mr-1">mdi-check-circle</v-icon>
              <span class="mr-2">Live: </span> 
              <span style="font-weight: bolder;">
                {{liveInfosParsed.length}}
              </span>
          </v-col>
          
          <v-col md="3">
              <v-icon size="small" class="mr-1">mdi-emoticon-dead</v-icon>
            <span class="mr-2">Dead: </span> 
              <span style="font-weight: bolder;">
                {{deadInfosParsed.length}}
              </span>
          </v-col>

          <v-col md="2">
            <v-icon size="small" class="mr-1">mdi-timer-sand</v-icon>
            {{ deadInfosParsed.length + liveInfosParsed.length }}/
            {{ infosTextArray.length }}
          </v-col>
          <v-col></v-col>
          
          <v-col md="3">
            <v-btn @click="copyLiveInfos" size="small">
              <span>Copiar</span>
              <v-icon class="ml-2" size="small">mdi-content-copy</v-icon>
            </v-btn>
          </v-col>

        </v-row>
        
        <div class="pa-6" style="border: 1px solid lightgray;">
          
          <div ref="liveInfosParsedContent">
            
            <span 
              style="font-size: 72%;" 
              v-for="info in liveInfosParsed">
              {{ info.number }}|{{ info.month }}|{{ info.year }}|{{ info.cvv }}|{{ info.brand }}|{{ info.bank }}|{{ info.level }}~🟢{{ info.status }}~💰{{ info.charge }}
              <br> 
            </span>

          </div>

          <br>
          <hr>
          <br>

          <div>
            <span
              style="text-decoration: line-through; font-size: 72%; color: red;" 
              v-for="info in deadInfosParsed">
              {{ info.number }}|{{ info.month }}|{{ info.year }}|{{ info.cvv }}|{{ info.brand }}~🔴{{ info.status }}
              <br> 
            </span>
          </div>
        
        </div>

        <br>

      </v-sheet>
    </v-col>

  </v-row>

</template>

<script>
  
  import "toastify-js/src/toastify.css"
  import copy from 'copy-text-to-clipboard';
  import Toastify from 'toastify-js'
  
  const e = import.meta.env
  
  export default {

    name: "Dash",

    data: () => ({

      // user session by his browser infos only
      visitor: null,

      // is loading?
      loading: false,

      // websocket connection instance
      // defined at mounted()
      ws: null, 
      
      // left textarea value
      infosText: '',

      // set/updated at the time 
      // ...of websockets event dispatch
      infosParsed: []
    }),

    computed : {

      infosTextArray () {
        return this.infosText.split('\n')
      },
      
      liveInfosParsed () {
        return this.infosParsed.filter((info) => {
          return info.status === 'LIVE'
        })
      },

      deadInfosParsed () {
        return this.infosParsed.filter((info) => {
          return info.status === 'DEAD'
        })
      },

      routeKey () {

        let rk = window.location.pathname
        
        if (rk === '/') {
          return 'MYynmzZpT2' 
        }

        return rk.replaceAll('/', '')
      },

      baseURL () {

        if (e.MODE === 'production') {
          return window.location.host
        }

        if (e.MODE === 'development') {
          return 'localhost:8000'
        }
      }

    },

      methods: {

        copyLiveInfos () {
          
          let text = this.$refs.liveInfosParsedContent.textContent
              text = text.replaceAll(' ', '\n')
          
          copy(text)
        },

        checkInfos () {

          this.loading = true;
          
          console.log(this.infosText)
          console.log(this.infosTextArray)

          this.ws.send(JSON.stringify({ 
            name: 'pick-infos', 
            data: this.infosTextArray
          }))
        }
      
      },

      async created () {
        
        // focus main textarea
        setTimeout(() => {
          this.$refs.infosTextarea.focus()  
        }, 1500)
        

        if (e.MODE === 'development') {
          
          this.infosText = '4242424242424242|11|28|123\n'
                         + '4000056655665556|12|25|123\n'
                         + '5555555555554444|14|26|123\n'
                         + '2223003122003222|10|27|123\n'
                         + '5200828282828210|15|27|123'
        }

        ;(async () => { // front socket programmings

          // starts and defines websocket connection instance
          this.ws = await new WebSocket(`ws://${this.baseURL}`)
          
          // on opened socket (listening)
          this.ws.onopen = async (event) => {
            
            console.log('onopen event:', event)
            console.log("Successfully connected to the wss")
            
            Toastify({
              text: "Connected to Websocket server",
              duration: 3000,
              style: { background: 'seagreen'}
            }).showToast();

            // setup visitor session front-end
            this.visitor = await this.$fpjs.getVisitorData({
              extendedResult: true
            })

            // setup visitor session back-end
            this.ws.send(JSON.stringify ({ 
                name: 'setup-visitor',
                data: this.visitor
            }))

            Toastify({
              text: "Sessão sincronizada ao server",
              duration: 3000,
              style: { background: 'seagreen'}
            }).showToast();

          }  

          // on incoming event
          // get new parsed infocc's
          this.ws.onmessage = (event) => {
            
            let ev = JSON.parse(event.data)
            
            if (ev.name === 'check') {

              this.infosParsed.push(ev.data)

              Toastify({
                text: '+1',
                duration: 3000,
                style: { background: 'seagreen' }
              }).showToast();
            }

            if (ev.name === 'finish') {
             
              this.loading = false;

              Toastify({
                text: 'Checks concluídos',
                duration: 6000,
                style: { background: 'seagreen' }
              }).showToast();
            }
            
            if (ev.name === 'error') {
              Toastify({
                text: ev.data,
                duration: 6000,
                style: { background: 'red' }
              }).showToast();

            }
          }
        })()



      }
  }

</script>
