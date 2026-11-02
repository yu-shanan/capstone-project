const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Behind Render/Heroku proxies (needed for correct client IP / protocol)
app.set('trust proxy', 1);

// ---------- Security & parsing ----------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
      : '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Service index + health check (useful for the deployed API)
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'Capstone Portfolio & Blog API',
    version: '1.0.0',
    endpoints: {
      users: ['POST /api/users/register', 'POST /api/users/login', 'GET /api/users/me'],
      projects: [
        'GET /api/projects',
        'GET /api/projects/:id',
        'POST /api/projects',
        'PUT /api/projects/:id',
        'DELETE /api/projects/:id',
      ],
      blog: [
        'GET /api/blog',
        'GET /api/blog/:id',
        'POST /api/blog',
        'PUT /api/blog/:id',
        'DELETE /api/blog/:id',
        'GET /api/blog/:postId/comments',
        'POST /api/blog/:postId/comments',
      ],
      contact: ['POST /api/contact'],
      health: ['GET /api/health'],
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ---------- Central error handler (must be last) ----------
app.use(require('./middleware/error'));

module.exports = app;
