const User = require('../models/user.model')
const objectConverter = require('../utils/objectConverter')

exports.findAll = async (req,res)=>{

    const queryObj = {};
    const userTypeQP = req.query.userType;
    const userStatusQP = req.query.userStatus;
    if(userTypeQP){
        queryObj.userType = userTypeQP
    }
    if(userStatusQP){
        queryObj.userStatus = userStatusQP
    }


    try{
        const users = await User.find(queryObj);

        res.status(200).send(objectConverter.userResponse(users));

    }catch(err){
        console.log("#### Error while fetching all users ####", err.message);
        res.status(500).send({
            message : "Internal server error"
        })
    }
}

exports.findByUserId = async(req,res)=>{
    try{
        const user = await User.find({userId : req.params.Id});
        res.status(200).send(objectConverter.userResponse(user));
    }catch(err){
        console.log("#### Error while searching for the user ####", err.message);
        res.status(500).send({
            message : "Internal server error"
        })
    }
}

exports.update = async(req,res)=>{
    try{
        const user = await User.findOne({userId : req.params.Id})
        user.userStatus = req.body.userStatus != undefined ? req.body.userStatus : user.userStatus
        user.name = req.body.name != undefined ? req.body.name : user.name
        user.userType = req.body.userType != undefined ? req.body.userType : user.userType
        const updatedUser = await user.save();
        console.log(`#### ${updatedUser.userType} ${updatedUser.name} data updated ####`);
        res.status(200).send({
            name : updatedUser.name,
            userId : updatedUser.userId,
            email : updatedUser.email,
            userTypes : updatedUser.userTypes,
            userStatus : updatedUser.userStatus
        })
    }catch(err){
        console.log("#### Error while DB operation ####", err.message);
        res.status(500).send({
            message : "Internal server error"
        })
    }
}