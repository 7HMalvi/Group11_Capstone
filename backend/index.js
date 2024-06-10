const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');


const mongoDB = "mongodb+srv://parthjpatel:parth2106@cluster0.9sisgbx.mongodb.net/grooveix"

try {
    mongoose.connect(mongoDB)
    console.log("Mongo DB Connected...!!!")
} catch (e) {
    console.log("Error In Connection: ", e)
}


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors());


app.get("/", (req, res)=>{
    res.send('Grooveix Server')
})
app.use(adminRouter);
app.use(userRouter);


app.listen(5000, () => {
    console.log("Application is running on http://localhost:5000");
})
