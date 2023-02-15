import * as dayjs from 'dayjs';

export class DateUtils {
  static formatTimezone(
    date: Date,
    timezone?: string,
    defaultTimezone = 'UTC',
    format = 'DD/MM/YYYY HH:mm z',
  ): string {
    let formatedDate: string;

    timezone ||= defaultTimezone;

    try {
      formatedDate = dayjs(date).tz(timezone).format(format);
    } catch (_) {
      formatedDate = dayjs(date).tz(defaultTimezone).format(format);
    }

    return formatedDate;
  }
}
