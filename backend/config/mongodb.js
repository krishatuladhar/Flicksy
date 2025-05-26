import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable not set");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log(" DB Error:", error.message);
  }
};

export default dbConnection;
