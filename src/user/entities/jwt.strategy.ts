import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
     private readonly cls: ClsService, // 1. CLS ni konstruktorga qo'shamiz
  ) {
    const secret = config.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    // console.log("payload");
    // console.log(payload.company_id);
   
    // this.cls.set("company_id", payload.company_id);
    return payload;
  }
}