import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './entities/jwt.strategy';
import { RoleModule } from 'src/role/role.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_ACCESS_SECRET'),
    }), // for genereted token
  }),
    RoleModule,CompanyModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports:[UserService]
})
export class UserModule { }
