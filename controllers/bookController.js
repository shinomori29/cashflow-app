import Book from '../models/book.js'

export const create = async (req, res, next) => {
  try {
    const { title } = req.body
    const ownerId = req.user.id // dari JWT token

    if (!title) {
      return res.status(400).json({ message: 'Title wajib diisi' })
    }

    const book = new Book({
      title,
      ownerId,
      members: [ownerId] // otomatis masukkan owner sebagai member pertama
    })

    await book.save()

    res.status(201).json({ message: 'Book berhasil dibuat', book })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params // id book yang ingin dihapus
    const userId = req.user.id // id user dari token

    // Cari book berdasarkan ID
    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({ message: 'Book tidak ditemukan' })
    }

    // Pastikan hanya owner yang bisa menghapus
    if (book.ownerId.toString() !== userId) {
      return res.status(403).json({ message: 'Tidak punya izin untuk menghapus book ini' })
    }

    // Hapus book
    await book.deleteOne()

    res.status(200).json({ message: 'Book berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}

export const getBook = async (req, res, next) => {
  try {
    const userId = req.user.id // dari JWT token

    // Cari semua book yang memiliki user ini di daftar members
    const books = await Book.find({ members: userId })

    res.status(200).json({
      message: 'Daftar book yang kamu ikuti',
      count: books.length,
      books
    })
  } catch (err) {
    next(err)
  }
}
