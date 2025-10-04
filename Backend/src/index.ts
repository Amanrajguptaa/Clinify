import express from "express"
import "dotenv/config"

const app = express();

const port = process.env.PORT || 4000

app.listen(port,()=>{
    console.log(`APP RUNNING ON PORT: ${port}`)
})

app.get('/', (req,res)=>{
    res.send("SERVER WORKING ✅")
})

app.get('/health', (req,res)=>{
    res.send("SERVER HEALTH IS GOOD ✅")
})