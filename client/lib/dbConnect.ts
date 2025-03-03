import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "your-mongodb-connection-string-here";

export const MongooseConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB.");
      return;
    }

    // Connecting to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);  // Exit process with failure
  }
};
