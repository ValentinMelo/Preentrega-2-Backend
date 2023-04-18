import express from 'express';
import router from './routes.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const app = express();
const port = 8080;

app.use(express.json());

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use('/all-products', router);
app.use('/api', router);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  fs.readFile('./data/MOCK_DATA.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(`Error al leer archivo: ${err}`);
      return;
    }
    socket.emit('data', data);
  });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

server.listen(port, () => {
  console.log(`Servidor arriba en el puerto ${port}`);
});

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const environment = async () => {
  await mongoose.connect(
    `mongodb+srv://valemelo18:<password>@codercluster.hjyrt6q.mongodb.net/?retryWrites=true&w=majority`
  )}

environment()
