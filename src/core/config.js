/**
 * 静态配置文件
 */
export default {
  // 提示信息
  FILE_NUM_MASSAGE: '上传文件不可超出最大限制，部分文件将被删除，是否继续?',
  FILE_SEZE_MASSAGE: '部分文件大小超出上传限制，将被删除，是否继续?',
  FILE_TYPE_MASSAGE: '部分文件类型不否，将被删除，是否继续?',
  FILE_UPLOAD_ERROR_MASSAGE: '由于网络原因，文件上传失败，是否继续?',

  // 配置提示按钮
  ERROR_BUTTON_MASSAGE: {
    cancelButtonText: '取消上传',
    confirmButtonText: '继续上传'
  },
  ERROR_BUTTON_DEFAULT_MASSAGE: {
    cancelButtonText: '取消',
    confirmButtonText: '确定'
  },
  
  // 上传类型
  MIME_TYPE: {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    swf: 'application/x-shockwave-flash',
    mp4: 'audio/mp4, video/mp4',
    // flv: 'video/x-flv',
    // flv: 'flv-application/octet-stream',
    flv: '.flv',
    zip: 'aplication/zip',
    word: 'application/msword',
    excel: 'application/vnd.ms-excel'
  }
}
