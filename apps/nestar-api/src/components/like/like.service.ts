import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { Like } from '../../libs/dto/like/like';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

	public async likeToggle(input: LikeInput): Promise<number> {
		let modifier = 1;
		const search: T = {
			memberId: input.memberId,
			likeRefId: input.likeRefId,
		};
		const exist = await this.likeModel.findOne(search).exec();
		if (exist) {
			await this.likeModel.findOneAndDelete(input).exec();
			modifier = -1;
		}
		else{
            try {
			await this.likeModel.create(input);
            
		} catch (err) {
			console.log('Error, likeToggle model', err?.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
        }
		return modifier;
	}
}
