import Address from "../models/Address.js";


// Add Address: /api/address/add
export const addAddress = async (req, res) => {

    try{

        const addressData = req.body;
        const userId = req.user.userId;
        await Address.create({...addressData, userId})
        return res.json({success: true, message: "Address Added"})

    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}


// Get Address : /api/address/get
export const getAddress = async (req, res) => {
    try{
        const userId = req.user.userId;
        const address = await Address.find({userId})
        return res.json({success: true, address})
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}