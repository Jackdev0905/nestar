import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupVisited } from '../../libs/config';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

	public async viewRecord(input: ViewInput): Promise<View | null> {
		console.log('Record view executed');
		const viewExist = await this.checkViewExistance(input);
		if (!viewExist) {
			console.log('-- New View Insert --');
			return await this.viewModel.create(input);
		} else return null;
	}

	private async checkViewExistance(input: ViewInput): Promise<View | null> {
		return await this.viewModel.findOne(input).exec();
	}

	public async getVisitedProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties | null> {
			const { page, limit } = input;
			const match: T = { viewGroup: ViewGroup.PROPERTY, memberId: memberId };
			const data = await this.viewModel.aggregate([
				{ $match: match },
				{ $sort: { updateAt: -1 } },
	
				{
					$lookup: {
						from: 'properties',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedProperty',
					},
				},
				{
					$unwind: '$visitedProperty',
				},
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupVisited,
							{
								$unwind: '$visitedProperty.memberData',
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			]);
			console.log(data);
			const result: Properties = {
				list: data[0].list.map((ele) => ele.visitedProperty),
				metaCounter: data[0].metaCounter,
			};
	
			return result;
		}
}
