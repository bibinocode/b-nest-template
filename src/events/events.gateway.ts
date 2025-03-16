import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { getOptions } from './events.uitils';
import { v4 as uuidv4 } from 'uuid';

const clientsMap = new Map();
const clientControlMap = new Map();
@WebSocketGateway(getOptions())
export class EventsGateway implements OnGatewayConnection {
  constructor() {}
  handleConnection(client: any, ...args: any[]) {
    // 设置clientId 方便后续心跳使用
    if (client) {
      client.clientId = uuidv4();
      clientsMap.set(client.clientId, client);
    }
  }

  @SubscribeMessage('message')
  handleEvents(client: any, payload: any): void {
    console.log('🚀 ~ EventsGateway ~ handleEvents ~ payload:', payload);
  }

  /**
   * ping心跳处理
   */
  @SubscribeMessage('ping')
  handlePing(client: any): void {
    client.send(
      JSON.stringify({
        event: 'pong',
      }),
    );

    const clientId = client.clientId;
    if (clientControlMap.has(clientId)) {
      clearTimeout(clientControlMap.get(clientId));
    }
    // 计时器去判断当前 client 是否健康
    const ctrl = setTimeout(() => {
      client.close();
    }, 60000);
    clientControlMap.set(clientId, ctrl);
  }
}
