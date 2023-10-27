const GoogleStrategy = require('passport-google-oauth20').Strategy
const Users = require('../models/userModel');


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }

        try {
          let user = await Users.findOne({ googleId: profile.id })

          if (user) {
            done(null, user);
          } else {
            user = await Users.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => done(err, user));
  });
}





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
