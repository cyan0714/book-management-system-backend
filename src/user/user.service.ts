import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();

    const foundUser = users.find(
      (user) => user.username === registerUserDto.username,
    );

    if (foundUser) {
      throw new BadRequestException('the username already exists');
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;

    users.push(user);

    await this.dbService.write(users);

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();

    const foundUser = users.find(
      (item) => item.username === loginUserDto.username,
    );

    if (!foundUser) {
      throw new BadRequestException('the username does not exist');
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('the password is incorrect');
    }

    return foundUser;
  }
}
