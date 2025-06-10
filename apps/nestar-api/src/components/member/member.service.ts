import { AuthService } from './../auth/auth.service';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Message } from '../../libs/enums/common.enum';
import { MemberStatus } from '../../libs/enums/member.enum';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>, private authService: AuthService) {}

	public async signup(input: MemberInput): Promise<Member> {
		input.memberPassword = await this.authService.hashPassword(input.memberPassword)
		try {
			const result = await this.memberModel.create(input);
			result.accessToken = await this.authService.createToken(result)
			return result;
		} catch (err) {
			console.log('Error, signup model', err?.message);
			throw new BadRequestException(Message.USED_MEMEBERNICK_OR_PHONE);
		}
	}

	public async login(input: LoginInput): Promise<Member> {
	
			const { memberNick, memberPassword } = input;
			const response: any = await this.memberModel.findOne({ memberNick: memberNick }).select('+memberPassword').exec();

			if (!response || response.memberStatus === MemberStatus.DELETE) {
				throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
			} else if (response.memberStatus === MemberStatus.BLOCK) {
				throw new InternalServerErrorException(Message.BLOCKED_USER);
			}

			const isMatch = await this.authService.comparePasswords(memberPassword,response.memberPassword);
			if(!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD)

			response.accessToken = await this.authService.createToken(response)
			
			return response;
		
	}
}
