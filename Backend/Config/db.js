import mongoose from 'mongoose'

const db = process.env.DB;

export const connectDB = async () => {
    await mongoose.connect(db)
    .then(()=> console.log('DB connected'));
}