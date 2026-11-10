import "server-only"; // Impede que seja executado no cliente, impedindo que a URI e o driver cheguem ao navegador
import { MongoClient, type Db } from "mongodb";

// Guarda a conexão em globalThis para sobreviver ao hot reload do Next em dev
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClient(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Variável MONGODB_URI não definida. Crie o .env.local (veja o .env.example).");
    }

    globalForMongo._mongoClientPromise = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000, // diminui o timeout de 30s para 5s se o banco estiver fora do ar
    })
      .connect()
      .catch((erro) => {
        // se a 1ª conexão falha, é possível tentar de novo
        globalForMongo._mongoClientPromise = undefined;
        throw erro;
      });
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db("cadastro-fractal");
}