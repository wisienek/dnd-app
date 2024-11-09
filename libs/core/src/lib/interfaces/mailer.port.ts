import type { Locales } from '@dnd-app/core';
import type { Readable } from 'stream';

export type MailerAttachment = { fileName: string; content: string | Buffer | Readable };

export type MailerMessage = {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments: MailerAttachment[];
};

export interface MailerPort {
  sendEmailTemplate<T>(
    template: T,
    templateParams: Record<any, any>,
    locale: Locales,
    receivers: string[],
    attachments: MailerAttachment[]
  ): Promise<void>;

  sendEmail(data: MailerMessage): Promise<void>;
}
