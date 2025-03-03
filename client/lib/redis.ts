import Redis from "ioredis";

const redis = () => {
  try {
    new Redis({
      host: "localhost", // or use "127.0.0.1"
      port: 6379, // Default Redis port
    });
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};
export default redis;
