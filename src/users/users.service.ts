import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dto/user/create-account.dto';
import { LoginInput, LoginOutput } from './dto/user/login.dto';
import { UserPorfileInput, UserProfileOutput } from './dto/user/user-profile.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verificatoin.entity';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify/verify-email.dto';
import { EditProfileInput, EditProfileOutput } from './dto/user/edit-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) { }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already.' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(
        this.verifications.create({ user: user })
      );
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: "Couldn't create account."
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ where: { email }, select: ['id', 'password'] })
      if (!user) {
        return {
          ok: false,
          error: 'User not found.'
        }
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password.'
        }
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token: token
      }
    } catch (err) {
      return {
        ok: false,
        error: 'Could not login.'
      }
    }
  }

  async findById(userId: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({
        where: { id: userId },
        select: ['id', 'email', 'password', 'role', 'verified']
      });
      return {
        ok: true,
        user: user
      }
    } catch (err) {
      return {
        ok: false,
        error: 'User not found.'
      }
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code: code },
        relations: ['user']
      })
      if (!verification) {
        return {
          ok: false,
          error: 'Verification not found.'
        }
      }
      const verifyUser = verification.user;
      verifyUser.verified = true;
      await this.users.save(verifyUser)
      await this.verifications.delete(verification.id)
      return { ok: true }
    } catch (err) {
      console.log(err)
      return {
        ok: false,
        error: 'Could not verify email.'
      }
    }
  }

  async editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput> {
    try {
      const exists = await this.users.findOne({ where: { email: email } })
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with that email.'
        }
      }
      const user = await this.users.findOne({ where: { id: userId } })
      if (email) {
        user.email = email;
        user.verified = false;
        this.verifications.delete({ user: { id: user.id } })
        await this.verifications.save(this.verifications.create({ user }))
      }
      if (password) {
        user.password = password
      }
      await this.users.save(user)
      return { ok: true }
    } catch (err) {
      console.log(err)
      return {
        ok: false,
        error: 'Could not edit profile.'
      }
    }
  }
}
