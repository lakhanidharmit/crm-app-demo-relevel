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
        // const engineer = await User.findOne({
        //     userType : constants.userTypes.engineer,
        //     userStatus : constants.userStatus.approved
        // });

        const engineerarray = await User.find({
            userType : constants.userTypes.engineer,
            userStatus : constants.userStatus.approved
        })

        const engineer = engineerarray.sort((a,b)=>a.ticketsAssigned.length - b.ticketsAssigned.length)[0]

    
        if(engineer){
            ticketObj.assignee = engineer.userId
        }

        const ticketCreated = await Ticket.create(ticketObj);
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
            console.log(`#### New ticket '${ticketCreated.title}' created by ${customer.name} ####`);
            res.status(201).send(ticketCreated)
        }


    }catch(err){
        console.log("#### Error while creating new ticket ####", err);
        res.status(500).send({
            message : "Internal server error"
        })
    }
}


exports.getAllTickets = async (req,res)=>{
    try{
        const user = await User.findOne({userId : req.userId});
        const ticketsCreated = user.ticketsCreated;
        const ticketsAssigned = user.ticketsAssigned;
        const queryObj = {}
    
        if(user.userType == constants.userTypes.customer){
    
            if(!ticketsCreated){
                return res.status(200).send({
                    message : "No tickets created by the user yet"
                });
            }
            queryObj["_id"] = {$in : ticketsCreated};
    
        }else if(user.userType == constants.userTypes.engineer){
    
            queryObj["$or"] = [{"_id" : {$in : ticketsCreated}},{"_id" : {$in : ticketsAssigned}}]
    
        }
    
        const tickets = await Ticket.find(queryObj);
    
        res.status(200).send(tickets);
    
    }catch(err){
        console.log("#### Error while getting tickets ####", err.message);
        res.status(500).send({
            message : "Internal server error while getting tickets"
        })
    }
}

exports.updateTicket = async (req,res)=>{
    try{
        const ticket = await Ticket.findOne({"_id" : req.params.id});
    
        ticket.title = req.body.title != undefined? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority != undefined? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.stats != undefined? req.body.stats : ticket.status;
        ticket.assignee = req.body.assignee != undefined? req.body.assignee : ticket.assignee;
    
        const updatedTicket = await ticket.save()
        res.status(200).send(updatedTicket)
    }catch(err){
        console.log("#### Error while updating ticket ####", err);
        res.status(500).send({
            message : "Some internal error while updating the ticket"
        })
    }
}