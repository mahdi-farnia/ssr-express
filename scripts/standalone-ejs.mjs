import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app
  .get('/', (req, res) => res.render('index'))
  .get('/user/:page', (req, res) => res.render(req.params.page));

const PORT = +(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log('Standalone server is running on ' + PORT);
});
