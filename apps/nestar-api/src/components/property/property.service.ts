import { ViewService } from './../view/view.service';
import { MemberService } from './../member/member.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Property } from '../../libs/dto/property/property';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		private memberService: MemberService,
		private viewService: ViewService,
	) {}

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input);
			await this.memberService.memberStatsEditor({ _id: result._id, targetKey: 'memberProperties', modifier: 1 });
			return result;
		} catch (err) {
			console.log('Error, createProperty service', err?.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
		const search: T = {
			_id: propertyId,
			propertyStatus: PropertyStatus.ACTIVE,
		};
		const targetProperty = await this.propertyModel.findOne(search).exec();

		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput: ViewInput = {
				memberId: memberId,
				viewRefId: propertyId,
				viewGroup: ViewGroup.PROPERTY,
			};
			const newView = await this.viewService.viewRecord(viewInput);
			if (newView) {
				await this.propertStatsModifier({
					_id: propertyId,
					targetKey: 'propertViews',
					modifier: 1,
				});
				targetProperty.propertyViews++;
			}
		}
		targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);

		return targetProperty;
	}

	public async propertStatsModifier(input: StatisticModifier): Promise<Property | null> {
		const { _id, modifier, targetKey } = input;

		return await this.propertyModel
			.findByIdAndUpdate(
				_id,
				{
					$inc: {
						[targetKey]: modifier,
					},
				},
				{ new: true },
			)
			.exec();
	}
}
