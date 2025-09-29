import userModel from "../Models/userModel.js";
import orderModel from "../Models/orderModel.js";
import axios from "axios"


//placing user order from  frontend
const placeOrder = async (req, res) =>{


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

        //get the user item for the payment
        const paystackRes = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: req.body.email, 
                amount: totalAmount * 100, // Paystack expects amount in kobo
                reference: `order_${newOrder._id}`,
                callback_url: `${process.env.FRONTEND_URL}/verify?orderId=${newOrder._id}`
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


const verifyOrder = async (req, res)=>{
    const {orderId, reference} = req.body;
    try {
    // Verify with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    if (paystackRes.data.data.status === "success") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid", error: false });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      throw new Error("Not paid");
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
}

//user orders
const userOrder = async (req, res) =>{
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({
            success: true,
            error:false,
            data: orders
        })
    } catch (error) {
        res.json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

//listing all orders at the admin panel
const listOrder = async (req, res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({
            success: true,
            error: false,
            data: orders
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

//api for updating order status
const updateStatus = async (req, res)=>{
    try {
         await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
         res.json({
            success: true,
            error: false,
            message: "status update"
         })
    } catch (error) {
        console.log(error)
        res.json({
            success: false, 
            error: true,
            message: error.message || error
        })
    }
}


export  {placeOrder, verifyOrder, userOrder, listOrder, updateStatus};