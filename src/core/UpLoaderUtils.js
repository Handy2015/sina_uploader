/**
 * 说明：
 * 【action】上传接口
 * 【params】额外的上传参数
 * 【nowNum】当前上传了几个文个数
 * 【maxNum】最大上传个数
 * 【minNum】最小上传个数
 * 【maxSize】文件默认大小 40k
 * 【accept】文件类型，默认为<jpg>，父级可以动态改变服务器接受的文件类型
 * 【onStart】文件开始上传时触发
 * 【onProgress】上传进度，假的模拟
 * 【onSuccess】上传成功时触发
 * 【onError】上传失败时触发
 * 【onCheckoutError】文件校验时错误触发
 */

// baseComponents
import MessageBox from 'components/message-box'
import Message from 'components/message'

import utils from 'src/common/utils'

// others
import * as upload from 'api/uploader'
import config from './config'

// 把message写入全局
var $alert = MessageBox.alert
var $confirm = MessageBox.confirm
var $message = Message

export default {
  props: {
    action: {
      type: String,
      required: true,
      default: 'api/uploader/uploader'
    },
    params: {
      type: Object,
      default () {
        return null
      }
    },
    nowNum: {
      type: Number,
      default: 3
    },
    maxNum: {
      type: Number,
      default: 5
    },
    minNum: {
      type: Number,
      default: 1
    },
    maxSize: {
      type: Number,
      default: 40
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'jpg'
    },
    headers: {
      type: Object,
      default () {
        return {
          // 'Content-Type': 'application/x-www-form-urlencoded'
          // 'Access-Control-Request-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
          // 'Access-Control-Request-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
        }
      }
    }
  },
  computed: {
    fileSize () {
      return this.maxSize * 1024
    },
    getMimetype () {
      let accept = this.accept
      return accept.split(',').map(val => {
        return config.MIME_TYPE[val.toLowerCase()]
      }).join(',')
    }
  },
  methods: {
    doChange (e) {
      let fileList = Array.prototype.slice.call(e.target.files).concat()
      // 清空
      this.$el.getElementsByTagName('input').file.value = ''
      this.completeHandler(fileList)
    },
    /**
     * [completeHandler 选择完成后触发]
     * @param  {[type]} files [description]
     * @return {[type]}       [description]
     */
    completeHandler (files) {
      if (!files) {
        $alert('没有要上传的文件！', '提示')
        this.alert = true
        return
      }
      let postFiles = Array.prototype.slice.call(files)

      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }

      if (postFiles.length < this.minNum) {
        $alert('没有要上传的文件！', '提示')
        this.alert = true
        return
      }
      this.uploadFiles(postFiles)
    },
    /**
     * [uploadFiles 上传验证逻辑，选择/拖拽文件完成后触发]
     * 将所有的验证逻辑放到这里
     * @param  {[type]} files [文件列表]
     */
    uploadFiles (files) {
      // 文件个数大于限制处理
      if (files.length > this.maxNum) {
        this.postFiles = files.slice(0, this.maxNum)
        // this.$emit('onCheckoutError', null)
        this.$hirt(config.FILE_NUM_MASSAGE)
        return
      }

      // 验证图片类型是否合法
      let illegalFile = this.checkOutFile(files, 'type')
      if (illegalFile.length > 0) {
        this.$hirt(config.FILE_TYPE_MASSAGE, null, illegalFile)
        return
      }

      // 验证图片大小合法
      illegalFile = this.checkOutFile(files, 'size')
      if (illegalFile.length > 0) {
        this.$hirt(config.FILE_SEZE_MASSAGE, null, illegalFile)
        return
      }

      if (this.postFiles.length > 0) {
        this.post(this.postFiles)
      }
    },
    /**
     * [post 开始上传]
     * @param  {[type]} files [文件列表]
     */
    post (files) {
      // 将上传的文件塞进 fromData
      let formData = {}
      formData['files'] = files
      // files.forEach(file => {
      //   formData[file.name] = file
      // })

      // 额外的上传数据, 有添加，没有不处理
      if (this.params) {
        for (let key in this.params) {
          formData[key] = this.params[key]
        }
      }

      // 开始上传
      this.$emit('start')
      this.status = 'success'

      // 一些状态
      this.disabled = true
      this.loading = true
      this.isShowProgress = true
      this.isTimeout = false

      // 看谁跑得快
      Promise.race([upload.uploader(this.action, formData), this.simulateProgress()])
        .then(response => {
          this.clearTimer(1000, 'complete', response)
        })
        .catch(response => {
          this.status = 'exception'
          this.isTimeout = true
          this.clearTimer(1000, 'error', response)
        })
    },
    simulateProgress () {
      return new Promise((resolve, reject) => {
        let temp = 0
        let step = Math.min(100 / this.maxSize, 2)
        // console.log(step)
        this.setTimer = setInterval(() => {
          if (this.percentage < 100) {
            temp += step
            if (temp >= 100) {
              temp = 100
              reject('error')
            }
            this.percentage = temp
            // console.log(temp)
          }
        }, 100)
      })
    },
    clearTimer (delay, events, edata) {
      clearInterval(this.setTimer)
      this.percentage = 100
      this.disabled = false
      this.loading = false
      this.$emit('end')
      setTimeout(() => {
        this.isShowProgress = false
        this.percentage = 0
        if (events) {
          this.$emit(events, edata)
          if (events === 'complete') {
            this.completeFiles = utils.clone(edata)
          } else {
            this.$hirt(config.FILE_UPLOAD_ERROR_MASSAGE, config.ERROR_BUTTON_DEFAULT_MASSAGE)
          }
        }
      }, delay)
    },
    checkOutFile (files, type) {
      // 校验文件信息是否合法
      let legalFiles = []
      let illegalFile = []
      files.forEach(file => {
        let flag = type === 'size' ? this.isSize(file.size) : this.isType(file.type)
        if (!flag) {
          illegalFile.push(file.name)
        } else {
          legalFiles.push(file)
        }
      })
      this.postFiles = legalFiles
      return illegalFile
    },
    $hirt (massage, btnmassge, error) {
      btnmassge = btnmassge || config.ERROR_BUTTON_MASSAGE
      $confirm(massage, '提示', {
        type: 'warning',
        cancelButtonText: btnmassge.cancelButtonText,
        confirmButtonText: btnmassge.confirmButtonText
      }).then(() => {
        if (!this.isTimeout) {
          this.postFiles = this.getUploadFailFiles()
        }
        this.uploadFiles(this.postFiles)
        $message({
          type: 'success',
          message: '重新开始上传'
        })
      }).catch(() => {
        this.status = 'success'
        this.postFiles = []
        $message({
          type: 'info',
          message: '已取消上传的文件'
        })
      })
    },
    isType (str) {
      let accept = this.accept.toLowerCase()
      // 好假啊 ...
      if (accept === 'flv' && str === 'video/x-flv') {
        return true
      }
      return accept.split(',').map(val => {
        return config.MIME_TYPE[val.toLowerCase()]
      }).join(',').includes(str)
    },
    isSize (size) {
      // 客户端限制文件大小
      // return size < this.fileSize
      // 不限制大小
      return true
    },
    getUploadFailFiles () {
      let fail = []
      let file
      let temp
      for (let i = 0, len = this.completeFiles.length; i < len; i++) {
        temp = this.completeFiles[i]
        for (let j = 0, leng = this.postFiles.length; j < leng; j++) {
          file = this.postFiles[j]
          if (temp.fileName === file.name) {
            if (!temp.src) {
              fail.push(file)
            }
          }
        }
      }
      return fail
    }
  },
  components: {
    MessageBox
  },
  data () {
    return {
      loading: false,
      postFiles: [],
      completeFiles: [],
      isShowProgress: false,
      percentage: 0,
      setTimer: 0,
      status: 'success',
      isTimeout: false, // 超时
      disabled: false // 开始上传需要禁用按钮（单向操作）
    }
  }
}

