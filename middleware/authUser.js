require('dotenv').config();
const crypto = require('crypto');

function authUser(req,res,next){

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    

    if (!TELEGRAM_BOT_TOKEN) {
        return res.status(400).json({'success': false, 'message': 'TELEGRAM_BOT_TOKEN is required'});
    }

    const secret = crypto.createHmac('sha256','WebAppData').update(TELEGRAM_BOT_TOKEN)



    const jsonBody = req.body.initData;

    if (!jsonBody){
        return res.status(400).json({'success': false, 'message': 'initData is required'});
    }
    
    const hash = jsonBody.hash;

    var arr = [];

    Object.keys(jsonBody).forEach(key => {
        if (key !== 'hash') {
            if (key === 'user') {
                arr.push(`${key}=${JSON.stringify(jsonBody[key])}`);
            } else
            arr.push(`${key}=${jsonBody[key]}`);

        }
    })


    arr.sort((a,b) => a.localeCompare(b));

    const dataChecking = arr.join('\n');

    const _hash = crypto.createHmac('sha256',secret.digest()).update(dataChecking).digest('hex');

    if (hash !== _hash){
        return res.status(400).json({'success': false, 'message': 'unAuthorized'});
    }
    next();
}

module.exports = authUser