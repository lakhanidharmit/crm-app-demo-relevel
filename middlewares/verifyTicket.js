const User = require("../models/user.model")
const constants = require('../utils/constants')

const validateTicketBody = async (req,res,next)=>{
    if (!req.body.title) {
        return res.status(400).send({
            message: "Failed ! Ticket title is not provided"
        });
    }

    if (!req.body.description) {
        return res.status(400).send({
            message: "Failed ! Ticket description is not provided"
        });
    }

    const engineer = await User.findOne({
        userType : constants.userTypes.engineer,
        userStatus : constants.userStatus.approved
    });
    if(!engineer){
        return res.status(400).send({
            message: "No engineer is available. Please try later"
        });
    }

    next();
}

const verifyTicketBody = {
    validateTicketBody : validateTicketBody
};

module.exports = verifyTicketBody