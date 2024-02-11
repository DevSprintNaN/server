const {app}=require('./app');
const connection = require('./config/database')
require('dotenv').config();
connection();
const port=process.env._PORT || process.env.PORT || 8080;

const server=app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

module.exports={server};