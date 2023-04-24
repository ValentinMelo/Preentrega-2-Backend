import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@codercluster.hjyrt6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
    console.log("Conectado a la base de datos de MongoDB");
  } catch (error) {
    console.error(`Error al conectarse a la base de datos de MongoDB: ${error}`);
  }
};

export default connectToDatabase;
