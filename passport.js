const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

const jwt = require('jsonwebtoken')


passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  userExist(user).then(user => {
    done(null, user)
  })
})

/* eslint-disable new-cap */
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '123',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '123',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '123'
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        const attributes = {
          access_token: accessToken,
          refresh_token: refreshToken
        }
        const data = {
          provider: 'google',
          social_id: profile.id,
          profile: profile,
          attribute: attributes,
          email: profile.emails[0].value
        }

        models.User.findOne({where: data})
          .then(user => {
            if (user) {
              models.User.update(data)
                .then(user => {
                  return done(null, user)
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('Error in passport.js configuration file')
                  // eslint-disable-next-line no-console
                  console.log(error)

                  return done(null)
                })
            }
            else {
              models.User.build(data).save()
                .then(user => {
                  return done(null, user)
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('Error in passport.js configuration file')
                  // eslint-disable-next-line no-console
                  console.log(error)

                  return done(null)
                })
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(
              'Error in passport.js configuration file - search users'
            )
            // eslint-disable-next-line no-console
            console.log(error)

            return done(null)
          })
      })
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      process.nextTick(_ => {
        const userAttributes = {
          email: email
        }
        models.User.findOne({where: userAttributes})
          .then(user => {
            if (!user) return done(null, false)
            if (user.verifyPassword(password, user.password)) {
              const token = jwt.sign(
                { email: user.email },
                process.env.SECRET_PHRASE
              )
              user.token = token
              return done(null, user)
            }
            return done(null, false)
          })
          .catch(error => {
            return done(error)
          })
      })
    }
  )
)

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_PHRASE || '123'
},
(jwtPayload, done) => {
  process.nextTick(_ => {
    const userAttributes = {
      email: jwtPayload.email
    }
    models.User.findOne({where: userAttributes})
      .then(user => {
        if (!user) return done(null, false)
        return done(null, user)
      })
      .catch(error => {
        return done(error)
      })
  })
}
))