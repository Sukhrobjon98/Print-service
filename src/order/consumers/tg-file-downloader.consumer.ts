import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import DownloadTgFileQueue from '../dto/queue/download-tg-file.queue';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import axios from 'axios';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import * as stream from 'stream';
import * as path from 'path';
import PrintFileQueue from '../dto/queue/print-file.queue';

const downloader = axios.create();

@Processor('download_telegram_file')
export class TgFileDownloaderConsumer {
  private logger = new Logger(TgFileDownloaderConsumer.name);

  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    @InjectQueue('print') private printQueue: Queue,
  ) {}

  @Process()
  async download(job: Job<DownloadTgFileQueue>) {
    const file = await this.bot.telegram.getFileLink(job.data.fileId);

    const savePath = `./files/${job.data.orderId}.pdf`;
    await this.downloadFileAxios(file.href, savePath);

    this.logger.log('File downloaded', savePath);

    await this.printQueue.add({
      orderId: job.data.orderId,
      path: path.resolve(savePath),
    } as PrintFileQueue);

    return {};
  }

  private async downloadFileAxios(url: string, savePath: string) {
    const result = await downloader.get<stream.Stream>(url, {
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      result.data.pipe(fs.createWriteStream(savePath), { end: true });

      result.data.on('close', resolve);
      result.data.on('error', reject);
    });
  }
}
