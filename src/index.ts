import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import connection from './db/conecction';
import routesV1 from './routes/v1';
import cors from 'cors';

import path from 'path';

dotenv.config();

const app: Application = express();
app.use(cors({
    origin: ['']
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => res.sendFile(path.join(__dirname, '/views/index.html')));
routesV1(app);

app.use((req: Request, res: Response) => {
    res.status(404).send('NOT FOUND');
});
const PORT: string = process.env.PORT!;
connection().then((conected: boolean) => {
    if (conected) {
        app.listen(PORT, () => {
            console.log('running on ' + PORT);
        });
    } else {
        console.log('error mongo db');
    }
});
