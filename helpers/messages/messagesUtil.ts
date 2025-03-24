import { Request } from 'express';
import { messages_en } from './messages_en';
import { messages_id } from './messages_id';
import { MessagesKey } from './messagesKey';

export function getMessage(
  req: Request,
  key: keyof typeof MessagesKey,
): string {
  const language = req.headers['accept-language'];
  let messages: { [key in keyof typeof MessagesKey]?: string };

  if (language === 'id') {
    messages = messages_id;
  } else {
    messages = messages_en;
  }

  const prefix = 'TEMPLATE - ';
  return prefix + (messages[key] ?? 'Message not defined');
}

export function formatMessage(message: string, replacements: string[]): string {
  return message.replace(/{(\d+)}/g, function (match, number) {
    return typeof replacements[number] != 'undefined'
      ? replacements[number]
      : match;
  });
}
