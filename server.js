const {app}=require('./app');
require('dotenv').config();

const port=process.env._PORT;

const server=app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

module.exports={server};