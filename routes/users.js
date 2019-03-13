const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');
module.exports = server =>{
    //Register User
    server.post('/register',async(req,res,next)=>{
        const {email,password} = req.body;

        const user = new User({
            email,password
        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,async (err,hash)=>{
                //hash the password
                user.password = hash;
                //save user
                try{
                    const newUser = await user.save();
                    res.send(201);
                    next();
                }catch(err){
                    return next (new errors.InternalError(err.message));
                }
            });
        });
    });
    //Auth user
    server.post('/auth',async(req,res,next)=>{
        const{email,password}= req.body;
        try{
            //Authenticate the user
            const user = await auth.authenticate(email,password);
            //create the token
            const token = jwt.sign(user.toJSON(),config.JWT_SECRET,{});
            const {iat,exp} = jwt.decode(token);
            //respond with token
            res.send({iat,exp,token});
            console.log('You are Logged In!!');

            next();
        }catch(err){
            //user nor authorised
            return next(new errors.UnauthorizedError(err));
        }
    });
}