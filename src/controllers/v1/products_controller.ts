import {Request, Response,} from 'express';
import Products from "../../db/schemas/product";
import {Types} from "mongoose";
import user from "../../db/schemas/user";


export const getProducts = async (req: Request, res: Response): Promise<void> => {
    const {userId} = req.session;
    const page = parseInt(req.query.page as string);
    const itemsPerPage: number = 6;
    const start = (page - 1) * itemsPerPage;
    const total = await Products.countDocuments({user: Types.ObjectId(userId)});

    const products = await Products.find({
        user: Types.ObjectId(userId)
    }).skip(start).limit(itemsPerPage).populate({
        path: 'user',
        select: {password: 0, __v: 0}
    });

    res.send({
        page: page,
        per_page: itemsPerPage,
        total: total,
        total_pages: Math.ceil(total / itemsPerPage),
        data: products
    });
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.session;
        const {productId} = req.params;
        if (!Types.ObjectId(productId)) {
            throw {code: 400, message: 'Invalida id ' + productId};
        }
        const product = await Products.findOne({
            _id: Types.ObjectId(productId),
            user: Types.ObjectId(userId)
        }).populate({
            path: 'user',
            select: {password: 0, __v: 0}
        });
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({});
        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.session;
        console.log(userId);
        const {
            name,
            year,
            description,
            price
        } = req.body;
        if (!Types.ObjectId(userId)) {
            throw {code: 400, message: 'Invalida id ' + userId};
        }
        const product = await Products.create({
            name,
            year,
            description,
            price,
            user: Types.ObjectId(userId)
        });
        res.send(product);
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}


export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.session;
        const {productId} = req.params;
        if (!Types.ObjectId(productId)) {
            throw {code: 400, message: 'Invalida id ' + productId};
        }
        const {
            name,
            year,
            description,
            price,
        } = req.body;
        const product = await Products.findByIdAndUpdate({
            _id: Types.ObjectId(productId),
            user: Types.ObjectId(userId)
        }, {
            name,
            year,
            description,
            price
        });
        if (product) {
            res.send({data: 'Ok'});
        } else {
            res.status(404).send({});
        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}
export const partialUpdateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.session;
        const {productId} = req.params;
        if (!Types.ObjectId(productId)) {
            throw {code: 400, message: 'Invalida id ' + productId};
        }
        const {
            name,
            year,
            description,
            price
        } = req.body;
        const product = await Products.findOne({_id: Types.ObjectId(productId), user: Types.ObjectId(userId)});
        if (product) {
            product.name = name || product.name;
            product.year = year || product.year;
            product.price = price || product.price;
            product.description = description || product.description;
            await product.save();
            res.send({data: product});
        } else {
            res.status(404).send({});
        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}
export const deleteProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.session;
        const {productId} = req.params;
        if (!Types.ObjectId(productId)) {
            throw {code: 400, message: 'Invalida id ' + productId};
        }
        const deleted = await Products.deleteOne({_id: Types.ObjectId(productId), user: Types.ObjectId(userId)});

        if (deleted.deletedCount! > 0) {
            res.send({})
        } else {
            res.status(404).send({});
        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}
export const updateProductAndNotify = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.session;
        const {productId} = req.params;
        if (!Types.ObjectId(productId)) {
            throw {code: 400, message: 'Invalida id ' + productId};
        }
        const {email, data} = req.body;
        const {
            name,
            year,
            description,
            price
        } = data;

        const product = await Products.findOne({_id: Types.ObjectId(productId), user: Types.ObjectId(userId)});
        if (product) {
            product.name = name || product.name;
            product.year = year || product.year;
            product.price = price || product.price;
            product.description = description || product.description;

            await product.save();
            res.send({data: product});
        } else {
            res.status(404).send({});
        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}
