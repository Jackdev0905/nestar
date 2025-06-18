import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertyResolver } from './property.resolver';
import { PropertyService } from './property.service';
import { ViewModule } from '../view/view.module';
import { AuthModule } from '../auth/auth.module';
import PropertySchema from '../../schemas/Property.model';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]), AuthModule, ViewModule, MemberModule],
  providers: [PropertyResolver, PropertyService]
})
export class PropertyModule {}
 