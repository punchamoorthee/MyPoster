require('dotenv').config({ path: '.env.dev' });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const NotFoundError = require('./errors/notfound.error');

const posterRoutes = require('./routes/posters.routes');
const userRoutes = require('./routes/users.routes');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/posters', posterRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Url not found!'));
});

app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .send(err.message || 'Something went wrong!');
});

mongoose.set('strictQuery', true);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mdhqaux.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Connected to MongoDB database');
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log(`Server started on the port ${port}`);
  })
  .catch((err) => {
    console.log(`MongoServerError: ${err.message.split(':')[1]}`);
  });
