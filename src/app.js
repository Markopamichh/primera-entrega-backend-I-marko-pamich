import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { initProductSocket } from './sockets/productSocket.js';

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Create HTTP server and Socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configure Handlebars
app.engine('handlebars', engine({
  helpers: {
    eq: (a, b) => a === b,
    multiply: (a, b) => (a * b).toFixed(2)
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store io instance for use in routes
app.set('io', io);

// Routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Initialize socket handlers
initProductSocket(io);

// Connect to MongoDB, then start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
