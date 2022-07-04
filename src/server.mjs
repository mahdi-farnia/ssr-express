import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongodb-session';
import * as AppInfo from '../package.json' assert { type: 'json' };
import './modules/strategy.mjs';
import methodOverride from 'method-override';
import userRouter from './routes/user.mjs';
import compression from 'compression';

class Application {
  app = express();
  PORT = process.env.PORT;

  async init() {
    this.setupMiddleware();
    await this.databaseConnect();
    this.setupServer();
  }

  setupMiddleware() {
    const { app } = this;

    app.set('view engine', 'ejs');
    app.set('trust proxy', true);
    app.use(compression());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: false }));
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // 😭😭😭😭😭😭 this killed 1 hour at least
          maxAge: parseInt(process.env.COOKIE_MAX_AGE)
        },
        store: new (MongoStore(session))({
          uri: process.env.DATABASE_URL,
          collection: 'sessions',
          connectionOptions: {
            appName: AppInfo.name
          }
        })
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('real-method'));
  }

  databaseConnect() {
    const timer = setTimeout(() => {
      console.warn(
        '⚠️ if app still not working or database not connected yet, make sure you started the mongodb using homebrew: `brew services start mongodb/brew/mongodb-community`'
      );
    }, 5_000);

    return new Promise((res, rej) => {
      mongoose.connect(process.env.DATABASE_URL, { appName: AppInfo.name }, (err) => {
        clearTimeout(timer);
        if (err) return rej(err);
        res();
      });
    });
  }

  setupServer() {
    this.setupRoutes();
    this.app.listen(this.PORT, () => {
      console.log(`App is ready on http://localhost:${this.PORT}`);
    });
  }

  setupRoutes() {
    const { app } = this;
    app.get('/', Application.validateBeforeContinue, (req, res) =>
      res.render('index', { userInfo: req.user })
    );
    app.use('/user', userRouter);
    app.use((_, res) => res.render('404'));
  }

  static validateBeforeContinue(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/user/login');

    next();
  }
}

new Application().init().catch((err) => console.error(err.message));
