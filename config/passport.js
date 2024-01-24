// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel'); // Adjust the path based on your project structure
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    
    try {
      const user = await User.findOne({ email });
     

      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      

      const isValidPassword = await user.matchPassword(password);
      console.log(isValidPassword)

      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
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

module.exports = passport;