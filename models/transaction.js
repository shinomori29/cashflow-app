import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    type: { type: String, required: true },
    note: { type: String, required: true },
    amount: { type: Number, required: true },
    recordBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)