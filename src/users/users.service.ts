import { Injectable } from '@nestjs/common';
import { empty } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ----- Find All Users -----
  async findAll(): Promise<Object[] | string> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (users.length === 0) {
      return 'No users found';
    }

    return users;
  }

  // ----- Find One user By ID -----
  async findOne(id: string): Promise<Object | string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return 'User not found';
    }

    return user;
  }

  // // ----- Create a User -----
  // create(createUserDto: any) {
  //   return 'This action adds a new user';
  // }

  // // ----- Update a User -----
  // update(id: string, updateUserDto: any) {
  //   return `This action updates a #${id} user`;
  // }

  // // ----- Delete a User -----
  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
