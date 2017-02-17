
# Sina Uploader

## 介绍
  vue版本的多文件上传组件，实现文件拖拽上传功能
## api

【action】上传接口

【params】额外的上传参数，这个根据业务逻辑来确定是否传递

【nowNum】当前上传了几个文个数

【maxNum】最大上传个数

【minNum】最小上传个数

【maxSize】文件默认大小 40k

【accept】文件类型，默认为<jpg>，父级可以动态改变服务器接受的文件类型

【onStart】文件开始上传时触发

【onProgress】上传进度，假的模拟

【onSuccess】上传成功时触发

【onError】上传失败时触发

【onCheckoutError】文件校验时错误触发

