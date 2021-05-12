import {Application} from 'express';
import userRouter from "./user_router";
import productRouter from "./product_router";


const createRoutesV1 = (app: Application): void => {
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/products', productRouter);
}

export default createRoutesV1;