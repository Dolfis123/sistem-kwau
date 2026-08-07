const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const { fail } = require('./utils/apiResponse');

const app = express();

app.set('trust proxy', 1); // di belakang Nginx, agar rate limit membaca IP asli

app.use(cors({ origin: env.FRONTEND_URL === '*' ? true : env.FRONTEND_URL.split(',') }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('tiny'));

// File upload (foto) disajikan statis
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'), {
  maxAge: '7d', // cache browser, hemat bandwidth turis
}));

// Semua endpoint API
app.use('/api', apiLimiter, routes);

// Health check (untuk monitoring PM2/uptime)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => fail(res, 'Endpoint tidak ditemukan.', 404));

// Error terpusat
app.use(errorHandler);

module.exports = app;
