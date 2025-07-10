import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // ----- Find All Users -----
  findAll() {
    return 'This action returns all users';
  }

  // ----- Find One user By ID -----
  findOne(id: string) {
    return `This action returns a #${id} user`;
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
