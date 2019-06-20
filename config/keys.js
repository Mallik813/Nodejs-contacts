const mongoose = require('mongoose');


    mongoose.connect('mongodb+srv://Mallikarjun:12345@cluster0-qcohu.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }, 
    (err) => {
        if (!err) { console.log('MongoDB Connection Succeeded.') }
        else { console.log('Error in DB connection : ' + err) }
    });
   


