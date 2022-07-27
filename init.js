const User = require('./models/user.model')
const bcrypt = require('bcryptjs')

module.exports = async ()=>{
    try{
        await User.collection.drop();
        console.log("#### User collection dropped ####");
        /*
        const user = await ser.findOne({userId : "admin"})

        if(user){
            console.log("ADMIN user is already present");
            return;
        }
        */
         
        const user = await User.create({
            name : "Dharmit",
            userId : "admin",
            password : bcrypt.hashSync("Welcome1",8),
            email : "dharmit@admin.com",
            userType : "ADMIN"
        });
        console.log("#### Admin user created ####");
    }
    catch(err){
        console.log("#### Error in DB initialization #### " + err);
    }
}