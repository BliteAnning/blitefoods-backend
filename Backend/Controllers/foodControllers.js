import foodModel from '../Models/foodModel.js'
import fs from 'fs'

//add food
const addFood = async (req,res) =>{
    let imageFilename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: imageFilename
    })

    try {
        await food.save();
        res.json({success:true, message:"food added"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

//all food list
const listFood = async (req, res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true, data: foods})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error})
    }
}

//remove food item

const removeFood = async (req, res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`Uploads/${food.image}`, ()=>{})


        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"food removed"})

    } catch (error) {
        console.log(error)
        res.json({success:true, message: "error"});
    }
}
export  {
    addFood,
    listFood,
    removeFood
}