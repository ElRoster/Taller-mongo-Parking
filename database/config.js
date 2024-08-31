import { connect } from 'mongoose';

const dbConnect = async () => {
    try {
        await connect (process.env.MONGO_CNN)
        console.log('connect to database');
    }

    catch (error){
        console.log('Error connecting to MongoDB', error);
    }
}

export default dbConnect;