const User = require("../models/user.model")
const Ticket = require('../models/ticket.model')
const constants = require('../utils/constants')

const validateNewTicketBody = async (req,res,next)=>{
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

const isValidOwnerOfTheTicket = async (req,res,next) =>{
    const user = await User.findOne({userId: req.userId});
    const ticket = await Ticket.findOne({_id : req.params.id});

    if (user.userType == constants.userTypes.customer){
        const ownerId = ticket.reporter;
        if (user.userId != ownerId){
            return res.status(403).send({
                message : "only ADMIN | OWNER | ASSIGNED ENGINEER is allowed"
            });
        }
    }else if(user.userType == constants.userTypes.engineer){
        const ownerId = ticket.reporter;
        const engineerId = ticket.assignee;
        if(user.userId != ownerId && user.userId != engineerId){
            return res.status(403).send({
             message : "only ADMIN | OWNER | ASSIGNED ENGINEER is allowed"
            })
        }
    }

    if (req.body.assignee != undefined && user.userType != constants.userTypes.admin){
        return res.status(403).send({
            message : "only ADMIN is allowed to re-assign a ticket"
        });
    }

    if (req.body.assignee != undefined){
        const engineer = User.findOne({userId : req.body.assignee});
        if(engineer == null){
            return res.status(401).send({
                message : "Engineer userId passed as assignee is wrong"
            });
        }
    }
    next();
}


const verifyTicket = {
    validateNewTicketBody : validateNewTicketBody,
    isValidOwnerOfTheTicket : isValidOwnerOfTheTicket
};

module.exports = verifyTicket;