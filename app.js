const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const cors = require('cors')
require('dotenv').config()

const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express();

mongoose.connect(process.env.DB_URL);
mongoose.connection.once('open',()=>{
    console.log("Connected to DB")
})
app.use(cors());
app.use('/graphql',graphqlHTTP ({
    schema,
    graphiql:true
}));

app.listen(4000,()=>{
 console.log("Now listening for requests on port 4000")
});