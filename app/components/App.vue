<template>
    <Page>
        <ActionBar title="Save Instagram Pic"/>
			
						<StackLayout  backgroundColor="#3c495e">
									<Label class="message" :text="msg" height="70" />
									<!-- <TextView :text="imgPositionStr" class="message"/> -->
									<Label class="message" :text="imageName" textWrap="true" />
									<!-- <Image src="https://www.nativescript.org/images/default-source/Blogs/ns-logo_share_600x315.png" stretch="aspectFill"  width="100" height="100"/> -->

									<Button text="get clipboard" height="70" @tap="onButtonTap()"/>
									<Button text="clear clipboard" height="70" @tap="clearHis()"/>
									<Button text="DOWNLOAD ALL" height="70" @tap="downLoadPic()"/>

									<!-- <ListView for="(item, index) in historyClipBoard" @itemTap="onItemTap">
											<v-template>
												<Label :text="item" class="message"/>
											</v-template>
									</ListView> -->
									<ListView for="item in imgUrlList" @itemTap="onItemTap">
											<v-template>
												<StackLayout orientation="horizontal">
													<Image :src="item" stretch="aspectFill"  width="200" height="200" />
                				</StackLayout>
											</v-template>
									</ListView>
						</StackLayout>
			
       
    </Page>
</template>

<script >
// const Clipboard = require('nativescript-clipboard')
import * as Clipboard from 'nativescript-clipboard'
import * as httpModule from 'http'
import * as  imageSourceModule from 'tns-core-modules/image-source'
import * as  fileSystemModule from 'tns-core-modules/file-system'
import * as permissions from  "nativescript-permissions"
import * as Toast from 'nativescript-toast'
import * as timerModule from "tns-core-modules/timer"

export default {
	data () {
		return {
			msg: 'Hello World!',
			clipboardText: null,
			historyClipBoard: [],
			imgUrlList:[],
			imgRes: null,
			imgPositionStr: '',
			folderPath: '',
			imageName: '',
			imgUrl: '',
			timerId: ''
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
	const _self = this
	_self.timerId = timerModule.setInterval(() => {
			_self.onButtonTap()
}, 1000);
	},
	methods: {
		onButtonTap () {
			console.log('get clipboard')
			Clipboard.getText().then(content => {
				console.log(content)
				let insUrl = content
				if(this.historyClipBoard.indexOf(content) === -1){
					this.historyClipBoard.push(content)
						this.msg = 'get html page'

				httpModule.request({
						url: insUrl,
						method: 'GET'
					})
					.then(response => {
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
							this.imgRes = result;
							this.imgUrlList.push(result)
							// this.showInsImg(result)
						},
						e => {}
					)
				}
			
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
		/**
		 * download all pictures
		 */
		downLoadPic(){
			let list=  this.imgUrlList
			console.info('---DOWNLOAD LIST---\n', list)
			for(let i of list){
				this.showInsImg(i)
			}
		},
		showInsImg (url) {
				this.msg = 'get the image...'
				this.folderPath = 'PATH'
				let insUrl = url.trim()
				console.log(insUrl)
				httpModule.getImage(insUrl)
					.then(r => {
						// getImage method returns ImageSource object
						console.log(r)
						// this.imgRes = r
			
						// const folder = fileSystemModule.knownFolders.documents().path;

						const folder = '/storage/emulated/0/saveInsImg'
						this.msg = folder

						let name = this.getImgName()
						let sIdx = insUrl.search('.jpg')
						let fileName = insUrl.substring(sIdx-20, sIdx+4)
						console.log('fileName...', folder, fileName)
						const path = fileSystemModule.path.join(folder, fileName)
						console.log(path)
						this.folderPath = this.folderPath + ';' + path
						const saved = r.saveToFile(path, 'png')
						this.folderPath = this.folderPath + ';' + saved
						if (saved) {
							console.log('Image saved successfully!')
						}

					
						this.msg = 'save image success'

					})
					.catch(err => {
						{
							Toast.makeText(err).show();

						}
					})
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
		},
		msg(val, oldVal){
			Toast.makeText(val).show();
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
