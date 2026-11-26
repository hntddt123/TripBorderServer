// Keep only whitelisted keys from a client-supplied object
export const pickAllowedFields = (data, allowedFields) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  return allowedFields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(data, field) && data[field] !== undefined) {
      acc[field] = data[field];
    }
    return acc;
  }, {});
};

// Return a shallow copy of row without the listed keys
export const omitFields = (row, fields) => {
  if (!row || typeof row !== 'object') return row;
  const copy = { ...row };
  fields.forEach((field) => {
    delete copy[field];
  });
  return copy;
};

export const omitFieldsFromRows = (rows, fields) => (Array.isArray(rows) ? rows.map((row) => omitFields(row, fields)) : rows);

// Safe page/limit parsing with defaults and an upper bound for limit
export const parsePagination = (source, { defaultLimit = 10, maxLimit = 100 } = {}) => {
  const rawPage = parseInt(source?.page, 10);
  const rawLimit = parseInt(source?.limit, 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit;
  return { page, limit, offset: (page - 1) * limit };
};

// Column allowlists for PATCH /update/:uuid endpoints
export const UPDATABLE_FIELDS = {
  trips: ['title', 'start_date', 'end_date', 'shared_mode'],
  hotels: ['name', 'address', 'check_in', 'check_out', 'booking_reference'],
  meals: ['name', 'address', 'meal_time'],
  points_of_interest: ['name', 'address', 'visit_time'],
  transports: ['name', 'type', 'address', 'provider', 'booking_reference', 'departure_time', 'arrival_time', 'origin', 'destination'],
  ratings: ['comment', 'score'],
  trip_shares: ['shared_email'],
  mileages: ['is_verified', 'is_listed', 'mileage_price', 'mileage_amount', 'mileage_unit', 'mileage_expired_at'],
  user_accounts: ['role']
};

export const TRIP_SHARED_MODES = ['private', 'shared', 'public'];
export const USER_ROLES = ['user', 'premium_user', 'admin'];
