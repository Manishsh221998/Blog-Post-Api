const express=require('express')
const dotenv=require('dotenv')
const connectDB = require('./app/config/db')
const router = require('./app/router/authRoutes')
const categoryRoutes = require('./app/router/categoryRoutes');
const blogRoutes = require('./app/router/blogRoutes');
const app=express()

dotenv.config()
connectDB()

app.use(express.json({limit:'50mb',extended:true}))

app.use("/uploads",express.static('uploads'))

app.use('/api/auth',router)
app.use('/api', categoryRoutes);
app.use('/api', blogRoutes);

app.listen(process.env.PORT,()=>{console.log("Server is running on port :",process.env.PORT)})