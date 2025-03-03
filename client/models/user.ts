// /models/User.ts
import mongoose from "mongoose";

// Define the User interface that extends Document (to work with Mongoose)


// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Make password optional for OAuth users
    select: false, // Don't include password in query results by default
  },
  name: {
    firstName: {
      type: String,
      required: true,
      default: "",
    },
    lastName: {
      type: String,
      required: true,
      default: "",
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
  },
  image: String,
}, {
  timestamps: true,
  strict: false, // Allow fields that aren't specified in schema
});

// Export the model
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
