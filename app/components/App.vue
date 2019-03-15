<template>
  <Page>
    <ActionBar title="Save Instagram Pic">
      <ActionItem
        @tap="downLoadPic"
        text="download all"
        ios.systemIcon="16"
        ios.position="right"
        android.position="popup"
      ></ActionItem>
      <ActionItem
        @tap="clearHis"
        text="clear list"
        ios.systemIcon="16"
        ios.position="right"
        android.position="popup"
      ></ActionItem>
      <ActionItem
        @tap="goToAboutPage"
        text="About"
        ios.systemIcon="16"
        ios.position="right"
        android.position="popup"
      ></ActionItem>
    </ActionBar>
    <AbsoluteLayout ref="rootLayout">
      <ListView
        v-if="imgUrlList.length > 0"
        for="item in imgUrlList"
        @itemTap="onItemTap"
        left="1.5%"
        top="10"
        right="1.5%"
        height="97%"
        width="98%"
        marginBottom="48"
      >
        <v-template>
          <StackLayout orientation="horizontal">
            <Image :src="item" stretch="aspectFill" width="100%" height="auto"/>
          </StackLayout>
        </v-template>
      </ListView>
      <Label v-else text="images will be shown here"/>
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
import * as appSettings from "tns-core-modules/application-settings"

import About from "./page/about";

const app = require("tns-core-modules/application");
const platform = require("tns-core-modules/platform");

export default {
  components: {
    About
  },

  data() {
    return {
      isActive: false,
      msg: "Hello World!",
      clipboardText: null,
      historyClipBoard: [],
      imgUrlList: [], // url 列表
      downloadList: [], // 下载列表
      imgRes: null,
      folderPath: "",
      imageName: "",
      imgUrl: "",
      timerId: "",
      items: [1, 2, 3]
    };
  },
  computed: {},
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
      _self.getClipBoard();
    }, 1000);
  },
  methods: {
    getClipBoard() {
      Clipboard.getText().then(content => {
        // console.log(this.imgUrlList);
        console.log(content);
        let insUrl = content;
        this.historyClipBoard.push(content);

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
              // console.log("---------response---------\n", response);
              // console.log("------------response content--------------\n", str);
              let searchStr = "is_video";

              let isvideoPos = str.search(searchStr);
              let isVideo = str.substr(isvideoPos + searchStr.length + 2, 1);
              console.log(isVideo);
              if (isVideo === "f") {
                let displayUrlNum = str.match(/display_url/g).length;
                console.log(displayUrlNum);
                this.cutDisplayUrl(str, displayUrlNum, 0);
              } else {
                console.warn("IS VIDEO");
                let searchStr = "video_url";
                let n = str.search(searchStr);
                let tempStr = str.substr(n + searchStr.length + 2, str.length);
                let end = tempStr.search(",");
                let videoUrl = tempStr.substr(1, end - 2).trim();
                console.log(videoUrl);

                let videoImgStr = '<meta property="og:image" content=';
                n = str.search(videoImgStr);
                console.log("img position  ", n);
                tempStr = str.substr(n + videoImgStr.length + 1, str.length);
                let tagEnd = tempStr.search("/>");
                let result = tempStr.substr(0, tagEnd - 2);

                // TODO DOWNLOAD VIDEO?
                if (this.imgUrlList.indexOf(result) === -1) {
                  // 显示
                  this.imgUrlList.push(result);
                  this.downloadList.push({
                    type: "video",
                    url: videoUrl
                  });
                }
              }
            },
            e => {}
          );
      });
    },
    /**
     * get the img url
     */
    cutDisplayUrl(str, displayUrlNum, displayUrlIdx) {
      let idx = displayUrlIdx;
      let searchStr = "display_url";
      let n = str.search(searchStr);
      console.log("img position  ", n);
      let tempStr = str.substr(n + searchStr.length + 2, str.length);
      let tagEnd = tempStr.search(",");
      let imgUrl = tempStr.substr(1, tagEnd - 2);
      //console.log(result);

      if (this.imgUrlList.indexOf(imgUrl) === -1) {
        this.imgUrlList.push(imgUrl);
        this.downloadList.push({
          type: "img",
          url: imgUrl
        });
      }
      if (displayUrlNum > 1) {
        idx++;
        console.log("in next");
        if (idx + 1 > displayUrlNum) {
        } else {
          return this.cutDisplayUrl(tempStr, displayUrlNum, idx);
        }
      }
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
      let list = this.downloadList;
      this.msg = "start download";
      console.info("---DOWNLOAD LIST---\n", list);
      for (let i of list) {
        if (i.type === "img") {
          this.getPic(i.url);
        } else {
          this.getVideo(i.url);
        }
      }
    },
    getPic(url) {
      this.msg = "download the image...";
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

          let sIdx = insUrl.search(".jpg");
          console.log("sIdx=======================\n\n", sIdx);
          let fileName = insUrl.substring(sIdx - 20, sIdx + 4);
          console.log("fileName...", folder, fileName);
          const path = fileSystemModule.path.join(folder, fileName);
          console.log(path);
          const saved = r.saveToFile(path, "png");
          if (saved) {
            console.log("Image saved successfully!");
          }

          this.msg = "save image success";
        })
        .catch(err => {
          this.msg = err;
        });
    },

    /**
     * downlaod video
     */
    getVideo(url) {
      this.msg = "download the image...";
      this.folderPath = "PATH";
      let insUrl = url.trim();
      console.log(insUrl);
      const folder = "/storage/emulated/0/saveInsImg";

      let sIdx = insUrl.search(".mp4");
      console.log("sIdx=======================\n\n", sIdx);
      let fileName = insUrl.substring(sIdx - 20, sIdx + 4);
      console.log("fileName...", folder, fileName);
      const path = `${folder}/${fileName}`;
      console.log(path);

      httpModule
        .getFile(insUrl, path)
        .then(r => {
          this.msg = "save video success";
        })
        .catch(err => {
          this.msg = err;
        });
    },

    clearHis() {
      this.historyClipBoard = [];
      this.imgUrlList = [];
      this.downloadList = [];
      this.msg = "clear all img list";
    },
    onItemTap(content) {
      this.clipboardText = content;
    },
    goToAboutPage() {
      this.$navigateTo(About);
    }
  },
  watch: {
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
