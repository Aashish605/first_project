import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
        logging: false,          // set true to see SQL queries in terminal
        dialectOptions: {
            timezone: 'local',
        },
    }
);

// Test connection
try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
} catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
}

export default sequelize;