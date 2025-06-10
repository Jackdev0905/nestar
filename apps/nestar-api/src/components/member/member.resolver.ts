import { MemberService } from './member.service';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		return this.memberService.signup(input);
	}

	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return this.memberService.login(input);
	}

	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Mutation: getMember');
		return 'getMember exec';
	}

	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async updateMember(@AuthMember('_id') _id: ObjectId): Promise<string> {
		console.log('Mutation: updateMember');
		console.log('Id:', _id);

		return this.memberService.updateMember();
	}

	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');

		return `Hi, ${memberNick}`;
	}

	@Roles(MemberType.ADMIN, MemberType.USER)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		return `Hi ${authMember.memberNick}, you are ${authMember.memberType}`;
	}

	// ADMIN
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async getAllMembersByAdmin(@AuthMember('memberType') memberType: MemberType): Promise<string> {
		console.log('MemberType', memberType);
		return this.memberService.getAllMembersByAdmin();
	}
}
