import { DateTime } from 'luxon';

export const newDateyyyyMMdd = () => DateTime.now().toFormat('yyyy-MM-dd');
