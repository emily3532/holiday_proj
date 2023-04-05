const express = require('express');
const {google} = require('googleapis');
const createError = require('http-errors');
const morgan = require('morgan');
const dayjs = require('dayjs');
const { auth } = require('google-auth-library');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

const calendar = google.calendar({
  version:"v3",
  auth: process.env.API_KEY,
});


const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/calendar'
]

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.get('/google', (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.redirect(authorizeUrl);
  console.log(req);
})


app.get('/google/redirect', async (req, res)=>{
  console.log(req);
  const code = req.query.code;
  const {tokens} = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.info('Tokens acquired.');
  res.send("you have logged in");
})

app.get('/schedule_event', async (req,res) => {
 const result = await calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    requestBody:{
      summary:"This is a test event",
      description: "Some event",
      start: {
        dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
        timeZone: "Asia/Vladivostok",
      },
      end: {
        dateTime : dayjs(new Date()).add(1, 'day').add(1,"hour").toISOString(),
        timeZone: "Asia/Vladivostok",
      },
    }
  });
  res.send({
    msg:"Done",
  });
});
// app.use('/api', require('./routes/api.route'));



app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
