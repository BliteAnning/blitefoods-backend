import userModel from "../Models/userModel.js";
import orderModel from "../Models/orderModel.js";
import axios from "axios"
//import Stripe from 'stripe'

//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//placing user order from  frontend
const placeOrder = async (req, res) =>{

    const frontend_url = "http://localhost:3000"
   //creating new order
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        //saving to the database
        await newOrder.save();

        //clearing user's cartData
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}})

        let totalAmount = req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalAmount += 2; // Delivery charge

        //get the user item for the stripe payment
        const paystackRes = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: req.body.email, // Make sure email is sent from frontend
                amount: totalAmount * 100, // Paystack expects amount in kobo
                //reference: `order_${newOrder._id}`,
                //callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (paystackRes.data.status) {
            res.json({ success: true, session_url: paystackRes.data.data.authorization_url });
        } else {
            res.json({ success: false, message: "Paystack initialization failed" });
        }
    } catch (error) {
        console.log(error.response?.data || error);
        res.json({ success: false, message: "error" });
    }
}
export  default placeOrder;