import { Controller, Get, OnModuleInit } from '@nestjs/common';

@Controller()
export class AppController implements OnModuleInit {
  constructor() {} // @InjectRepository(User) private userRepository: Repository<User>,
  onModuleInit() {
    console.log('onModuleInit');
  }

  @Get()
  async getUser() {
    // const res = (await this.userRepository).find();
    // return res;
    return 'hello';
  }
}
