import express from 'express';
import router from './routes.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const app = express();
const port = 8080;

app.use(express.json());

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use('/all-products', router);
app.use('/api', router);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', async (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  try {
    const Product = mongoose.model('Product', {
      title: String,
      description: String,
      code: String,
      price: Number,
      status: true,
      stock: Number,
      category: String,
    });

    const products = await Product.find();
    socket.emit('data', JSON.stringify(products));
  } catch (error) {
    console.error(`Error al obtener los productos de la base de datos: ${error}`);
  }
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

server.listen(port, () => {
  console.log(`Servidor arriba en el puerto ${port}`);
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const environment = () => {
  mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@codercluster.hjyrt6q.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch(error => {
    console.error(`Error al conectarse a la base de datos: ${error}`);
  });
}


environment()
