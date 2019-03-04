<template>
    <Page>
        <ActionBar title="Save Instagram Pic"/>

        <StackLayout backgroundColor="#3c495e">
            <Label class="message" :text="msg" height="70" />
            <Label class="message" :text="clipboardText" height="70" />
            <Button text="get clipboard" height="70" @tap="onButtonTap()"/>
            <Button text="clear clipboard" height="70" @tap="clearHis()"/>
           
            <ListView v-for="(item, index) in historyClipBoard" @itemTap="onItemTap" :key="index">
                <v-template>
                  <!-- Shows the list item label in the default color and style. -->
                  <Label :text="item" class="message"/>
                </v-template>
            </ListView>
        </StackLayout>
    </Page>
</template>

<script >
// const Clipboard = require('nativescript-clipboard')
import * as Clipboard from 'nativescript-clipboard'

  export default {
    data() {
      return {
        msg: 'Hello World!',
        clipboardText: null,
        historyClipBoard: []
      }
    },
    created(){
      alert('mounted')
    },
    methods:{
      onButtonTap(){
        Clipboard.getText().then((content)=>{
        console.log(content)
      
        this.historyClipBoard.push(content)
      })
      },
      clearHis(){
        this.historyClipBoard = []
      },
      onItemTap(content){
        this.clipboardText = content
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #ffffff;
    }
</style>
