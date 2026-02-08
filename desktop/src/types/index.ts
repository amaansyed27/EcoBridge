import { z } from 'zod';

// System Stats Schema
export const SystemStatsSchema = z.object({
  cpu: z.object({
    load: z.number(),
    temp: z.number(),
  }),
  ram: z.object({
    used: z.number(),
    total: z.number(),
    active: z.number(),
  }),
  gpu: z.object({
    load: z.number(),
    temp: z.number(),
    name: z.string(),
  }),
  volume: z.number(),
  muted: z.boolean(),
});

export type SystemStats = z.infer<typeof SystemStatsSchema>;

// Commands Schema
export const CommandSchema = z.object({
  action: z.enum(['media', 'volume', 'mute', 'system']),
  params: z.object({
    type: z.enum(['playPause', 'next', 'prev', 'stop', 'lock', 'taskmgr']).optional(),
    value: z.number().optional(),
  }),
});

export type Command = z.infer<typeof CommandSchema>;

// Remote Input Schema
export const RemoteInputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('mouse-move'),
    params: z.object({
      dx: z.number(),
      dy: z.number(),
    }),
  }),
  z.object({
    type: z.literal('mouse-click'),
    params: z.object({
      button: z.enum(['left', 'right']),
    }),
  }),
  z.object({
    type: z.literal('keyboard'),
    params: z.object({
      text: z.string(),
    }),
  }),
]);

export type RemoteInput = z.infer<typeof RemoteInputSchema>;

// Clipboard Sync Schema
export const ClipboardSyncSchema = z.object({
  text: z.string(),
});

export type ClipboardSync = z.infer<typeof ClipboardSyncSchema>;

// Video Frame Schema
export const VideoFrameSchema = z.any(); // Raw binary data from socket.io

export type VideoFrame = any;

// Device Registration
export const RegisterSchema = z.string(); // 'mobile' | 'desktop-ui' etc
