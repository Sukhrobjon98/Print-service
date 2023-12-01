import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import PrintFileQueue from '../dto/queue/print-file.queue';
import child_process from 'child_process';

@Processor('print')
export class PrintConsumer {
  private logger = new Logger(PrintConsumer.name);

  @Process()
  async download(job: Job<PrintFileQueue>) {
    child_process.spawnSync('lp', [
      '-d',
      'Brother_HL-L2320D_series',
      job.data.path,
    ]);
    this.logger.log('Print file', job.data.path);
    return {};
  }
}
