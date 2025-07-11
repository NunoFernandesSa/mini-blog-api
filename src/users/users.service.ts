import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  // ----- Create a User -----
  async create(createUserDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<Object | string> {
    const { name, email, password } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    // Validate user data
    // Ensure that name, email, and password are provided
    if (!name || !email || !password) {
      throw new BadRequestException('Invalid user data');
    }

    // If the user already exists, return an error message
    if (existingUser) {
      return 'User with this email already exists';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  }

  // // ----- Update a User -----
  // update(id: string, updateUserDto: any) {
  //   return `This action updates a #${id} user`;
  // }

  // // ----- Delete a User -----
  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
