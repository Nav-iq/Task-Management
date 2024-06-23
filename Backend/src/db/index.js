import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n Connected to DB !!`);
  } catch (error) {
    console.error("Error Connecting to DB !!", error);
    process.exit(1);
  }
};

export { connectDb };
