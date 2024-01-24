const express =require("express");
const app =express()
app.use(express.json());
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(session({ secret: 'jkl3$4Ab&!9opqrXYZ', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
const connectDB =require('./config/db')

connectDB()

app.get('/', (req,res) =>{
    res.send("pronob")
})

app.use('/api/user', require('./routes/userRoutes'))



app.listen(5000,() =>{
    console.log("Server is running")
})