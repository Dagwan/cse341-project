const Users = require('../models/userModel');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in your database
        const existingUser = await Users.findOne({ googleId: profile.id });

        if (existingUser) {
          // User already exists, you can update the user data if needed
          // For example, update user information:
          existingUser.name = profile.displayName;
          existingUser.email = profile.emails[0].value;

          // Save the updated user data
          await existingUser.save();
          return done(null, existingUser);
        }

        // User does not exist, create a new user document
        const newUser = new Users({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          
        });

        // Save the new user to the database
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.error(error);
        done(error, null);
      }
    }
  )
);

// Serialize user data into a session or token
passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in the session
});

// Deserialize user data from a session or token
passport.deserializeUser(async (id, done) => {
  try {
    // Find the user in the database by ID
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error, null);
  }
});

// Export the configured passport instance
module.exports = passport;


// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// // Configure Google OAuth strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/auth/google/callback',
//       scope: ['profile']
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
      
//       // This function handles user creation and login logic based on the Google profile information
//       // Check if the user exist1s, create a user, or log in the user
//       // Call 'done' to complete the authentication process
//       done(null, profile);
//     }
//   )
// );

// // Serialize user data into a session or token
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// // Deserialize user data from a session or token
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // auth/google-auth.js
// module.exports = passport;
