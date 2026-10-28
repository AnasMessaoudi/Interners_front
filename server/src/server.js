require('dotenv').config()
const app =require('./app')
const port = process.env.PORT

const connectDB = require('./config/db')
connectDB().then(() => {
    app.listen(port,()=>{console.log('listening on port ',port)})
}).catch((err) => {
    console.log(err.message);    
});


