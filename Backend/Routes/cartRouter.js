import express from 'express'
import { addCart,removeFromCart, getCart } from '../Controllers/cartController.js'
import authMiddleware from '../Middlewares/auth.js';

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addCart)
cartRouter.post("/remove", authMiddleware, removeFromCart)
cartRouter.post("/get", authMiddleware, getCart)

export default cartRouter;