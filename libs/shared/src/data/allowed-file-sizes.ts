import { FileType } from '@dnd-app/enums';

export const AllowedFileSizes = {
  [FileType.BUNDLE]: 220 * 1024 * 1024,
  [FileType.ASSET]: 15 * 1024 * 1024,
  [FileType.CONFIG]: 5 * 1024 * 1024,
  [FileType.UNKNOWN]: 3 * 1024 * 1024,
} as const;
