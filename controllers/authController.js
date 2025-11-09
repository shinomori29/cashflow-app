import bcrypt from 'bcrypt'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'


export const register = async (req, res, next) => {
    try {
    const { username, email, password } = req.body


    if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' })
    }


    // cek apakah user sudah ada
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) return res.status(409).json({ message: 'User sudah terdaftar' })


    // hash password
    const saltRounds = 10
    const hashed = await bcrypt.hash(password, saltRounds)


    const user = new User({ username, email, password: hashed })
    await user.save()


    // buat token (nilai payload bisa disesuaikan, jangan simpan password di token)
    const token = generateToken({ id: user._id, username: user.username })


    // kembalikan user (tanpa password) dan token
    res.status(201).json({
    user: { id: user._id, username: user.username, email: user.email },
    token,
    })
    } catch (err) {
    next(err)
    }
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'username dan password wajib diisi' })
    }

    // cari user berdasarkan username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }

    // bandingkan password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' })
    }

    // buat token baru
    const token = generateToken({ id: user._id, username: user.username })

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    })
  } catch (err) {
    next(err)
  }
}