const express = require("express")
require("dotenv").config()
require("./cronJobs")
const app = express()
const http = require("http")
const server = http.createServer(app)
const taskRoutes = require("./routes/taskRoutes")
const authRoutes = require("./routes/authRoutes")
const gmailRoutes = require("./routes/gmailRoutes")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",taskRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/gmail",gmailRoutes)
app.use((req,res)=>{
    res.status(404).json({message:"Route not found"})
})
const port = process.env.PORT || 2000
server.listen(port,()=>{
    console.log(`server start on port ${port}`);
})