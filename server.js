const express=require("express");
const app=express();
app.use(express.json());

app.use(express.static("./"));

app.get("/",(req,res)=>{
    res.sendFile("index.html");
});

// app.get('/test1', (req, res, next) => {
//     console.log(req.body)
//     // res.send("server running on port 5000")
//     res.json({
//         message :" server is running on port 7000"
//     })

// })

const Port=process.env.PORT||7000;

app.get("/test",(req,res)=>{
    res.send("server is running on port 7000");
});

const mnRouter=require('./backend')
app.use("/backend",mnRouter)

app.use("*",(req,res)=>{// error handling code where * work as universal route for error handling
    res.status(404).send("Page not Found");//status set the 404 
    //res.sendStatus(404)-->message "not found"
});

app.listen(Port,()=>{
    console.log("7000 port is responding");
});