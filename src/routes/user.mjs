import { Router } from 'express';
import passport from 'passport';
import { userRegisterSchema, User } from '../modules/schema.mjs';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/login', automaticLogin, (_, res) => res.render('login'));
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/user/login',
    successRedirect: '/'
  })
);

router.get('/register', automaticLogin, (_, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const validation = userRegisterSchema.safeParse(req.body);
  if (!validation.success) {
    res.render('register', {
      messages: {
        error: validation.error.issues.map(({ message, path: [path] }) => ({
          message,
          path
        }))
      }
    });
    return;
  }

  /** @type {IUserFormData} */
  const formData = req.body;
  delete formData['agreement'];
  delete formData['passConfirm'];

  try {
    formData.password = await bcrypt.hash(formData.password, 10);
    await User.create(formData);
    res.redirect('/user/login');
  } catch (err) {
    console.error(`Error while adding new user to database: ${err.message}`);
    res.render('/user/register', {
      messages: { error: 'Internal error while adding new user to database' }
    });
  }
});

router.delete('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) console.error(err);
    res.redirect('/user/login');
  });
});

function automaticLogin(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/');

  next();
}

router.use((_, res) => res.render('404'));

export default router;
