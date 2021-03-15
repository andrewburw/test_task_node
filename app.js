
/* *************************************************************
|
|
|                    Main application file
|      
|
|       For more info - my page: https://andrewburw.github.io/personalpage/
|
|
| **************************************************************/

const express = require('express');
const app = express();
const config = require('./config');
const compression = require('compression')


app.set('trust proxy', 1); // for heroku deploy
app.use('/api', require('./route'));
app.use(compression());



//**********************  Server Start ************************************

function startServ() {
    try {

        app.listen(process.env.PORT || config.PORT);
        console.log("--------------NODE SERV OK---------------------");
    } catch (e) {
        console.log(e.message);

    }

}

startServ();