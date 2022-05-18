const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    id:String,
    name:String,
    // employees:[],
    is_active:Boolean,    
})

module.exports = mongoose.model('Company',companySchema)