import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected!'));

const app = express();
const PORT = 7853;

// CORS middleware
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  }));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json('Welcome');
  });
  
  app.listen(PORT, () => {
    console.log('listening on ' + PORT);
  });