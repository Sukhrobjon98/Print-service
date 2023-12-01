import { Ctx, Help, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ClientService } from '../client/client.service';
import { Message } from 'typegram';
import { OrderService } from '../order/order.service';
import { OrderSource } from '../order/schema/order.schema';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private clientService: ClientService,
    private orderService: OrderService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    if (await this.clientService.hasTelegramUser(ctx.chat.id)) {
      await this.sendWelcomeMessage(ctx);
    } else {
      await ctx.reply('Iltimos, telefon raqamingizni yuboring', {
        reply_markup: {
          keyboard: [
            [
              {
                text: '📲 Raqamni yuborish',
                request_contact: true,
              },
            ],
          ],
        },
      });
    }
  }

  private async sendWelcomeMessage(ctx: Context) {
    await ctx.reply(
      'PrintServicega xush kelibsiz!\nHujjatingiz chop etish uchun bizga yuboring',
    );
  }

  @On('contact')
  async registerClient(@Ctx() ctx: Context) {
    const msg = ctx.message as Message.ContactMessage;

    if (msg.from.id === msg.contact.user_id) {
      if (await this.clientService.hasTelegramUser(msg.contact.user_id)) {
        await ctx.reply("Siz allaqachon ro'yxatdan o'tdingiz", {
          reply_markup: { remove_keyboard: true },
        });
      } else {
        await this.clientService.createClient({
          name: msg.from.first_name,
          phone: msg.contact.phone_number,
          telegramId: msg.contact.user_id,
        });

        await ctx.reply(`Siz muvaffaqiyatli ro'yxatdan o'tdingiz`, {
          reply_markup: { remove_keyboard: true },
        });

        await this.sendWelcomeMessage(ctx);
      }
    } else {
      await ctx.reply("O'zingizni raqamingizni yuboring");
    }
  }

  @On('document')
  async handleFile(@Ctx() ctx: Context) {
    const msg = ctx.message as Message.DocumentMessage;

    if (await this.clientService.hasTelegramUser(msg.from.id)) {
      const client = await this.clientService.getClientByTelegramId(
        msg.from.id,
      );

      await this.orderService.createOrder({
        client: client._id.toHexString(),
        tgFileId: msg.document.file_id,
        source: OrderSource.Telegram,
      });

      await ctx.reply('Hujjatingiz chop etilmoqda');
    } else {
      await ctx.reply("Ro'yxatdan o'tishingiz kerak");
    }
    msg.from.id;
    await ctx.reply(JSON.stringify(msg.document));
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Hujjatlarni chop etadingan bot');
  }
}
