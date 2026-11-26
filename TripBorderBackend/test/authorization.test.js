/* eslint-disable global-require */
// Env needed by authController's cleanEnv at import time (test-only dummy values)
Object.assign(process.env, {
  GOOGLE_CLIENT_ID: 'test',
  GOOGLE_CLIENT_SECRET: 'test',
  JWT_ACCESS_SECRET: 'test-access',
  JWT_REFRESH_SECRET: 'test-refresh',
  ACCESS_EXP: '900000',
  REFRESH_EXP: '604800000',
  DB_HOST: 'localhost',
  DB_USER: 'test',
  DB_NAME: 'test',
  FRONTEND_ORIGIN: 'https://tripborder.com'
});

const mockFirst = jest.fn();
const mockQuery = {
  where: jest.fn(() => mockQuery),
  select: jest.fn(() => mockQuery),
  join: jest.fn(() => mockQuery),
  first: mockFirst
};

jest.mock('../api/knex/knexDBInstance', () => ({
  knexDBInstance: jest.fn(() => mockQuery)
}));
jest.mock('../api/knex/authknex', () => ({
  loadUserDB: jest.fn(),
  upsertUserOnGoogleLoginDB: jest.fn()
}));
jest.mock('../api/knex/tripsknex', () => ({
  getTripAccessDB: jest.fn()
}));

const {
  pickAllowedFields, omitFieldsFromRows, parsePagination, UPDATABLE_FIELDS
} = require('../api/routes/controllers/utility/fieldUtility');
const { requireRole, getAuthStatus } = require('../api/routes/controllers/authController');
const {
  requireTripReadAccess, requireTripOwner, requireRowOwnerEmail, forceOwnerEmail, fromBodyTripID, fromParamsUUID
} = require('../api/middlewares/authorizationMiddleware');
const { getTripAccessDB } = require('../api/knex/tripsknex');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  return res;
};

const owner = { uuid: 'u1', email: 'owner@example.com', role: 'user' };
const other = { uuid: 'u2', email: 'other@example.com', role: 'user' };
const admin = { uuid: 'u3', email: 'admin@example.com', role: 'admin' };

describe('fieldUtility', () => {
  it('pickAllowedFields drops unknown columns', () => {
    expect(pickAllowedFields({ role: 'admin', email: 'x', stripe_customer_id: 'y' }, UPDATABLE_FIELDS.user_accounts))
      .toEqual({ role: 'admin' });
    expect(pickAllowedFields(null, ['a'])).toEqual({});
  });
  it('omitFieldsFromRows strips fields', () => {
    expect(omitFieldsFromRows([{ a: 1, owner_email: 'x' }], ['owner_email'])).toEqual([{ a: 1 }]);
  });
  it('parsePagination applies defaults and caps limit', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10, offset: 0 });
    expect(parsePagination({ page: '3', limit: '5000' })).toEqual({ page: 3, limit: 100, offset: 200 });
    expect(parsePagination({ page: '-1', limit: 'abc' })).toEqual({ page: 1, limit: 10, offset: 0 });
  });
});

describe('requireRole / getAuthStatus', () => {
  it('403 for non-admin, next() for admin', async () => {
    const next = jest.fn();
    const res = mockRes();
    await requireRole('admin')({ user: other }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();

    const res2 = mockRes();
    await requireRole('admin')({ user: admin }, res2, next);
    expect(next).toHaveBeenCalled();
  });
  it('/api/auth returns 401 when logged out and hides provider/stripe ids', () => {
    const res = mockRes();
    getAuthStatus({ user: null }, res);
    expect(res.status).toHaveBeenCalledWith(401);

    const res2 = mockRes();
    getAuthStatus({
      user: {
        ...owner, provider_user_id: 'p', stripe_customer_id: 's', stripe_subscription_id: 't'
      }
    }, res2);
    const body = res2.json.mock.calls[0][0];
    expect(body.isAuthenticated).toBe(true);
    expect(body).not.toHaveProperty('provider_user_id');
    expect(body).not.toHaveProperty('stripe_customer_id');
    expect(body).not.toHaveProperty('stripe_subscription_id');
  });
});

describe('trip authorization middleware', () => {
  const trip = { uuid: 't1', owner_email: owner.email, shared_mode: 'private' };

  it('read: private trip denied to anonymous (401) and others (403)', async () => {
    getTripAccessDB.mockResolvedValue({ trip, access: null });
    const next = jest.fn();
    const res = mockRes();
    await requireTripReadAccess(fromBodyTripID)({ body: { tripID: 't1' }, user: null }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);

    const res2 = mockRes();
    await requireTripReadAccess(fromBodyTripID)({ body: { tripID: 't1' }, user: other }, res2, next);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('read: public trip allowed and flagged public; admin always allowed', async () => {
    getTripAccessDB.mockResolvedValue({ trip, access: 'public' });
    const req = { body: { tripID: 't1' }, user: null };
    const next = jest.fn();
    await requireTripReadAccess(fromBodyTripID)(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.tripAccess).toBe('public');

    getTripAccessDB.mockResolvedValue({ trip, access: null });
    const req2 = { body: { tripID: 't1' }, user: admin };
    await requireTripReadAccess(fromBodyTripID)(req2, mockRes(), next);
    expect(req2.tripAccess).toBe('admin');
  });

  it('write: only owner or admin', async () => {
    mockFirst.mockResolvedValue(trip);
    const next = jest.fn();
    const res = mockRes();
    await requireTripOwner(fromParamsUUID)({ params: { uuid: 't1' }, user: other }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);

    await requireTripOwner(fromParamsUUID)({ params: { uuid: 't1' }, user: owner }, mockRes(), next);
    await requireTripOwner(fromParamsUUID)({ params: { uuid: 't1' }, user: admin }, mockRes(), next);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('row owner check on tags/mileages', async () => {
    mockFirst.mockResolvedValue({ uuid: 'm1', owner_email: owner.email });
    const next = jest.fn();
    const res = mockRes();
    await requireRowOwnerEmail('mileages', (r) => r.body.data)({ body: { data: 'm1' }, user: other }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('forceOwnerEmail overrides a spoofed owner_email', () => {
    const req = { body: { data: { owner_email: 'victim@example.com' } }, user: owner };
    const next = jest.fn();
    forceOwnerEmail(req, mockRes(), next);
    expect(req.body.data.owner_email).toBe(owner.email);
    expect(next).toHaveBeenCalled();
  });
});
