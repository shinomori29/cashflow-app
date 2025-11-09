import Transaction from '../models/transaction.js'
import Book from '../models/book.js'

export const create = async (req, res, next) => {
  try {
    const { bookId, type, note, amount } = req.body
    const recordBy = req.user.id // ambil ID user dari token (authMiddleware)

    // Validasi input
    if (!bookId || !type || !note || !amount) {
      return res.status(400).json({ message: 'Semua field wajib diisi' })
    }

    // Pastikan bookId valid
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book tidak ditemukan' })
    }

    // Buat transaksi baru
    const transaction = new Transaction({
      bookId,
      type,
      note,
      amount,
      recordBy
    })

    await transaction.save()

    res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      transaction
    })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params  // ID transaksi
    const userId = req.user.id // ID user dari JWT token

    // Cari transaksi
    const transaction = await Transaction.findById(id)
    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
    }

    // Ambil data buku untuk cek owner
    const book = await Book.findById(transaction.bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book tidak ditemukan' })
    }

    // Cek apakah user adalah pembuat transaksi atau owner book
    if (transaction.recordBy.toString() !== userId && book.ownerId.toString() !== userId) {
      return res.status(403).json({ message: 'Kamu tidak punya akses untuk menghapus transaksi ini' })
    }

    await Transaction.findByIdAndDelete(id)

    res.status(200).json({ message: 'Transaksi berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const { id } = req.params // ID transaksi
    const userId = req.user.id
    const { type, note, amount } = req.body

    // Cari transaksi
    const transaction = await Transaction.findById(id)
    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
    }

    // Ambil data buku untuk cek owner
    const book = await Book.findById(transaction.bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book tidak ditemukan' })
    }

    // Cek hak akses
    if (transaction.recordBy.toString() !== userId && book.ownerId.toString() !== userId) {
      return res.status(403).json({ message: 'Kamu tidak punya akses untuk mengedit transaksi ini' })
    }

    // Update field yang dikirim
    if (type) transaction.type = type
    if (note) transaction.note = note
    if (amount) transaction.amount = amount

    await transaction.save()

    res.status(200).json({
      message: 'Transaksi berhasil diperbarui',
      transaction
    })
  } catch (err) {
    next(err)
  }
}

export const getTransaction = async (req, res, next) => {
  try {
    const { bookId } = req.params
    const userId = req.user.id

    // Pastikan book ada
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book tidak ditemukan' })
    }

    // Pastikan user adalah member book tersebut
    if (!book.members.includes(userId)) {
      return res.status(403).json({ message: 'Kamu tidak punya akses ke book ini' })
    }

    // Ambil semua transaksi dari book tersebut
    const transactions = await Transaction.find({ bookId }).sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Daftar transaksi berhasil diambil',
      count: transactions.length,
      transactions
    })
  } catch (err) {
    next(err)
  }
}

export const summary = async (req, res, next) => {
  try {
    const { bookId } = req.params
    const userId = req.user.id

    // Pastikan book ada
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book tidak ditemukan' })
    }

    // Pastikan user adalah member dari book
    if (!book.members.includes(userId)) {
      return res.status(403).json({ message: 'Kamu tidak punya akses ke book ini' })
    }

    // Ambil semua transaksi dari book
    const transactions = await Transaction.find({ bookId })

    // Hitung total income & expense
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount
      } else if (tx.type === 'expense') {
        totalExpense += tx.amount
      }
    })

    // Hitung saldo akhir
    const balance = totalIncome - totalExpense

    res.status(200).json({
      message: 'Ringkasan transaksi berhasil diambil',
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactions.length
    })
  } catch (err) {
    next(err)
  }
}
