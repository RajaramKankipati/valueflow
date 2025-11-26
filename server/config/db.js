import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/valueflow');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.warn(`⚠️  MongoDB not available: ${error.message}`);
        console.warn('📝 App will run in LOCAL-ONLY mode (no cloud sync)');
        console.warn('💡 To enable cloud sync, install MongoDB:');
        console.warn('   brew install mongodb-community');
        console.warn('   brew services start mongodb-community');
        return false;
    }
};

export default connectDB;
