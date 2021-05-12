import mongoose from 'mongoose';

const connect = async (): Promise<boolean> => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export default connect;