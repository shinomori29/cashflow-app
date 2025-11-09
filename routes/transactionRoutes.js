import express from 'express'
import { create, remove, update, getTransaction, summary } from '../controllers/transactionController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Gunakan authMiddleware di sini
router.post('/create', authMiddleware, create)
router.delete('/remove/:id', authMiddleware, remove)
router.put('/update/:id', authMiddleware, update)
router.get('/:bookId', authMiddleware, getTransaction)
router.get('/summary/:bookId', authMiddleware, summary)

export default router