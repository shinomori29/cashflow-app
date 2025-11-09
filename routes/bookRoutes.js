import express from 'express'
import { create, remove, getBook } from '../controllers/bookController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Gunakan authMiddleware di sini
router.post('/create', authMiddleware, create)
router.delete('/remove/:id', authMiddleware, remove)
router.get('/my-books', authMiddleware, getBook)

export default router
