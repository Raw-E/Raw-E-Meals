// Importing required modules
const { MongoClient, ServerApiVersion } = require("mongodb");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Function to get MongoDB URI
// If in production, it fetches the URI from Google Secret Manager
// If in development, it fetches the URI from .env file
async function getMongoDBURI() {
  if (process.env.NODE_ENV === "production") {
    // Create a new SecretManagerServiceClient
    const secretsClient = new SecretManagerServiceClient();

    try {
      // Access the secret version
      const [version] = await secretsClient.accessSecretVersion({
        name: "projects/882775215945/secrets/mongodb-uri/versions/latest",
      });

      // Convert the payload data to string
      const mongoURI = version.payload.data.toString("utf8");

      return mongoURI;
    } catch (error) {
      console.error(
        "Error fetching MongoDB URI from Secret Manager:",
        error.message,
      );
      throw error;
    }
  } else {
    // Fallback to .env file for development
    console.log("Using local MongoDB URI from .env");
    return process.env.MONGODB_URI;
  }
}

// Function to connect to MongoDB
// It takes a MongoDB URI as input and returns a connected MongoClient
async function connectToMongoDB(uri) {
  // Create a new MongoClient
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Connection to MongoDB failed!", error);
    // Exit the process with failure code
    process.exit(1);
  }
}

// Export the functions
module.exports = { getMongoDBURI, connectToMongoDB };
