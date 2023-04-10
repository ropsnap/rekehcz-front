<template>
  <v-app id="inspire">
    
    <v-app-bar flat>
     
      <v-container class="fill-height d-flex align-left">

        <v-img
          height="200px"
          aspect-ratio="13/9"
          center
          src="@/assets/logo.png" />

        <h2 class="mr-3">REKEHCZ</h2>

        <v-spacer></v-spacer>

        <v-row>

          <v-col>
            <v-btn 
              href="https://api.whatsapp.com/send?phone=13145488734" 
              target="_blank">
              Chamar no whats
              <v-icon 
                color="green" 
                class="ml-2 outline">mdi-whatsapp</v-icon>
            </v-btn>
          </v-col>

          <v-col>
            <v-btn 
              href="https://t.me/zxybaby" 
              target="_blank">
              Chamar no Telegram
              <v-icon 
                color="blue" 
                class="ml-2 outline">mdi-send</v-icon>
            </v-btn>
          </v-col>

        </v-row>
        
        <v-row v-show="sessionKey && checksLeft">
        
          <v-col>
              <span class="mr-2">Sessão: </span> 
              <span style="font-weight: bolder;">{{ sessionKey }}</span>
          </v-col>
          
          <v-col>
            <span class="mr-2">Checks: </span> 
            <span style="font-weight: bolder;">{{ checksLeft }}</span>
          </v-col>
          
          <v-col>
            <v-btn color="black">
              Finalizar 
              <v-icon class="ml-2">mdi-stop-circle-outline</v-icon>
            </v-btn>
          </v-col>
        
        </v-row>

      </v-container>

    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>

          <router-view />

      </v-container>
    </v-main>
  </v-app>


</template>

<script>
  
  export default {
    name: "App",
  }

</script>

<style>

  html {
    background-color: #eeeeee;
  }

  .v-application__wrap {
    min-height: 85vh !important;
    overflow: hidden !important;
  }

</style>