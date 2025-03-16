/**
 * 客户端
 */

interface WebSocketClientOptions {
  url: string;
  onopen?: (client: WebSocket) => void;
  onerror?: (error: any) => void;
  onclose?: () => void;
  onmessage?: (event: string, data: any) => void;
  pingInterval?: number;
  pongTimeout?: number;
  autoReconnect?: boolean;
  retryStrategy?: (retryCount: number) => number;
  maxRetries?: number | null;
  reconnectInterval?: number;
}

class WebSocketClient {
  private ws: WebSocket;
  private options: WebSocketClientOptions;
  private pingControl: any;
  private pongControl: any;
  private autoReconnect: boolean;
  private closeState = false;
  private reconnecting = false;
  private retryCount = 0;
  private retryData: any[] = []; // 重连期间send 发送的数据
  static clients: Map<string, WebSocketClient> = new Map();

  constructor(options: WebSocketClientOptions) {
    this.options = options;
    this.autoReconnect = options.autoReconnect || false;
  }

  static getInstance(options: string | WebSocketClientOptions) {
    // 可以直接通过 url 传递 或者对象
    if (typeof options === 'string') {
      if (!WebSocketClient.clients.get(options)) {
        const client = new WebSocketClient({ url: options });
        WebSocketClient.clients.set(options, client);
        return client;
      } else {
        return WebSocketClient.clients.get(options);
      }
    } else {
      if (!WebSocketClient.clients.get(options.url)) {
        const client = new WebSocketClient(options);
        WebSocketClient.clients.set(options.url, client);
        return client;
      } else {
        return WebSocketClient.clients.get(options.url);
      }
    }
  }

  connect() {
    this.ws = new WebSocket(this.options.url);

    this.ws.onopen = () => {
      if (typeof this.options.onopen === 'function') {
        this.options.onopen(this.ws);
      }
      // 连接上 关闭重连
      this.reconnecting = false;
      // ping 检测
      this.sendPing();
      this.ws.onmessage = (e: MessageEvent<any>) => {
        // 可能不是一个 json 类型数据
        try {
          const { event, data } = JSON.parse(e.data);
          if (event === 'pong') {
            this.pongHandler();
          } else {
            this.processData(event, data);
          }
        } catch (error) {
          const { onmessage } = this.options;
          if (typeof onmessage === 'function') {
            onmessage('message', e);
          }
        }
      };
    };

    // error
    this.ws.onerror = (err: any) => {
      // error 的时候重连关闭
      this.reconnecting = false;
      const { onerror } = this.options;
      if (typeof onerror === 'function') {
        onerror(err);
      }
    };

    // close
    this.ws.onclose = () => {
      // 关闭重连
      this.reconnecting = false;
      const { onclose } = this.options;
      if (typeof onclose === 'function') {
        onclose();
      }
      this.reconnect();
    };
  }

  /**
   * 断线重连
   */
  reconnect() {
    // 阻止自动重连
    if (!this.autoReconnect || this.closeState) return;
    // 是否正在重连
    if (this.reconnecting) return;
    this.reconnecting = true;
    this.retryCount++;
    const { retryStrategy, maxRetries, reconnectInterval } = this.options;
    // 达到最大重试次数 关闭链接
    if (maxRetries && this.retryCount > maxRetries) {
      return this.close();
    }
    const delay = retryStrategy
      ? retryStrategy(this.retryCount)
      : reconnectInterval || 3000;
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * 断开连接回收资源
   */
  close() {
    if (this.pingControl) {
      clearTimeout(this.pingControl);
    }
    if (this.pongControl) {
      clearTimeout(this.pongControl);
    }
    if (this.ws) {
      this.ws.close();
    }
    this.closeState = true;
  }

  sendPing() {
    this.send('ping');
    // 检测 pong 是否正常
    this.pongControl = setTimeout(() => {
      if (this.ws) {
        this.ws.close();
      } else {
        if (
          this.options?.onerror &&
          typeof this.options.onerror === 'function'
        ) {
          this.options.onerror(new Error('pong timeout'));
        }
      }
    }, this.options.pongTimeout || 5000);
  }

  pongHandler() {
    clearTimeout(this.pongControl);
    // 关闭计时器
    this.pingControl = setTimeout(() => {
      this.sendPing();
    }, this.options.pingInterval || 5000);
  }

  formData(data: any) {
    if (typeof data === 'string') {
      return data;
    } else {
      return JSON.stringify(data);
    }
  }

  send(data: any) {
    // 重连期间的数据需要恢复发送
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // 离线期间数据重发
      if (this.retryData.length > 0) {
        this.retryData.forEach((item: any) => {
          this.ws.send(this.formData(item));
        });
        this.retryData = [];
      }
      this.ws.send(this.formData(data));
    } else {
      // 离线时如果数据发送失败 则缓存 如果event = ping 心跳检测则不缓存 防止心跳多次发送
      if (data && data['event'] && data['event'] === 'ping') return;
      this.retryData.push(data);
    }
  }
  // 其他消息处理
  processData(event: string, data: any) {
    const { onmessage } = this.options;
    if (typeof onmessage === 'function') {
      onmessage(event, data);
    }
  }
}
