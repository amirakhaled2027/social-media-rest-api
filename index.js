const express = require("express")
const app = express()
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


//Middleware
app.use(express.json());
app.use(helmet())
app.use(morgan('common'))


app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)



app.listen(2000, ()=>{
    console.log("Backend server is running on port 2000!")
})