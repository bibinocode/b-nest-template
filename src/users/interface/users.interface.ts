/**
 * 个人信息返回序列
 */
export class UserProfileVO {
  id!: number;
  nickname!: string;
  username!: string;
  email!: string;
  avatar!: string;
  sex!: number;
  signature!: string;
  last_login_ip!: string;
  is_active!: number;
  created_at!: Date;
  updated_at!: Date;
  constructor(partial: Partial<UserProfileVO>) {
    Object.assign(this, partial);
  }
}
