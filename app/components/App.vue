<template>
  <Page >
    <ActionBar title="Save Instagram Pic"/>
    <AbsoluteLayout ref="rootLayout">
      <ListView
        for="item in imgUrlList"
        @itemTap="onItemTap"
        left="10"
        top="10"
        height="97%"
        width="100%"
        marginBottom="48"
      >
        <v-template>
          <StackLayout orientation="horizontal">
            <Image :src="item" stretch="aspectFill" width="100%" height="auto"/>
          </StackLayout>
        </v-template>
      </ListView>
      <!-- <StackLayout left="0" top="0" height="100%" width="100%" class="backdrop" :class="classBackdrop" /> -->
      <AbsoluteLayout ref="fabItemPosition" marginTop="87%" marginLeft="5%">
				<Button text="CLEAR LIST" @tap="clearHis()"  left="10" top="0"  class="btn btn-primary btn-active" />
				<Button text="DOWNLOAD IMAGES" @tap="downLoadPic()" left="150" top="0"  class="btn btn-primary btn-active" />
        <!-- <GridLayout ref="fabItemContainer" left="8" top="8">
          <FabItem row="1" :class="classItem1" color="#E94E77" title="CLEAR" @onButtonTap="clearHis()"/>
          <FabItem
            row="1"
            :class="classItem2"
            color="#3FB8AF"
            title="DOWNLOAD"
            @onButtonTap="downLoadPic()"
          />
        </GridLayout>
        <FabButton @onButtonTap="onCroseeButtonTap" :isActive="isActive"/> -->
      </AbsoluteLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script >
// const Clipboard = require('nativescript-clipboard')
import * as Clipboard from "nativescript-clipboard";
import * as httpModule from "http";
import * as imageSourceModule from "tns-core-modules/image-source";
import * as fileSystemModule from "tns-core-modules/file-system";
import * as permissions from "nativescript-permissions";
import * as Toast from "nativescript-toast";
import * as timerModule from "tns-core-modules/timer";

import FabButton from "./fabItem/FabButton";
import FabItem from "./fabItem/FabItem";

const app = require("tns-core-modules/application");
const platform = require("tns-core-modules/platform");

