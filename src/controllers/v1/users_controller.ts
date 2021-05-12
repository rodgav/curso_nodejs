import {Request, Response} from 'express';
import {Types} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {mongo} from "mongoose";

import Users from "../../db/schemas/user";
import Products from "../../db/schemas/product";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await Users.find().select({password: 0, __v: 0});
    res.send(users);
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.params;
        if (!Types.ObjectId(userId)) {
            throw {code: 400, message: 'Invalida id ' + userId};
        }
        const user = await Users.findById(Types.ObjectId(userId)).select({password: 0, __v: 0});
        res.send(user);
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, fisrt_name, last_name, avatar, password} = req.body;
        const hash = await bcrypt.hash(password, 15);
        const newUser = await Users.create({
            email, fisrt_name, last_name, avatar, password: hash
        });
        res.send(newUser);
    } catch (e) {
        if (e instanceof mongo.MongoError) {
            res.status(400).send({code: e.code, message: e.code === 11000 ? 'Duplicate value' : 'Error'});
            return;
        }
        res.status(500).send(e.message);
    }
}

export const deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {userId} = req.params;
        if (!Types.ObjectId(userId)) {
            throw {code: 400, message: 'Invalida id ' + userId};
        }
        const user = await Users.findByIdAndDelete(Types.ObjectId(userId));
        if (user) {
            await Products.deleteMany({user: user._id});
            res.send('OK');
        } else {
            res.status(404).send({});
        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({email})
        if (!user) {
            throw  {code: 404, message: 'User not found'};
        } else {
            const isOk: boolean = await bcrypt.compare(password, user.password);
            if (!isOk) {
                throw  {code: 401, message: 'Invalid password'};
            }
            const expiresIn = 60 * 60;
            const token = jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET!, {
                expiresIn
            });
            res.send({token, expiresIn});

        }
    } catch (e) {
        const statusCode: number = e.code || 500;
        res.status(statusCode).send({message: e.message});
    }
}