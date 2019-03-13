const mongoose = require('mongoose');
const timestamps =require('mongoose-timestamp');

const CustomerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    balance:{
        type:Number,
        default:0
    }
});

CustomerSchema.plugin(timestamps);
const Customer = mongoose.model('Customers',CustomerSchema);
module.exports = Customer;