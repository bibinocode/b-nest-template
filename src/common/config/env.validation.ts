import * as Joi from 'joi';

export const envFilePath = [
  `.env.${process.env.NODE_ENV || 'development'}`,
  '.env',
];

/**
 * 基础 开关
 */
export const baseConfigValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  LOG_ON: Joi.boolean().default(true),
});

/**
 * WEBSOCKET 配置
 */
export const websocketConfigValidation = Joi.object({
  WEBSOCKET_AUTO_PONG: Joi.boolean().default(true), // 是否自动发送心跳
  WEBSOCKET_ALLOW_SYNCHRONOUS_EVENTS: Joi.boolean().default(true), // 是否允许同步事件
  WEBSOCKET_CLIENT_TRACKING: Joi.boolean().default(false), // 是否跟踪客户端
  WEBSOCKET_NO_SERVER: Joi.boolean().default(false), // 是否不使用服务器
  WEBSOCKET_PER_MESSAGE_DEFAULTS: Joi.boolean().default(true), // 是否使用默认的 perMessageDeflate
  WEBSOCKET_SKIP_UTF8_VALIDATION: Joi.boolean().default(false), // 是否跳过 UTF-8 验证
  WEBSOCKET_BACKLOG: Joi.number().default(100), // 最大连接数
  WEBSOCKET_MAX_PAYLOAD: Joi.number().default(104857600), // 最大负载
  WEBSOCKET_PORT: Joi.number().default(3031), // 端口
  WEBSOCKET_PATH: Joi.string().default('/'), // 路径
  WEBSOCKET_HOST: Joi.string().default('0.0.0.0'), // 监听地址
});
