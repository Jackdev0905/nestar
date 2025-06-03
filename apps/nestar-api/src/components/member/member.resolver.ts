import { InternalServerErrorException, UsePipes, ValidationPipe } from '@nestjs/common';
import { MemberService } from './member.service';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => Member)
	@UsePipes(ValidationPipe)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		try {
			console.log('Mutation: signup');
			console.log('input', input);
			return this.memberService.signup(input);
		} catch (err) {
			console.log('Error, signup', err);
			throw new InternalServerErrorException(err);
		}
	}

	@Mutation(() => Member)
	@UsePipes(ValidationPipe)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		try {
			console.log('Mutation: login');
			return this.memberService.login(input);
		} catch (err) {
			console.log('Error, signup', err);
			throw new InternalServerErrorException(err);
		}
	}

	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Mutation: getMember');
		return 'getMember exec';
	}
}
