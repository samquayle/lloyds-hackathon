var express        = require('express');
var mongoose       = require('mongoose');
var session        = require('express-session');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var MongoStore     = require('connect-mongo')(session);
var http           = require('http');
var path           = require('path');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var car            = require('./models/car');
var User           = require('./models/user');

//==================================================================
// DB
mongoose.connect('mongodb://localhost/lloyds');

//==================================================================
// Define the strategy to be used by PassportJS
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


// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};
//==================================================================

// Start express application
var app = express();

// all environments
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(methodOverride());
app.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost/lloyds'
     }),
    secret: 'mysecret',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(express.static(__dirname + '/../public'));
app.use('/bower_components',  express.static(__dirname + '/../bower_components'));



//==================================================================
// routes


app.get('/api/cars', auth, function(req, res) {
  User.findOne({
    _id: req.user._id
  }, function(err, user) {
    if (err)
      res.send(err);
    else
      res.json(user.cars);
  });
});

app.get('/api/cars/:id', auth, function(req, res) {
  User.findOne({
    _id : req.user._id
  }, function(err, user) {

    var car;
    var cars = user.cars;

    console.log('list: '+user.cars);
    console.log('req.pararms.id: '+req.params.id);

    for (i=0; i<cars.length; i++) {
      console.log('car'+[i]+': '+cars[i]+', id: '+cars[i]._id);
      if (cars[i]._id == req.params.id) {
        // car = cars[i];
      }
    }

    if (err) {
      res.send(err);
    }
    else {
      res.json(car);
      // console.log(car);
    }


  });
});

app.post('/api/cars', auth, function(req, res) {

  var car = {
    _id: mongoose.Types.ObjectId(),
    make: req.body.make,
    model: req.body.model,
    year: req.body.year
  }

  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    $push: {
      cars: car
    }
  }, {
    safe: true,
    upsert: true
  }, function(err, cars) {
    if (err)
      res.send(err);
    else
      res.json(cars);
  });


});

app.put('/api/cars/:car_id', auth, function(req, res) {

  var query = {"_id": req.body._id };
  var options = {new: true};
  var data = {
    make: req.body.make,
    model : req.body.model,
    year : req.body.year,
  }

  car.findOneAndUpdate(query, data, options, function(err, car) {
    if (err) {
      res.send(err);
    }
    car.find(function(err, cars) {
      if (err)
        res.send(err);
      else
        res.json(cars);
    });
  });

});

app.delete('/api/cars/:_id', auth, function(req, res) {

  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    $pull: {
      _id: { slug: req.params._id }
    }
  }, {
    safe: true,
    upsert: true
  }, function(err, cars) {
    if (err)
      res.send(err);
    else
      res.json(cars);
  });

});


//==================================================================

//==================================================================
// route to test if the user is logged in or not
app.post('/login', passport.authenticate('local'), function(req, res){
  res.json(req.user);
});

app.get('/loggedin', function(req, res){
  res.send(req.isAuthenticated() ? req.user : '0')
});

app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});

app.post('/register',function(req,res){
  var u =  new User();
  u.username = req.body.username;
  u.password = req.body.password;

  u.save(function(err){
    if (err)
      res.json({'alert':'Registration error'});
    else
      res.json({'alert':'Registration success'});
  });
});
//==================================================================
//

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(3000);