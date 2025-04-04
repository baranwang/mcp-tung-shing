import { DailyAlmanac } from "./types";

/**
 * 处理方向文本，对东南西北添加"正"前缀
 */
export function handleDirection(direction: string): string {
  const directions = {
    东: '正东',
    南: '正南',
    西: '正西',
    北: '正北',
  };

  return directions[direction as keyof typeof directions] || direction;
}

