import { DateTime } from 'luxon';

export const DefaultyyyyMMdd = () => DateTime.local().toFormat('yyyy-MM-dd');
