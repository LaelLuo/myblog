const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const UserModel = require('../models/users')
const PostModel = require('../models/posts')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/:username', function (req, res, next) {
  let username = req.params.username
  UserModel.getUserByName(username).then(function (user) {
    if (user) {
      PostModel.getPosts(user._id).then(function (posts) {
        res.render('user', {user: user, posts: posts})
      })
    } else {
      res.render('404')
    }
  })
})

router.get('/:username/edit', checkLogin, function (req, res, next) {
  UserModel.getUserByName(req.params.username).then(function (user) {
    res.render('editUser', {
      user: user
    })
  })
})

router.post('/:username/edit', checkLogin, function (req, res, next) {
  const username = req.params.username
  const gender = req.fields.gender
  const bio = req.fields.bio
  let newAvatar = req.files.avatar.path.split(path.sep).pop()

  try {
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('back')
    return
  }

  UserModel.getUserByName(username).then(function (user) {
    let oldAvatar = user.avatar
    if (!req.files.avatar.name) {
      fs.unlink(req.files.avatar.path, (err) => {
        if (err) {
          console.log(err)
        }
      })
      newAvatar = oldAvatar
    }

    UserModel.updateById(user._id, {
      gender,
      bio,
      avatar: newAvatar
    }).then((result) => {
      if (newAvatar !== oldAvatar) {
        fs.unlink(path.join(__dirname, '../public/img/' + oldAvatar), (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
      req.flash('success', '修改成功')
      res.redirect('/posts')
    })
  })
})

module.exports = router
