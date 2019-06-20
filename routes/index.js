const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const passport = require('passport');
// Load User model
const User = require('../models/user');
const DB = require('../config/keys');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/home', (req, res)=>{ 
  if(req.user){
    res.render('home', {
      user : req.user,
      Login:true
    })
  }
  else{
    res.render('home', {
      Login: false
    })
  }
});
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user,
    ID: req.user._id
  })
);
router.get('/vie', ensureAuthenticated, (req, res)=>{
  User.find({}, (err, docs)=>{
    if(err) res.json(err);
    // else res.send(docs);
    else res.render('vie', {user: req.user});
  });
});



module.exports = router;
