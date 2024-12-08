const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
dotenv.config()
const app = express()
const path = require('path')

app.use(express.json())
app.use(cors())


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('mongodb connected')
}).catch((err)=>{
    console.log(err)
})

app.use('/api', require('./routes/upload.js')); // Upload route

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





