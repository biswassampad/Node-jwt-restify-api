const errors = require('restify-errors');
const customers = require('../models/Customer');
module.exports=server=>{
    //get customer 
    server.get('/customers',async (req,res,next)=>{
        try{
            const customer = await customers.find({});
            res.send(customer);
            next();
        }catch(err){
            return next(new errors.InvalidContentError(err));
        }
    });
    //get single customer
    server.get('/customers/:id',async (req,res,next)=>{
        try{
            const customer = await customers.findById(req.params.id);
            res.send(customer);
            next();
        }catch(err){
            return next(new errors.ResourceNotFoundError(`There is no customer by this id you given ${req.params.id}`));
        }
    });
    //add customer
    server.post('/customers',async(req,res,next)=>{
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        const {name,email,balance}= req.body;
        const customer = new customers({
            name,email,balance
        });
        try{
            const newCustomer = await customer.save();
            res.send(201);
            next();
        }catch(err) {
            return next(new errors.InternalError(err.message))
        }
    });    
    //update customer
    server.put('/customers/:id',async(req,res,next)=>{
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        try{
            const customer = await customers.findOneAndUpdate({_id:req.params.id},req.body);
            res.send(200);
            next();
        }catch(err){
            return next(new errors.ResourceNotFoundError(`There is no customer by this id you given ${req.params.id}`));
        }
    });  
    //delete customers
    server.del('/customers/:id',async(req,res,next)=>{
        try{
            const customer = await customers.findByIdAndRemove({_id:req.params.id});
            res.send(204);
            next();
        }catch(err){
            return next(new errors.ResourceNotFoundError(`There is no customer by this id you given ${req.params.id}`));
        }
    });        
};