import { ScheduleConfig } from "@/config/types/BotConfig";

export function isScheduleValid(schedule: ScheduleConfig): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  const isDayValid = schedule.days.includes(currentDay);
  const isHourValid =
    currentHour >= schedule.hours.start && currentHour <= schedule.hours.end;

  return isDayValid && isHourValid;
}
