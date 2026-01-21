import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database connected");
    } catch (error) {
        console.log("Error: ", error.message);
        process.exit(1);
    }
};
