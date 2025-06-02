import { MemberService } from './member.service';
import { Mutation, Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => String)
	public async signup(): Promise<string> {
		console.log('Mutation: signup');
		return this.memberService.signup();
	}

	@Mutation(() => String)
	public async login(): Promise<string> {
		console.log('Mutation: login');
		return 'login exec';
	}

	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Mutation: getMember');
		return 'getMember exec';
	}
}
