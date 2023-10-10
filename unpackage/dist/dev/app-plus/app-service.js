if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const recorderManager = uni.getRecorderManager();
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = true;
  const _sfc_main$1 = {
    components: {},
    data() {
      return {
        title: "Hello",
        token: "",
        adioFileData: "",
        adioSize: "",
        resContent: "",
        luyinStatus: true
      };
    },
    onLoad() {
      let self = this;
      recorderManager.onStop(function(res) {
        formatAppLog("log", "at pages/index/index.vue:41", "recorder stop" + JSON.stringify(res));
        self.voicePath = "_www/static/test.wav";
        self.Audio2dataURL("_www/static/test.wav");
      });
    },
    methods: {
      startLuyin() {
        formatAppLog("log", "at pages/index/index.vue:51", "开始录音");
        recorderManager.start(
          {
            sampleRate: 16e3,
            numberOfChannels: 1,
            encodeBitRate: 96e3,
            format: ""
          }
        );
        this.luyinStatus = false;
      },
      endLuyin() {
        formatAppLog("log", "at pages/index/index.vue:63", "录音结束");
        recorderManager.stop();
        this.luyinStatus = true;
      },
      startYuyin() {
        var _this = this;
        formatAppLog("log", "at pages/index/index.vue:70", "开始转换");
        uni.request({
          url: "https://aip.baidubce.com/oauth/2.0/token",
          //仅为示例，并非真实接口地址。
          data: {
            grant_type: "client_credentials",
            client_id: "Tmjy8M9nRljcdhgjD21F5NdX",
            client_secret: "GKY4miodAIbVkDaPj8cUuXBEpDbnR7uj"
          },
          header: {
            "content-type": "application/json;charset=utf-8"
            //自定义请求头信息
          },
          success: (res) => {
            _this.token = res.data.access_token;
            _this.PostData();
          }
        });
      },
      PostData() {
        var postData = {
          format: "wav",
          //语音文件的格式，pcm/wav/amr/m4a。不区分大小写。推荐pcm文件
          rate: 16e3,
          //	采样率，16000，固定值 此处文档参数16000，达不到这种高保真音频，故 使用8000
          dev_pid: 1537,
          //普通话
          channel: 1,
          //声道数，仅支持单声道，请填写固定值 1
          cuid: "cuid",
          //用户唯一标识，用来区分用户，计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内。
          token: this.token,
          speech: this.adioFileData,
          //本地语音文件的的二进制语音数据 ，需要进行base64 编码。与len参数连一起使用。
          len: this.adioSize
          //本地语音文件的的字节数，单位字节 init
        };
        formatAppLog("log", "at pages/index/index.vue:105", JSON.stringify(postData) + "1111");
        uni.request({
          url: "http://vop.baidu.com/server_api",
          //仅为示例，并非真实接口地址。
          data: postData,
          header: {
            "content-type": "Content-Type:audio/pcm;rate=16000"
            //自定义请求头信息
          },
          method: "POST",
          success: (res) => {
            this.resContent = res.data;
            formatAppLog("log", "at pages/index/index.vue:116", JSON.stringify(res.data) + "识别结果");
          }
        });
      },
      Audio2dataURL(path) {
        var _this = this;
        plus.io.resolveLocalFileSystemURL(path, function(entry) {
          entry.file(function(file) {
            var reader = new plus.io.FileReader();
            _this.adioSize = file.size;
            reader.onloadend = function(e) {
              formatAppLog("log", "at pages/index/index.vue:128", e.message);
              _this.adioFileData = e.target.result.split(",")[1];
            };
            reader.readAsDataURL(file);
            _this.startYuyin();
          }, function(e) {
            formatAppLog("log", "at pages/index/index.vue:138", e);
          });
        }, function(e) {
          formatAppLog("log", "at pages/index/index.vue:142", e);
        });
      },
      //播放
      playVoice() {
        formatAppLog("log", "at pages/index/index.vue:147", "播放录音");
        if (this.voicePath) {
          innerAudioContext.src = this.voicePath;
          innerAudioContext.play();
        } else {
          formatAppLog("log", "at pages/index/index.vue:153", "播放失败");
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "text-area" }, [
        vue.withDirectives(vue.createElementVNode(
          "button",
          {
            onClick: _cache[0] || (_cache[0] = (...args) => $options.startLuyin && $options.startLuyin(...args)),
            class: "recordingStyle"
          },
          "开始录音",
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $data.luyinStatus]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "button",
          {
            onClick: _cache[1] || (_cache[1] = (...args) => $options.endLuyin && $options.endLuyin(...args)),
            class: "recordingStyle"
          },
          "结束录音",
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, !$data.luyinStatus]
        ])
      ]),
      vue.createElementVNode("view", { class: "Sound_btn" }, [
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.playVoice && $options.playVoice(...args))
        }, "试听录音"),
        vue.createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = (...args) => $options.startYuyin && $options.startYuyin(...args))
        }, "转文字")
      ]),
      vue.withDirectives(vue.createElementVNode(
        "view",
        { class: "reslut_box" },
        [
          vue.createElementVNode(
            "p",
            null,
            vue.toDisplayString($data.resContent.result),
            1
            /* TEXT */
          )
        ],
        512
        /* NEED_PATCH */
      ), [
        [vue.vShow, $data.resContent]
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/Roal_L/Desktop/Uniapp/s2t/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/Roal_L/Desktop/Uniapp/s2t/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
