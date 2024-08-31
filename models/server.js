import express from 'express';
import CellsRouter from '../routes/CellsRouter.js';
import dbConnect from '../database/config.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.dbConnection();
        this.routes();
        this.listen();
    }

    middlewares() {
        this.app.use(express.json());
    }

    async dbConnection() {
        try {
            await dbConnect();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Error connecting to the database:', error);
            process.exit(1);
        }
    }

    routes() {
        this.app.use('/api', CellsRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running `);
        });
    }
}

export default Server;
