<template>
	<view class="content">
		<view class="text-area">
			<button @click="startLuyin" v-show="luyinStatus"  class="recordingStyle">开始录音</button>
			<button @click="endLuyin" v-show="!luyinStatus" class="recordingStyle">结束录音</button>
			
		</view>
		<view class="Sound_btn">
			<button @click="playVoice">试听录音</button>
			<button @click="startYuyin">转文字</button>
		</view>
		<view class="reslut_box" v-show="resContent"><p>{{resContent.result}}</p></view>
	</view>
	
</template>
 
<script >
	//录音
	const recorderManager = uni.getRecorderManager();
//播放录音
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.autoplay = true;
export default {
	components: {
 
	},
	data() {
		return {
			title: 'Hello',
			token: '',
			adioFileData: '',
			adioSize: '',
			resContent: '',
			luyinStatus: true
		}
	},
	onLoad() {
		let self = this;
		recorderManager.onStop(function(res) {
			//录音后的回调函数
			console.log('recorder stop' + JSON.stringify(res));
	/* 		self.voicePath = res.tempFilePath;
			self.Audio2dataURL(res.tempFilePath); */
			self.voicePath = '_www/static/test.wav'
			self.Audio2dataURL('_www/static/test.wav');
		});
 
	},
	methods: {
		startLuyin() {
			console.log('开始录音')
			recorderManager.start(
	 		{
				sampleRate: 16000,
				numberOfChannels: 1,
				encodeBitRate:96000,
				format: ''
			} 
			);
			this.luyinStatus = false
		},
		endLuyin() {
			console.log('录音结束');
			recorderManager.stop();
			this.luyinStatus = true
 
		},
		startYuyin() {
			var _this = this;
			console.log('开始转换')
			//获取token
			uni.request({
				url: 'https://aip.baidubce.com/oauth/2.0/token', //仅为示例，并非真实接口地址。
				data: {
					grant_type: 'client_credentials',
					client_id: 'Tmjy8M9nRljcdhgjD21F5NdX',
					client_secret: 'GKY4miodAIbVkDaPj8cUuXBEpDbnR7uj',
				},
				header: {
					'content-type': 'application/json;charset=utf-8' //自定义请求头信息
				},
				success: (res) => {
					// console.log(JSON.stringify(res));
 
					_this.token = res.data.access_token;
					// alert( _this.resContent)
					_this.PostData();
					// _this.$refs.popup.open()
				}
			});
 
 
		},
		PostData() {
			var postData = {
				format: 'wav', //语音文件的格式，pcm/wav/amr/m4a。不区分大小写。推荐pcm文件
				rate: 16000, //	采样率，16000，固定值 此处文档参数16000，达不到这种高保真音频，故 使用8000
				dev_pid: 1537,//普通话
				channel: 1, //声道数，仅支持单声道，请填写固定值 1
				cuid: 'cuid', //用户唯一标识，用来区分用户，计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内。
				token: this.token,
				speech: this.adioFileData, //本地语音文件的的二进制语音数据 ，需要进行base64 编码。与len参数连一起使用。
				len: this.adioSize //本地语音文件的的字节数，单位字节 init
			}
			console.log(JSON.stringify(postData) + '1111')
			//调用语音识别接口
			uni.request({
				url: 'http://vop.baidu.com/server_api', //仅为示例，并非真实接口地址。
				data: postData,
				header: {
					'content-type': 'Content-Type:audio/pcm;rate=16000' //自定义请求头信息
				},
				method: 'POST',
				success: (res) => {
					this.resContent = res.data
					console.log(JSON.stringify(res.data) + "识别结果");
					// this.text = 'request success';
				}
			})
		},
		Audio2dataURL(path) {
			var _this = this;
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				entry.file(function(file) {
					var reader = new plus.io.FileReader();
					_this.adioSize = file.size;
					reader.onloadend = function(e) {
						console.log(e.message);
						//console.log(file.size);
						_this.adioFileData = e.target.result.split(",")[1];
						//_this.adioSize = _this.adioFileData.size;
						//console.log(typeof _this.adioFileData);
						
					};
					reader.readAsDataURL(file);
					_this.startYuyin()
				}, function(e) {
					console.log(e)
					// mui.toast("读写出现异常: " + e.message);
				})
			}, function(e) {
				console.log(e)
			})
		},
		//播放
		playVoice() {
			console.log('播放录音');
			if (this.voicePath) {
				innerAudioContext.src = this.voicePath;
				innerAudioContext.play();
			}
			else {
				console.log('播放失败');
			}
		}
	}
} 
</script>
 
<style >
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
 
	.logo {
		height: 200 rpx;
		width: 200 rpx;
		margin-top: 200 rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50 rpx;
	}
 
	.text-area {
		display: flex;
		justify-content: center;
		margin-top: 10 vh;
	}
	.text-area.recordingStyle {
		width: 100 px;
		height: 100 px;
		border-radius: 50 % ;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16 px;
		color: # fff;
		background: #409eff;
	}
	.Sound_btn{
		display:flex;
		align-items:center;
		margin:10px 0 0 0;		
	}
	.Sound_btn>button{
		background:none;	
	}
	.title {
		font-size: 36rpx;
		color: # 8 f8f94;
	}
	.reslut_box {
		width: 90 % ;
		background: #409eff10;
		margin:1em 5%;
		padding:0.5em 0;
		border-radius:10px;
	}
	.reslut_box p{
		margin:0 20px;
	}
</style>