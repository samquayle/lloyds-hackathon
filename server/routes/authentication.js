var passport      = require('passport');
var mongoose      = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);
var user          = require('../models/user.js');
var User          = mongoose.model('User');

module.exports = function(app) {

    app.use(session({
        store: new MongoStore({
            url: 'mongodb://localhost/cars'
         }),
        secret: 'codetutorialsecret',
        resave:true,
        saveUninitialized:true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) {
            console.log(err);
            return done(err);
           }
          if (!user) {
            console.log('Incorrect email');
            return done(null, false, { message: 'Incorrect email.' });
          }
          if (user.password != password) {
            console.log('Invalid password');
            return done(null, false, { message: 'Invalid password' });
          }
          return done(null, user);
        });
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
             done(err, user);
        });
    });

};
