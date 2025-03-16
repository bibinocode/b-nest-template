import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import fs from 'fs';
/**
 * 配置 WebSocket 网关
 */
export function getOptions() {
  const envFiles = [`.env.${process.env.NODE_ENV} || 'development'`, '.env'];

  // 环境是否存在,用 dotenv 解析
  let parsedConfig;
  if (!fs.existsSync('.env')) {
    parsedConfig = process.env;
  } else {
    parsedConfig = dotenv.config();
  }

  envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const { parsed } = dotenv.config({ path: file });
      Object.assign(parsedConfig, parsed);
    }
  });

  const schema = Joi.object({
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

  const { value, error } = schema.validate(parsedConfig.parsed);
  if (error) {
    throw new Error(error.message);
  }

  const wsOptions = {
    autopong: value['WEBSOCKET_AUTO_PONG'],
    allowSynchronousEvents: value['WEBSOCKET_ALLOW_SYNCHRONOUS_EVENTS'],
    clientTracking: value['WEBSOCKET_CLIENT_TRACKING'],
    noServer: value['WEBSOCKET_NO_SERVER'],
    perMessageDeflate: value['WEBSOCKET_PER_MESSAGE_DEFAULTS'],
    skipUTF8Validation: value['WEBSOCKET_SKIP_UTF8_VALIDATION'],
    backlog: value['WEBSOCKET_BACKLOG'],
    maxPayload: value['WEBSOCKET_MAX_PAYLOAD'],
    port: value['WEBSOCKET_PORT'],
    path: value['WEBSOCKET_PATH'],
    host: value['WEBSOCKET_HOST'],
  };
  return wsOptions;
}
