const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimiter');
const authLimiter = require('./middlewares/authLimiter');
const sanitizeInput = require('./middlewares/sanitizeInput');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.use(helmet());
app.use(cookieParser());
app.use(sanitizeInput);
app.use(limiter);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('DB sync error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));