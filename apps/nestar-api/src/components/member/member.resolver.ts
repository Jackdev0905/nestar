import { UsePipes, ValidationPipe } from '@nestjs/common';
import { MemberService } from './member.service';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => String)
	@UsePipes(ValidationPipe)
	public async signup(@Args('input') input: MemberInput): Promise<string> {
		console.log('Mutation: signup');
		console.log("input", input);
		
		return this.memberService.signup();
	}

	@Mutation(() => String)
	@UsePipes(ValidationPipe)
	public async login(@Args('input') input: LoginInput): Promise<string> {
		console.log('Mutation: login');
		return 'login exec';
	}

	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Mutation: getMember');
		return 'getMember exec';
	}
}
