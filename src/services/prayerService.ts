import { PrayerTime } from '@/types';

export const prayerService = {
  async getPrayerTimes(city: string = 'Karachi', country: string = 'Pakistan'): Promise<PrayerTime> {
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=1`);
    const data = await response.json();
    return data.data.timings;
  }
};
