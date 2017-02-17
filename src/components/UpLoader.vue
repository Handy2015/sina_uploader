<template>
  <div :class="[
      'upload-dragger-panel',
      dragIn ? 'drag-in' : 'drag-out',
      isUploader ? 'uploaded' : ''
    ]"
    @drop="dragHandler"
    @dragenter="dragenterHandler"
    @dragleave="dragleaveHandler"
    @dragover="dragoverHandler">
    <!-- 多文件文件上传控件 -->
    <!-- 说明： -->
    <!-- * 【action】上传接口
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
    -->
    <div class="left-massege-box">
      <a href="javascript:;" class="file">
        <x-icon name="picture"></x-icon>
        <span>点击添加{{  }}或者拖动{{  }}到这里</span>
        <input
          type="file"
          name="file"
          :multiple="multiple"
          :accept="getMimetype"
          @change="doChange"/>
      </a>
    </div>
    <div class="right-message-box">
      <div class="tip-message-box__inner">
        <p style="color: #fe9533;"> 提示：最多支持上传{{ maxNum - nowNum }}个文件；</p>
        <p> 尺寸规范： {{ maxSize }}kb </p>
        <p> 文件格式： {{ accept }}</p>
      </div>
    </div>

    <div class="progress" :style="progressStyle"></div>

    <!-- 浏览器拖拽功能，在dragenter状态时（也就是在进入时无法拿到files） -->
    <!-- <div class="pruview-container">
      <x-uploaderpruview v-for="(file, index) in pruviewFiles"
        :file="file"
        :id="'upload_pruview_' + index">
      </x-uploaderpruview>
    </div> -->
  </div>
</template>


<script>
  // baseComponents
  import XIcon from 'components/icon'

  // bizComponents
  import uploaderUtils from '../core/uploaderUtils'

  export default {
    mixins: [uploaderUtils],
    computed: {
      isUploader () {
        return this.nowNum > 0
      },
      uploadNum () {
        return this.maxNum - this.nowNum
      },
      progressStyle () {
        return {
          'width': this.percentage + '%',
          'display': this.percentage === 0 ? 'none' : 'block',
          'background': this.status === 'exception' ? 'rgba(239,86,83,0.8)' : ''
        }
      }
    },
    methods: {
      dragHandler (e) {
        // 取消默认浏览器拖拽效果
        e.preventDefault()
        this.dragIn = false
        this.completeHandler(e.dataTransfer.files)
      },
      dragenterHandler (e) {
        this.dragIn = true
        this.pruviewFiles = e.dataTransfer.files
        console.log(e.dataTransfer.files)
      },
      dragleaveHandler (e) {
        this.dragIn = false
        console.log(e.dataTransfer.files)
      },
      dragoverHandler (e) {
        this.dragIn = true
        console.log(e.dataTransfer.files)
      }
    },
    components: {
      XIcon
    },
    data () {
      return {
        pruviewFiles: [],
        isSelect: false,
        dragIn: false,
        thisHeight: 100,
        MASSEGE_MAP: {
          image: '图片',
          word: '文档',
          excel: '文档',
          mp4: '视频',
          flv: '视频',
          zip: '文档',
          flash: 'fla'
        }
      }
    }
  }
  // 拖离
  window.document.addEventListener('dragleave', function (e) {
    e.preventDefault()
  })
  // 拖后放
  window.document.addEventListener('drop', function (e) {
    e.preventDefault()
  })
  // 拖进
  window.document.addEventListener('dragenter', function (e) {
    e.preventDefault()
  })
  // 拖来拖去
  window.document.addEventListener('dragover', function (e) {
    e.preventDefault()
  })
</script>


<style scoped>
  .upload-dragger-panel {
    display: flex;
    position: relative;
    background: #f4f8fb;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    text-decoration: none;
    border-style: dashed;
    width: 100%;
    box-sizing: border-box;
    height: 300px;
    transition: 0.3s;
  }
  .upload-dragger-panel.uploaded{
    height: 130px;
  }
  .upload-dragger-panel::before {
    content: "请释放鼠标";
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 46px;
    font-weight: 100;
    color: #aaa;
    opacity: 0;
    transition: 0.3s;
  }
  .upload-dragger-panel__uploader {
    height: 100px;
  }
  .drag-in {
    border-color: #337AB7;
    background: #dfeefb;
    /*color: #337AB7;*/
  }
  .drag-in.upload-dragger-panel::before {
    opacity: 1;
  }
  .drag-in .file{
    opacity: 0.5;
  }
  .drag-in{
    

  }
  .drag-out {
    border-color: #BFBFBF;
    /*color: #BFBFBF;*/
  }
  .progress {
    position: absolute;
    border: 3px solid #f4f8fb;
    height: 100%;
    width: 0;
    background: rgba(130, 202, 111, 0.8);
    transition: 0.5s;
    box-sizing: border-box;
  }
  .upload-select-box {
    display: inline-block;
    position: absolute;
    float: left;
    margin-left: 18%;
    margin-top: 15px
  }
  .upload-select-box__uploader {
    margin-top: 0px;
  }
  .file {
    position: absolute;
    display: inline-block;
    overflow: hidden;
    color: #6cb5f4;
    text-decoration: none;
    text-align: center;
    font-size: 54px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    transition: 0.3s
  }
  .file .x-icon-picture{
    vertical-align: middle;
  }
  .file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .file span {
    font-size: 20px;
    font-weight: 600;
    vertical-align: middle;
    line-height: 18px;
  }
  .file:hover {
    /*background: #AADFFD;
    border-color: #78C3F3;*/
    color: #004974;
    text-decoration: none;
  }

  .left-massege-box {
    float: left;
    width: 61%;
    color: #6cb5f4;
    position: relative;
  }

  .right-message-box {
    position: relative;
    font-size: 14px;
    width: 39%;
    border-left: 1px dashed #ccc;
    box-sizing: border-box;
  }
  .tip-message-box__inner {
    position: absolute;
    line-height: 14px;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-40%,-50%);
    color: #666;
  }
  .tip-message-box__uploader {
    display: block;
    font-size: 12px;
    margin-left: 33%;
    margin-top: 30px;
  }

  .pruview-container {

  }
</style>
