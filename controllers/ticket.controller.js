const Ticket = require('../models/ticket.model')
const User = require('../models/user.model')
const constants = require("../utils/constants")

exports.createTicket = async (req,res)=>{
    try{
        const ticketObj = {
            title : req.body.title,
            ticketPriority : req.body.ticketPriority,
            description : req.body.description,
            status : req.body.status,
            reporter : req.userId
        }
    
        // find engineer with least open tickets
        const engineer = await User.findOne({
            userType : constants.userTypes.engineer,
            userStatus : constants.userStatus.approved
        });
    
        if(engineer){
            ticketObj.assignee = engineer.userId
        }

        const ticketCreated = await Ticket.create(ticketObj);
        console.log(`#### New ticket '${ticketCreated.title}' created by ${customer.name} ####`);

        if(ticketCreated){
            const customer = await User.findOne({
                userId : req.userId
            });

            customer.ticketsCreated.push(ticketCreated._id);
            await customer.save();

            if(engineer){
                engineer.ticketsAssigned.push(ticketCreated._id);
                await engineer.save()
            }
            res.status(201).send(ticketCreated)
        }


    }catch(err){
        console.log("#### Error while DB operation ####", err.message);
        res.status(500).send({
            message : "Internal server error"
        })
    }
}


exports.getAllTickets = async (req,res)=>{
    const user = await User.findOne({userId : req.userId});
    const queryObj = {}

    if(user.userType == constants.userTypes.customer){
        const ticketsCreated = await user.ticketsCreated;
        if(!ticketsCreated){
            return res.status(200).send({
                message : "No tickets created by the user yet"
            });
        }
        queryObj["_id"] = {$in : ticketsCreated};
    }else if(user.userType == constants.userTypes.engineer){
        const ticketsAssigned = await user.ticketsAssigned;
        if(!ticketsAssigned){
            return res.status(200).send({
                message : "No tickets assigned to the engineer yet"
            });
        }
        queryObj["_id"] = {$in : ticketsAssigned};
    }

    const tickets = await Ticket.find(queryObj);
}