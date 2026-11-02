/**
 * Single place to personalise the portfolio.
 * Edit these values and the Home page, header and footer update everywhere.
 */
export const PROFILE = {
  name: import.meta.env.VITE_OWNER_NAME || 'Yu Shanna',
  role: 'Full-Stack Developer',
  tagline:
    'I design and build web applications end to end - React on the front, Node.js, Express and MongoDB on the back.',
  photo: '/my-photo.jpg',
  location: 'Shanghai, China',
  email: '3783515499@qq.com',
  github: 'https://github.com/YuShanna',
  availability: 'Open to internships',
  skills: [
    'React',
    'JavaScript (ES2023)',
    'Node.js',
    'Express',
    'MongoDB / Mongoose',
    'REST API',
    'JWT & bcrypt',
    'HTML / CSS',
  ],
  highlights: [
    'Capstone: full-stack MERN portfolio + blog',
    'REST API with JWT auth & bcrypt hashing',
    'Responsive UI, light & dark themes',
  ],
  bio: [
    'I am a computer science student who enjoys turning ideas into working products. This site is my capstone project: a portfolio, a blog and an admin dashboard, all powered by the REST API I built with Node.js, Express and MongoDB Atlas.',
    'I like clean component boundaries, predictable state, and interfaces that stay usable on a phone. When I am not coding I am usually reading about databases or playing badminton.',
  ],
};

