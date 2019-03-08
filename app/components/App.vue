<template>
    <Page>
        <ActionBar title="Save Instagram Pic"/>

        <StackLayout backgroundColor="#3c495e">
            <Label class="message" :text="msg" height="70" />
            <!-- <TextView :text="imgPositionStr" class="message"/> -->
            <Label class="message" :text="imageName" textWrap="true" />
            <Label class='message' :text="folderPath" textWrap="true"/>
            <label class="message" :text="error" textWrap=  "true" />
            <!-- <Image src="https://www.nativescript.org/images/default-source/Blogs/ns-logo_share_600x315.png" stretch="aspectFill"  width="100" height="100"/> -->
            <Image :src="imgRes" stretch="aspectFill"  width="200" height="200" />

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
import * as Clipboard from 'nativescript-clipboard'
const httpModule = require('http')
const imageSourceModule = require('tns-core-modules/image-source')
const fileSystemModule = require('tns-core-modules/file-system')
const permissions = require( "nativescript-permissions" );

export default {
	data () {
		return {
			msg: 'Hello World!',
			clipboardText: null,
			historyClipBoard: [],
			imgRes: null,
			imgPositionStr: '',
			folderPath: '',
			error: '',
			imageName: '',
			imgUrl: ''
		}
	},
	computed: {
		boardLength () {
			let l = this.historyClipBoard.length
			return l
		}
	},
	created () {
		permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
  .then(function() {
     console.log("Woo Hoo, I have the power!");
  })
  .catch(function() {
     console.log("Uh oh, no permissions - plan B time!");
  });
	},
	methods: {
		onButtonTap () {
			Clipboard.getText().then(content => {
				console.log(content)
				let insUrl = content
				this.historyClipBoard.push(content)
				this.msg = 'get html page'

				httpModule
					.request({
						url: insUrl,
						method: 'GET'
					})
					.then(
						response => {
							// Content property of the response is HttpContent
							// The toString method allows you to get the response body as string.
							const str = response.content.toString()
							console.log('---------response---------\n', response)
							console.log('------------response content--------------\n', str)
							let searchStr = '<meta property="og:image" content='
							var n = str.search(searchStr)
							console.log('img position  ', n)
							let tempStr = str.substr(n + searchStr.length + 1, str.length)
							let tagEnd = tempStr.search('/>')
							let result = tempStr.substr(0, tagEnd - 2)

							this.imgPositionStr = result
							console.log(result)
							// this.imgRes = r;
							this.showInsImg(result)
						},
						e => {}
					)
			})
		},
		getImgName () {
			let y = new Date().getFullYear()
			let m = new Date().getMonth() + 1
			let date = new Date().getDate()
			let h = new Date().getHours()
			let min = new Date().getMinutes()
			let s = new Date().getSeconds()
			let name = `${y}${m}${date}${h}${min}${s}`
			this.imageName = name
			return name
		},
		showInsImg (url) {
			let tempUrl = this.imgUrl
			if (tempUrl !== url) {
				this.imgUrl = url
				this.msg = 'get the image...'
				this.folderPath = 'PATH'
				let insUrl = url.trim()
				httpModule
					.getImage(insUrl)
					.then(r => {
						// getImage method returns ImageSource object
						console.log(r)
						this.imgRes = r
						console.log(fileSystemModule.knownFolders)
						// const folder = fileSystemModule.knownFolders.documents().path;

						const folder = '/storage/emulated/0/saveInsImg'
						this.folderPath = folder

						let name = this.getImgName()
						const fileName = `${name}.png`
						console.log('fileName...', folder, fileName)
						const path = fileSystemModule.path.join(folder, fileName)
						console.log(path)
						this.folderPath = this.folderPath + ';' + path
						const saved = r.saveToFile(path, 'png')
						this.folderPath = this.folderPath + ';' + saved
						if (saved) {
							console.log('Image saved successfully!')
						}

						this.msg = 'done'
					})
					.catch(err => {
						{
							this.error = err
						}
					})

				// const source = new imageSourceModule.ImageSource();
				// console.log(source)
				//           source.fromUrl(insUrl)
				//           .then((imageSource) => {
				//               const folder = fileSystemModule.knownFolders.documents().path;
				//               const fileName = "test.png";
				//               console.log('fileName...', fileName)
				//               const path = fileSystemModule.path.join(folder, fileName);
				//               const saved = imageSource.saveToFile(path, "png");
				//               if (saved) {
				//                   console.log("Image saved successfully!");
				//               } },
				//         e => {}      );
			}
		},

		clearHis () {
			this.historyClipBoard = []
		},
		onItemTap (content) {
			this.clipboardText = content
		}
	},
	watch: {
		boardLength (val, oldVal) {
			if (val > 0) {
				// this.onButtonTap()
			}
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
