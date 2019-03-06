<template>
    <Page>
        <ActionBar title="Save Instagram Pic"/>

        <StackLayout backgroundColor="#3c495e">
            <Label class="message" :text="msg" height="70" />
            <!-- <TextView :text="imgPositionStr" class="message"/> -->

          
            <!-- <Image src="https://www.nativescript.org/images/default-source/Blogs/ns-logo_share_600x315.png" stretch="aspectFill"  width="100" height="100"/> -->
            <Image :src="imgRes" stretch="aspectFill"  width="200" height="200"/>

            <Button text="get clipboard" height="70" @tap="onButtonTap()"/>
            <Button text="clear clipboard" height="70" @tap="clearHis()"/>
           
            <ListView for="(item, index) in historyClipBoard" @itemTap="onItemTap">
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
import * as Clipboard from "nativescript-clipboard";
const httpModule = require("http");
const imageSourceModule = require("tns-core-modules/image-source");

export default {
  data() {
    return {
      msg: "Hello World!",
      clipboardText: null,
      historyClipBoard: [],
      imgRes: null,
      imgPositionStr: ""
    };
  },
  created() {},
  methods: {
    onButtonTap() {
      Clipboard.getText().then(content => {
        console.log(content);
        let insUrl = content;
        this.historyClipBoard.push(content);
        this.msg = "get html page";
        let imgUrl =
          "https://scontent-hkg3-2.cdninstagram.com/vp/8c071b8a600c99be856174d19c748d96/5D0FB087/t51.2885-15/e35/53219272_265808877682253_9167345377758443403_n.jpg?_nc_ht=scontent-hkg3-2.cdninstagram.com";
        // this.showInsImg(imgUrl)
        httpModule
          .request({
            url: insUrl,
            method: "GET"
          })
          .then(
            response => {
              // Content property of the response is HttpContent
              // The toString method allows you to get the response body as string.
              const str = response.content.toString();
              console.log("---------response---------\n", response);
              console.log("------------response content--------------\n", str);
              let searchStr = '<meta property="og:image" content=';
              var n = str.search(searchStr);
              console.log("img position  ", n);
              let tempStr = str.substr(n + searchStr.length + 1, str.length);
              let tagEnd = tempStr.search("/>");
              let result = tempStr.substr(0, tagEnd - 2);

              this.imgPositionStr = result;
              this.showInsImg(result);
              // The toJSON method allows you to parse the received content to JSON object
              // var obj = response.content.toJSON();
              // The toImage method allows you to get the response body as ImageSource.
              // var img = response.content.toImage();
            },
            e => {}
          );
      });
    },
    showInsImg(url) {
      this.msg = "get the image...";
      let insUrl = url.trim();
      httpModule.getImage(insUrl).then(
        r => {
          // getImage method returns ImageSource object
          console.log(r);
          this.imgRes = r;
          this.msg = "done";
        },
        e => {}
      );
    },
    clearHis() {
      this.historyClipBoard = [];
    },
    onItemTap(content) {
      this.clipboardText = content;
    }
  }
};
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
