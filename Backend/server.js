import express from 'express'
import cors from 'cors'
import connectDB  from './Config/db.js'
import foodRouter from './Routes/foodRouter.js'
import 'dotenv/config'
import userRouter from './Routes/userRouter.js'
import cartRouter from './Routes/cartRouter.js'
import orderRouter from './Routes/orderRouter.js'

// app config
const app = express()
const port = 4000

//database connection
connectDB()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/food', foodRouter)
app.use('/images', express.static('uploads'))
app.use('/api/user', userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)


app.get("/", (req, res)=>{
    res.send("API working")
})

app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`)
})
//mongodb+srv://anning:<db_password>@cluster0.qjwp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0