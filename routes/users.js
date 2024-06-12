require('dotenv').config();
const express = require('express');
const authUser = require('../middleware/authUser');
const {Telegraf, session, Markup} = require('telegraf');
const {message} = require('telegraf/filters');
const { isUserExist: getUserIsExist, createUser, getUser } = require('../functions/users');
const {downloadfile} = require('../utils/index');
const path = require('path');

const router = express.Router();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.use(session());



bot.start((ctx) => 
{
    ctx.session = {};
    ctx.session.user = ctx.from;

ctx.reply('Welcome to the bot!')
}
);


bot.on('message', (ctx) => {
    ctx.reply('Hello World');
});




bot.launch();

router.use(authUser);

router.post('/info', async (req, res) => {

    const user = req.body.initData.user;

    const isUserExist = await getUserIsExist(user.id);


    

    if (!isUserExist) {

        const userPhotoInfo = await bot.telegram.getUserProfilePhotos(user.id)

        let file_id = '';
    
        if (userPhotoInfo.total_count > 0) {
    
             file_id = userPhotoInfo.photos[0][0].file_id;
    
             photo_url =  await bot.telegram.getFileLink(file_id);
    
             const photoPath = path.join(__dirname,'..', 'downloads', `${file_id}.jpg`);
    
             await downloadfile(photo_url.href, photoPath);
        }

     
        await createUser({
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'file_id': file_id || ''
        }).then(() => {
            console.log('User created successfully -',user.id);
            const result = {
                'success': true,
                'message': 'User info',
                'data': {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'earntotap': 2,
                    'totalcoin': 1000,
                    'profitperhour': 0,
                    'file_id': file_id || '',
                    'currentlevel': 1,
                    'levelupcoin': 1500,
                    'leveltext': 'Paradize',
                    'maxtap': 50 
                }
            }
        
            res.json(result);
        }).catch((err) => {
            console.log(err);
        });
    }
    else{

        await getUser(user.id).then((row) => {
            const result = {
                'success': true,
                'message': 'User info',
                'data': {
                    'first_name': row.first_name,
                    'last_name': row.last_name,
                    'file_id': row.file_id || '',
                    'earntotap': row.earntotap,
                    'totalcoin': row.totalcoin,
                    'profitperhour': row.profitperhour,
                    'currentlevel': row.currentlevel,
                    'levelupcoin': row.levelupcoin,
                    'leveltext': row.leveltext,
                    'maxtap': row.maxtap
                }
            }
        
            res.json(result);
        }).catch((err) => {
            console.log(err);
        });
    }
    



});



router.post('/invoice', async (req, res) => {

    bot.telegram.sendMessage(req.body.initData.user.id, 'Please click the link below to donate to the project');

   bot.telegram.createInvoiceLink({
    title: 'Donation',
    description: 'Donation to support the project',
    payload: 'invoice',
    currency:'XTR',
    prices: [{label: 'One-time donation', amount: 1}],
   }).then((response) => {
         res.json({
              'success': true,
              'message': 'Invoice created',
              'data': response
         });
    }).catch((err) => {
        console.log(err);
    });
    

});

module.exports = router;

