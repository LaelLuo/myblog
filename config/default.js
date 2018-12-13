module.exports = {
  port: 3000, // 程序监听端口
  session: {
    secret: 'myblog', // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    key: 'myblog', // 设置 cookie 中保存 session id 的字段名称
    maxAge: 2592000000 // 过期时间，过期后 cookie 中的 session id 自动删除
  },
  mongodb: 'mongodb://localhost:27017/myblog' // 数据库连接地址
}
