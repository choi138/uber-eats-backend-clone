import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "./jwt.constant";
import * as jwt from 'jsonwebtoken'
import { JwtModuleOptions } from "./jwt.interface";

@Injectable()
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {
        // console.log(this.options)
    }

    sign(userId: number): string {
        console.log(userId, "유저 아이디임")
        return jwt.sign({ id: userId }, this.options.secretKey)
    }

    verify(token: string) {
        return jwt.verify(token, this.options.secretKey)
    }
}