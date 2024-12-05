# Prisma使用

1. 安装

   ```bash
   pnpm install prisma --save-dev
   ```
2. 初始化

   ```
   pnpm dlx prisma --datasrouce-provider mysql
   ```
3. 改 `env` 文件中的链接地址

```bash
DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/mydb"
```

4. 定义数据模型


```prisma
// prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int

  @@map("posts") // 指定表名
}

```


5. 创建数据库表 并生成Prisma客户端

```bash
prisma migrate dev --name init # 开发环境 会生成文件进行对比
OR
prisma migrate deploy # 部署
```


6. 将prisma作为模块提供给Nest使用，防止重复创建Client

```bash
nest g mo prisma
nest g s prisma
```


```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

```


```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 记得导出这样app.module.ts会顺着imports查找然后找到模块内部providers
})
export class PrismaModule {}
```

7. 添加一些常用脚本 `package.json`

```json
"scripts":{
  "preinstall": "prisma generate",
  "migrate:create":"prisma migrate dev",
  "migrate:deploy":"prisma migrate deploy"
}
```