import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ----- Create a User -----
  /**
   * Creates a new user with the provided data.
   *
   * @param createUserDto - The data transfer object containing user details (name, email, password).
   * @returns A promise that resolves to an object containing the created user's id, name, and email.
   * @throws {ConflictException} If a user with the provided email already exists.
   * @throws {InternalServerErrorException} If an unexpected error occurs during user creation.
   *
   * @remarks
   * - The password is securely hashed before storing.
   * - Only the user's id, name, and email are returned; the password is never exposed.
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ id: string; name: string; email: string }> {
    const { name, email, password } = createUserDto;

    // ------------------------------
    // ----- Validate user data -----
    // ------------------------------

    // ----- Check if the user already exists -----
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    // If the user already exists, return an error message
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  // ----- Find All Users -----
  /**
   * Retrieves all users from the database, selecting only their `id`, `name`, and `email` fields.
   *
   * @returns A promise that resolves to an array of user objects, each containing `id`, `name`, and `email`.
   * @throws {NotFoundException} If no users are found in the database.
   * @throws {InternalServerErrorException} If an error occurs while fetching users.
   */
  async findAll(): Promise<{ id: string; name: string; email: string }[]> {
    try {
      // Fetch all users with selected fields
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      // If no users are found, return a not found message
      if (users.length === 0) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while fetching users',
      );
    }
  }

  // ----- Find user By ID -----
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

  // // ----- Update a User -----
  // update(id: string, updateUserDto: any) {
  //   return `This action updates a #${id} user`;
  // }

  // // ----- Delete a User -----
  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
