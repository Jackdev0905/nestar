import { BoardArticleService } from './../board-article/board-article.service';
import { PropertyService } from './../property/property.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { lookupMember, shapeIntoMongooseObjectId } from '../../libs/config';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		private memberService: MemberService,
		private propertyService: PropertyService,
		private boardArticleService: BoardArticleService,
	) {}

	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		input.memberId = memberId;
		let result: Comment | null = null;
		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, service createComment', err.message);
			throw new InternalServerErrorException(Message.CREATE_FAILED);
		}
		if (input.commentGroup === CommentGroup.MEMBER)
			await this.memberService.memberStatsEditor({
				_id: input.commentRefId,
				targetKey: 'memberComments',
				modifier: 1,
			});
		else if (input.commentGroup === CommentGroup.ARTICLE)
			await this.boardArticleService.boardArticleStatsModifier({
				_id: input.commentRefId,
				targetKey: 'articleComments',
				modifier: 1,
			});
		else input.commentGroup === CommentGroup.PROPERTY;
		await this.propertyService.propertStatsModifier({
			_id: input.commentRefId,
			targetKey: 'propertyComments',
			modifier: 1,
		});
		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);

		return result;
		// Commentni boshqa id va boshqa groupga yzosa ham bolyapti
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;

		const result = await this.commentModel
			.findOneAndUpdate({ _id: _id, memberId: memberId, commentStatus: CommentStatus.ACTIVE }, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = { commentStatus: CommentStatus.ACTIVE, commentRefId: commentRefId };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
	public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
		const result = await this.commentModel.findByIdAndDelete(input).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
        // Unda delete status nimaga kerak
	}
}
