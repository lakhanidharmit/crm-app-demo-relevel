const ticketController = require('../controllers/ticket.controller');
const {authJwt, verifyTicket} = require('../middlewares')

module.exports = (app)=>{
    app.post("/crm/api/v1/tickets/", [authJwt.verifyToken, verifyTicket.validateNewTicketBody], ticketController.createTicket);
    app.get("/crm/api/v1/tickets/", [authJwt.verifyToken], ticketController.getAllTickets)
    app.put("/crm/api/v1/tickets/:id", [authJwt.verifyToken, verifyTicket.isValidOwnerOfTheTicket], ticketController.updateTicket)
}