import dotenv from 'dotenv';
import cleaner from './utils/cleaner';
import { connectToDB, disconnectFromDB } from './services/mongo';

dotenv.config();

const removeCreatedAtDaysAgo = process.env.REMOVE_CREATED_AT_DAYS_AGO;

(async (): Promise<void> => {
  try {
    await connectToDB();

    await cleaner(Number(removeCreatedAtDaysAgo));

    await disconnectFromDB();
  } catch (error) {
    throw new Error(error.message);
  }
})()
