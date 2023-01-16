import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput, CreateAccountOutput } from './dto/user/create-account.dto';
import { LoginInput, LoginOutput } from './dto/user/login.dto';
import { UserProfileOutput } from './dto/user/user-profile.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verificatoin.entity';

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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: id }, select: ['id', 'email', 'password', 'role', 'verified'] });
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
}
