const { response } = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const { generateToken } = require('../helpers/jwt')

const createUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'User already exists',
      })
    }

    user = new User(req.body)

    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    await user.save()

    const token = await generateToken(user._id, user.name)

    res.status(201).json({
      ok: true,
      msg: 'User created',
      uid: user._id,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error, try again or contact the administrator',
    })
  }
}

const loginUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'User not found',
      })
    }

    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      })
    }

    const token = await generateToken(user._id, user.name)

    res.json({
      ok: true,
      msg: 'Login ok',
      uid: user._id,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error, try again or contact the administrator',
    })
  }
}

const revalidateToken = async (req, res = response) => {
  const { uid, name } = req

  const token = await generateToken(uid, name)

  res.json({
    ok: true,
    msg: 'Token revalidated',
    token,
    uid,
    name,
  })
}

const getUser = async (req, res = response) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      })
    }

    res.json({
      ok: true,
      msg: 'User found',
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error, try again or contact the administrator',
    })
  }
}

const updateUser = async (req, res = response) => {
  const { id } = req.params
  const { name, email, password } = req.body

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'User not found',
      })
    }

    if (name) {
      user.name = name
    }

    if (email) {
      user.email = email
    }

    if (password) {
      const salt = bcrypt.genSaltSync()
      user.password = bcrypt.hashSync(password, salt)
    }

    await user.save()

    res.json({
      ok: true,
      msg: 'User updated',
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error, try again or contact the administrator',
    })
  }
}

const getUsers = async (req, res = response) => {
  try {
    const users = await User.find()

    res.json({
      ok: true,
      msg: 'Users found',
      users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error, try again or contact the administrator',
    })
  }
}

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
  getUser,
  updateUser,
  getUsers,
}
