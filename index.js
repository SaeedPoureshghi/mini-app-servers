require('dotenv').config();
// initialize the db 
require('./init.js');
const path = require('path');

const express = require('express');

const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

app.use(express.json());


const usersRoutes = require('./routes/users');

app.use('/user',usersRoutes);

app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


