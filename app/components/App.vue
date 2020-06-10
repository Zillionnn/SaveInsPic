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
      <Label v-else text="The images will be displayed here" top="32" left="15"/>
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
import * as timerModule from "tns-core-modules/timer";
import * as appSettings from "tns-core-modules/application-settings";
import { toast } from "../util/toast.js";
import About from "./page/about";

const app = require("tns-core-modules/application");
const platform = require("tns-core-modules/platform");

export default {
  components: {
    About
  },

  data() {
    return {
      sdCardPath: "",
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

    this.sdCardPath = fileSystemModule.path.join(
      android.os.Environment.getExternalStorageDirectory()
        .getAbsolutePath()
        .toString()
    );
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
              const html = str
            
            let startString = '"graphql": '
            let startIdx = html.search(startString)

            let remain = html.substring(startIdx, html.length)
            
          let   remain1  = remain.substring(0, remain.length)



            const endIdx = remain1.search('</')
            console.log(endIdx)
            let jsonString = remain1.substring(startString.length, endIdx-9)
            let shareObj = JSON.parse(jsonString)
            console.log(shareObj.shortcode_media.display_resources)
            
              let multiMedia =
                shareObj.entry_data.PostPage[0].graphql.shortcode_media
                  .edge_sidecar_to_children;
                  // TODO
              if (multiMedia) {
                for (let i in multiMedia.edges) {
                  let item = multiMedia.edges[i];
                  if (item.node.is_video) {
                    // 视频
                    let videoUrl = item.node.video_url;
                    let displayUrl = item.node.display_url;
                    console.log(videoUrl);
                    if (this.imgUrlList.indexOf(displayUrl) === -1) {
                      // 显示
                      this.imgUrlList.push(displayUrl);
                      this.downloadList.push({
                        type: "video",
                        url: videoUrl
                      });
                    }
                  } else {
                    // 图片
                    let displayUrl = item.node.display_url;
                    console.log(displayUrl);

                    if (this.imgUrlList.indexOf(displayUrl) === -1) {
                      // 显示
                      this.imgUrlList.push(displayUrl);
                      this.downloadList.push({
                        type: "img",
                        url: displayUrl
                      });
                    }
                  }
                }
              } else {
                // 单张图，视频

                let media =                  shareObj.shortcode_media;
                // 单个视频 TODO
                if (media.is_video) {
                  // 视频
                  let videoUrl = media.video_url;
                  let displayUrl = media.display_url;
                  console.log(videoUrl);
                  if (this.imgUrlList.indexOf(displayUrl) === -1) {
                    // 显示
                    this.imgUrlList.push(displayUrl);
                    this.downloadList.push({
                      type: "video",
                      url: videoUrl
                    });
                  }
                } else {
                  // 图片
                  let displayUrl = media.display_resources[0].src;
                  console.log(displayUrl);

                  if (this.imgUrlList.indexOf(displayUrl) === -1) {
                    // 显示
                    this.imgUrlList.push(displayUrl);
                    this.downloadList.push({
                      type: "img",
                      url: displayUrl
                    });
                  }
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
      // console.log(result);

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
    /**
     * download all pictures
     */
    downLoadPic() {
      let list = this.downloadList;
      toast("start download");
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
      // this.msg = "download the image...";
      let insUrl = url.trim();
      console.log(insUrl);
      httpModule
        .getImage(insUrl)
        .then(r => {
          // getImage method returns ImageSource object
          console.log(r);
          // this.imgRes = r

          // const folder = fileSystemModule.knownFolders.documents().path;
          const folder = this.sdCardPath + "/saveInsPic";
          fileSystemModule.Folder.fromPath(folder);

          toast(folder);

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

          toast(`save to ${folder}`);
        })
        .catch(err => {
          toast(err);
        });
    },

    /**
     * downlaod video
     */
    getVideo(url) {
      let insUrl = url.trim();
      console.log(insUrl);
      const folder = this.sdCardPath + "/saveInsPic";
      fileSystemModule.Folder.fromPath(folder);

      // //Create a folder with known path
      // var folder: fs.Folder = fs.Folder.fromPath(sdCardPath+"/test");
      // //Create a file
      // var testFile: fs.File = folder.getFile("test.txt");
      // console.log("Path " + folder.path)

      let sIdx = insUrl.search(".mp4");
      console.log("sIdx=======================\n\n", sIdx);
      let fileName = insUrl.substring(sIdx - 20, sIdx + 4);
      console.log("fileName...", folder, fileName);
      const path = `${folder}/${fileName}`;
      console.log(path);

      httpModule
        .getFile(insUrl, path)
        .then(r => {
          toast(`save to ${folder}`);
        })
        .catch(err => {
          toast(err);
        });
    },

    clearHis() {
      this.historyClipBoard = [];
      this.imgUrlList = [];
      this.downloadList = [];
      Clipboard.setText("");
      // this.msg = "clear all img list";
    },
    onItemTap(content) {
      this.clipboardText = content;
    },
    goToAboutPage() {
      this.$navigateTo(About);
    }
  },
  watch: {}
};
</script>

<style>
ActionBar {
  background-color: #ff9800;
  color: #000000;
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
</style>
