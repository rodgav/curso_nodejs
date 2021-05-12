import {Schema, model, Document} from "mongoose";

export interface User extends Document {
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    password: string;
}

const schema = new Schema({
    email: {type: String, unique: true, require: true},
    first_name: {type: String, require: true},
    last_name: {type: String, require: true},
    avatar: {type: String, require: true},
    password: {type: String, require: true}
});

const Users = model<User>('user', schema);

export default Users;