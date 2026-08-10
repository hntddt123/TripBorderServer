import { DateTime } from 'luxon';

export const DefaultyyyyMMdd = () => DateTime.local().toFormat('yyyy-MM-dd');

export const isSubscriptionActive = (subEndDate) => {
  if (subEndDate
    && DateTime.utc() < DateTime.fromJSDate(subEndDate).toUTC()) {
    return true;
  }
  return false;
};
