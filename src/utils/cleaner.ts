import { subDays } from 'date-fns';
import propertyModel from '../models/property';
import communeModel from '../models/commune';

const cleanOldProperties = async (createdAtDaysAgo: number): Promise<null> => {
  try {
    const date = subDays(new Date(), createdAtDaysAgo);

    const communes = await communeModel.find({});
    const propertiesToDelete = await propertyModel.find({ createdAt: {$lt: date} });
    // eslint-disable-next-line no-underscore-dangle
    const propertiesToDeleteIds = propertiesToDelete.map((property) => (property._id));

    await Promise.all(communes.map(async (commune) => {
      // eslint-disable-next-line no-underscore-dangle
      await communeModel.updateOne({_id: commune._id}, { $pullAll: { properties: propertiesToDeleteIds } });

      await commune.save();
    }));

    const deleteProperties = await propertyModel.deleteMany({ _id: { $in: propertiesToDeleteIds } });

    console.log({deleteProperties});
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default cleanOldProperties;
