import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  message!: string;

  @ApiProperty()
  access_token!: string;

  @ApiProperty()
  user!: {
    id: number;
    email: string;
    username: string;
    nickname?: string;
    avatar?: string;
    sex?: string;
    signature?: string;
    last_login_ip?: string;
  };
}
