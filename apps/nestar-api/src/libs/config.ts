import { ObjectId } from 'bson';
export const shapeIntoMongooseObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
