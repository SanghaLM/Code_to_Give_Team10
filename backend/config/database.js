//Use Mongoose's connect() method.
//Use a free MongoDB Atlas connect string as a demonstration, in order to run the sample code.
const mongoose = require('mongoose');

// **Note: This URI is for demonstration purposes only. For production environments, 
// please use your own URI and store it in the environment variables.**
const MOCK_DB_URI = 'mongodb+srv://mockuser:mockpassword@cluster0.abcde.mongodb.net/homework_app?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        await mongoose.connect(MOCK_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log('MongoDB Mock Database Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
