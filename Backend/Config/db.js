import mongoose from "mongoose";

async function connectDB (){
    try {
        mongoose.connect(process.env.DB)
        console.log("DB connected")
    } catch (error) {
        console.log(err)
    }
}
export default connectDB;