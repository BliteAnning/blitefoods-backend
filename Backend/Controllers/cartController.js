import userModel from '../Models/userModel.js'

//add items to the cart
const addCart = async (req, res) =>{
    try {
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemid]) {
            cartData[req.body.itemid] =1
        }
        else{
            cartData[req.body.itemid] += 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true, message: "Added to Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Error"});
        
    }
}

//remove items from the cart
const removeFromCart = async (req,res)=>{
    try{
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemid]>0){
            cartData[req.body.itemid] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({success:true, message: "Removed from cart"})
    }
    catch(error){
        res.json({success:false, message:"Error removing item"})
    }
} 
//get user cartdata
const getCart= async (req, res) =>{
    try{
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
       // await userModel.findById(req.body.userId, {cartData})
        res.json({success: true, cartData})
    }
    catch(error){
        res.json({success: true, message:"error occured"})
    }
    

}
export {
    addCart,
    removeFromCart,
    getCart
}