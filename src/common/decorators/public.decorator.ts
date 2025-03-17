import { SetMetadata } from '@nestjs/common';

/**
 * 不需要鉴权
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
