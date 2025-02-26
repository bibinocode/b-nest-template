import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import iconv from 'iconv-lite';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async getIpAddress(ip: string) {
    try {
      const IP_URL = 'https://whois.pconline.com.cn/ipJson.jsp';
      const response = await this.httpService.axiosRef(
        `${IP_URL}?ip=${ip}&json=true`,
        {
          responseType: 'arraybuffer',
          transformResponse: [
            function (res) {
              const str = iconv.decode(res, 'gbk');
              return JSON.parse(str);
            },
          ],
        },
      );
      return response.data?.addr;
    } catch (error) {
      return '未知';
    }
  }
}
