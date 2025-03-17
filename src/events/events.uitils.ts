import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {
  envFilePath,
  websocketConfigValidation,
} from 'src/common/config/env.validation';
/**
 * 配置 WebSocket 网关
 */
export function getOptions() {
  const envFiles = envFilePath;

  // 初始化配置对象
  let config = {};

  // 读取环境变量
  if (!fs.existsSync('.env')) {
    config = process.env;
  } else {
    const { parsed } = dotenv.config();
    config = parsed || {};
  }

  // 合并其他环境文件
  envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const { parsed } = dotenv.config({ path: file });
      if (parsed) {
        config = { ...config, ...parsed };
      }
    }
  });

  // 只验证 WebSocket 相关的配置
  const { value, error } = websocketConfigValidation.validate(config, {
    allowUnknown: true, // 允许没有定义的 schema 存在
  });
  if (error) {
    throw new Error(`WebSocket 配置验证错误: ${error.message}`);
  }

  return {
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
}
