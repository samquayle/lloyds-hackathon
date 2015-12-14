var mongoose       = require('mongoose');
var authentication = require('./authentication');
var passport       = require('passport');
var car            = require('../models/car');
var User           = require('../models/user.js');

var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

module.exports = function(app) {
  'use strict';

  app.post('/login', passport.authenticate('local'), function(req, res){
    res.json(req.user);
  });

  app.get('/loggedin', function(req, res){
    res.send(req.isAuthenticated() ? req.user: '0')
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


  app.get('/api/cars', function(req, res) {
    car.find(function(err, cars) {
      if (err)
        res.send(err);
      else
        res.json(cars);
    });
  });

  app.get('/api/cars/:_id', function(req, res) {
    car.find({
      _id : req.params.car_id
    },function(err, car) {
      if (err)
        res.send(err);
      else
        res.json(car);
    });
  });

  app.post('/api/cars', function(req, res) {

    car.create({
      make : req.body.make,
      model : req.body.model,
      year : req.body.year
    }, function(err, car) {
      if (err)
        res.send(err);
      car.find(function(err, cars) {
        if (err)
          res.send(err);
        else
          res.json(cars);
      });
    });

  });

  app.put('/api/cars/:car_id', function(req, res) {

    var query = {"_id": req.body._id };
    var options = {new: true};
    var data = {
      make : req.body.make,
      model : req.body.model,
      year : req.body.year
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

  app.delete('/api/cars/:car_id', function(req, res) {
    car.remove({
      _id : req.params.car_id
    }, function(err, car) {
      if (err)
        res.send(err);
      car.find(function(err, cars) {
        if (err)
          res.send(err)
        else
          res.json(cars);
      });
    });
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
