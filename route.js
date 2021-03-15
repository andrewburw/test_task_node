/* *************************************************************
|
|
|                    Route file
|      
|
|       For more info - my page: https://andrewburw.github.io/personalpage/
|
|
| **************************************************************/

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const dataChange = require('./custom_module/dataChange'); // custom module for changing data
const config = require('./config');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayMs: 0,
    max: config.rateLimit // limit each IP to  requests per windowMs
   
  });

/*
|-----------------------------------------------
|                MAIN ROUTE
|-----------------------------------------------
*/
const middle = (req, res, next) => {
    // middleware for checking ips
    let ip = req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    if (config.blockedip.includes(ip.split(":")[3])) {
        req.ipcheck = false;
        next();
    } else {
        next();
    }

}


router.get('/getPriceHistory/:start?/:end?', middle,limiter, async (req, res, next) => {

    try {


      if ( req.ipcheck === false) {
        // moddleware responded if ip not allowed.
        return res.status(500).json({ message: 'Not allowed IP.', errorStatus: true });
      }


        fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${req.params.start}&end=${req.params.end}`)

            .then(response => {
                const contentType = response.headers.get("content-type");


                if (contentType && contentType.indexOf("application/javascript") !== -1) {
                    return response.json().then(data => {


                        res.status(200).json(dataChange(data)); // dataChange is separate module

                    });
                } else {
                    // if fetched wrong data coindesk returned a text msg
                    // msg responded here.


                    return response.text().then(text => {
                        res.status(500).json({ message: text, errorStatus: true });
                    });
                }
            });

    } catch (e) {

        res.status(500).json({ message: 'Somthing wrong!', errorStatus: true });

    }
})


module.exports = router;