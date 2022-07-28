const ticketController = require('../controllers/ticket.controller');
const {authJwt, verifyTicketBody} = require('../middlewares')

module.exports = (app)=>{
    // add middleware for validation of req body (title,description,engineer available)
    app.post("/crm/api/v1/tickets/", [authJwt.verifyToken, verifyTicketBody.validateTicketBody], ticketController.createTicket);
}