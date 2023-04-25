// index.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const authController = require('./controllers/authController');

async function testSupabaseConnection() {
    const { data, error } = await supabase.from('users_gpt').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('Supabase connection successful:', data);
    }
  }
  

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const { user, error } = await User.findByEmail(email);

    if (error) {
      return done(error);
    }

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { user, error } = await User.findById(id);
  done(error, user);
});

app.post('/register', authController.register);
app.post('/login', passport.authenticate('local'), authController.login);
app.post('/logout', authController.logout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testSupabaseConnection();
});
