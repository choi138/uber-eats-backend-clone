import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { User } from "src/users/entities/user.entity";
import { AllowdRoles } from "./role.decorator";

// auth-guard를 통해서 로그인된 유저인지 아닌지 확인 + 어느 유저인지 확인
@Injectable()
export class AuthGard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowdRoles>(
            'roles',
            context.getHandler(),
        )
        if(!roles){
            return true
        }
        const graphqlContext = GqlExecutionContext.create(context).getContext();
        const user: User = graphqlContext['user'];
        if (!user) {
            return false
        }
        if(roles.includes('Any')){
            return true
        }
        return roles.includes(user.role)
    }
}