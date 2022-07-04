import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './schema.mjs';
import bcrypt from 'bcrypt';

/** @type {import("passport-local").VerifyFunction} */
const verify = async (username, password, done) => {
  let usr;

  try {
    usr = await User.findByUsername(username);
    if (usr == null) {
      return done(null, false, { message: 'No user found with given username!' });
    }
  } catch (err) {
    done(err, false);
  }

  try {
    if (!(await bcrypt.compare(password, usr.password)))
      return done(null, false, { message: 'Incorrect password' });
    done(null, usr);
  } catch (err) {
    done(err, false);
  }
};

// NOTE username & password form name is set to default
const strategy = new LocalStrategy(verify);

passport.use(strategy);
passport.serializeUser((usr, done) => done(null, usr.id));
passport.deserializeUser(async (id, done) => {
  try {
    const usr = await User.findById(id).exec();
    done(null, usr);
  } catch (err) {
    done(err, false);
  }
});
