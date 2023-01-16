import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { CreateAccountInput, CreateAccountOutput } from './dto/user/create-account.dto';
import { LoginInput, LoginOutput } from './dto/user/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query((returns) => String)
    sayHello(): string {
        return 'Hello World!';
    }

    @Mutation((returns) => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput,
    ): Promise<CreateAccountOutput> {
        return this.usersService.createAccount(createAccountInput);
    }

    @Mutation((returns) => LoginOutput)
    async login(
        @Args('input') loginInput: LoginInput,
    ): Promise<LoginOutput> {
        return this.usersService.login(loginInput);
    }

    @Query((returns) => User)
    me(@AuthUser() authUser: User) {
        return authUser;
    }
}