export default {
  components: {
    FabButton,
    FabItem
  },

  data() {
    return {
      isActive: false,
      msg: "Hello World!",
      clipboardText: null,
      historyClipBoard: [],
      imgUrlList: [],
      imgRes: null,
      imgPositionStr: "",
      folderPath: "",
      imageName: "",
      imgUrl: "",
      timerId: "",
      items: [1, 2, 3]
    };
  },
  computed: {
    boardLength() {
      let l = this.historyClipBoard.length;
      return l;
    },
    classItem1() {
      return this.isActive ? "raiseItem1" : "downItem1";
    },
    classItem2() {
      return this.isActive ? "raiseItem2" : "downItem2";
    },
    classItem3() {
      return this.isActive ? "raiseItem3" : "downItem3";
    },
    classBackdrop() {
      return this.isActive ? "backdrop-visible" : "backdrop-invisible";
    }
  },
  created() {
    permissions
      .requestPermission(
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
        "I need these permissions because I'm cool"
      )
      .then(function() {
        console.log("Woo Hoo, I have the power!");
      })
      .catch(function() {
        console.log("Uh oh, no permissions - plan B time!");
      });
    const _self = this;
    _self.timerId = timerModule.setInterval(() => {
      _self.onButtonTap();
    }, 1000);
  },
  methods: {
    appLoaded(args) {
      let fabItemContainer = this.$refs.fabItemContainer.nativeView;
      let fabItemPosition = this.$refs.fabItemPosition.nativeView;
      let rootLayout = this.$refs.rootLayout.nativeView;

      // Needed to avoid masking child components on Android
      if (app.android && platform.device.sdkVersion >= "21") {
        fabItemContainer.android.setClipChildren(false);
        fabItemPosition.android.setClipChildren(false);
        rootLayout.android.setClipChildren(false);
      }
    },
    onCroseeButtonTap(args) {
      this.isActive = !this.isActive;
    },
    onButtonTap() {
      console.log("get clipboard");
      Clipboard.getText().then(content => {
        console.log(content);
        let insUrl = content;
        if (this.historyClipBoard.indexOf(content) === -1) {
          this.historyClipBoard.push(content);
          this.msg = "get html page";

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
                console.log(
                  "------------response content--------------\n",
                  str
                );
                let searchStr = '<meta property="og:image" content=';
                var n = str.search(searchStr);
                console.log("img position  ", n);
                let tempStr = str.substr(n + searchStr.length + 1, str.length);
                let tagEnd = tempStr.search("/>");
                let result = tempStr.substr(0, tagEnd - 2);

                this.imgPositionStr = result;
                console.log(result);
                this.imgRes = result;
                this.imgUrlList.push(result);
                // this.showInsImg(result)
              },
              e => {}
            );
        }
      });
    },
    getImgName() {
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let date = new Date().getDate();
      let h = new Date().getHours();
      let min = new Date().getMinutes();
      let s = new Date().getSeconds();
      let name = `${y}${m}${date}${h}${min}${s}`;
      this.imageName = name;
      return name;
    },
    /**
     * download all pictures
     */
    downLoadPic() {
      let list = this.imgUrlList;
      this.msg = "start download";
      console.info("---DOWNLOAD LIST---\n", list);
      for (let i of list) {
        this.showInsImg(i);
      }
    },
    showInsImg(url) {
      this.msg = "get the image...";
      this.folderPath = "PATH";
      let insUrl = url.trim();
      console.log(insUrl);
      httpModule
        .getImage(insUrl)
        .then(r => {
          // getImage method returns ImageSource object
          console.log(r);
          // this.imgRes = r

          // const folder = fileSystemModule.knownFolders.documents().path;

          const folder = "/storage/emulated/0/saveInsImg";
          this.msg = folder;

          let name = this.getImgName();
          let sIdx = insUrl.search(".jpg");
          let fileName = insUrl.substring(sIdx - 20, sIdx + 4);
          console.log("fileName...", folder, fileName);
          const path = fileSystemModule.path.join(folder, fileName);
          console.log(path);
          this.folderPath = this.folderPath + ";" + path;
          const saved = r.saveToFile(path, "png");
          this.folderPath = this.folderPath + ";" + saved;
          if (saved) {
            console.log("Image saved successfully!");
          }

          this.msg = "save image success";
        })
        .catch(err => {
          {
            Toast.makeText(err).show();
          }
        });
    },

    clearHis() {
      this.historyClipBoard = [];
			this.imgUrlList = [];
			this.msg = 'clear all img list'
    },
    onItemTap(content) {
      this.clipboardText = content;
    }
  },
  watch: {
    boardLength(val, oldVal) {
      if (val > 0) {
        // this.onButtonTap()
      }
    },
    msg(val, oldVal) {
      Toast.makeText(val).show();
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

ListView label {
  height: 48;
  min-height: 48;
}

.backdrop {
  background-color: rgba(29, 30, 35, 0.9);
  opacity: 0;
}

.backdrop-visible {
  animation-name: activateBackdrop;
  animation-duration: 0.25;
  animation-fill-mode: forwards;
}

.backdrop-invisible {
  animation-name: activateBackdrop;
  animation-duration: 0.25;
  animation-fill-mode: forwards;
  animation-direction: reverse;
}

.raiseItem1 {
  opacity: 1;
  animation-name: raiseItem1;
  animation-duration: 0.25;
  animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-fill-mode: forwards;
}

.raiseItem2 {
  opacity: 1;
  animation-name: raiseItem2;
  animation-duration: 0.25;
  animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-fill-mode: forwards;
}

.raiseItem3 {
  opacity: 1;
  animation-name: raiseItem3;
  animation-duration: 0.25;
  animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-fill-mode: forwards;
}

.downItem1 {
  animation-name: raiseItem1;
  animation-duration: 0.2;
  animation-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  animation-fill-mode: forwards;
  animation-direction: reverse;
}

.downItem2 {
  animation-name: raiseItem2;
  animation-duration: 0.2;
  animation-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  animation-fill-mode: forwards;
  animation-direction: reverse;
}

.downItem3 {
  animation-name: raiseItem3;
  animation-duration: 0.2;
  animation-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  animation-fill-mode: forwards;
  animation-direction: reverse;
}

@keyframes activateBackdrop {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes raiseItem1 {
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 1;
    transform: translate(0, -64);
  }
}

@keyframes raiseItem2 {
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 1;
    transform: translate(0, -128);
  }
}

@keyframes raiseItem3 {
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 1;
    transform: translate(0, -192);
  }
}
</style>
