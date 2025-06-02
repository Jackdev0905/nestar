import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {

    public async signup():Promise<string>{
        return 'Signup exec';
    }
}
