import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CreateAccountInput, CreateAccountOutput } from './dto/user/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dto/user/edit-profile.dto';
import { LoginInput, LoginOutput } from './dto/user/login.dto';
import { UserPorfileInput } from './dto/user/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify/verify-email.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    // @Query((returns) => [User])
    // getAll() {
    //     return this.usersService.getAlluser();
    // }

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
    @Role(['Any'])
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @Mutation((returns) => VerifyEmailOutput)
    verifyEmail(
        @Args('input') verifyEmailInput: VerifyEmailInput
    ): Promise<VerifyEmailOutput> {
        return this.usersService.verifyEmail(verifyEmailInput)
    }

    @Mutation((returns) => EditProfileOutput)
    @Role(['Any'])
    editProfile(
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        return this.usersService.editProfile(authUser.id, editProfileInput)
    }
}
