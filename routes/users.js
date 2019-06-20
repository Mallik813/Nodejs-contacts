const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');
const DB = require('../config/keys');

const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
router.post('/task', (req, res) => {
  const {_id, name, phone, email}  = req.body;
  let errors = [];
  // console.log(req.body);
  // console.log(User);
  if (!name || !phone) {
    errors.push({ msg: ' Please enter all details ' });
  }    
  User.updateOne({ _id:_id }, {$push:{contacts:{name, phone, email}}}, { new: true }, (err, doc) => {
    if (!err) { 
      // console.log(req.body);
      res.redirect('/dashboard?Contact+added'); }
    else
      console.log('Error during record update : ' + err);    
});  
});


  



router.post ('/update', (req, res)=>{
    const {_id, name, email} = req.body;
    let errors=[];
    console.log(req.body);

    User.updateOne({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) { res.redirect('../dashboard?Successfully+Updated'); }
      else
        console.log('Error during record update : ' + err);
      
  });
});

router.get('/contact/:user_id/delete/:contact_id', (req, res)=>{
  
  let errors=[];
  console.log(req.params.user_id);
  console.log(req.params.contact_id);

  User.findOneAndUpdate(
    {_id: req.params.user_id}, 
    {$pull: {contacts: {_id: req.params.contact_id}}},
    function(err, data){
       if(err) return err;
       else
       res.redirect('../../../../vie?Contact+deleted');
      //  res.send({data:data});
});
}); 
router.post('/sendToDashboard/:user_id',(req, res)=>{
    
    const {contact_id, contact_name, contact_phone, contact_email}= req.body;
    console.log(contact_id, contact_name, contact_phone, contact_email);
    User.updateOne(
      { 
          _id: req.params.user_id,
          "contacts._id": contact_id
      },
      { $set: { 
          "contacts.$.name": contact_name,
          "contacts.$.phone": contact_phone,
          "contacts.$.email": contact_email
        } },(err, result)=>{
          if(!err) res.redirect('../../vie');
        }
  )
});




module.exports = router;

