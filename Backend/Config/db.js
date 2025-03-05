import mongoose from 'mongoose'

const db = 'mongodb+srv://anning:deliverySite@cluster0.qjwp4.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0'

export const connectDB = async () => {
    await mongoose.connect(db)
    .then(()=> console.log('DB connected'));
}