export const getTripsExample = (knex) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440001', // Fixed UUID for predictability
    title: 'Japan Vacation 2025',
    owner_email: 'test@tripborder.com',
    start_date: '2025-07-01',
    end_date: '2025-07-07',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
    shared_mode: 'private'
  }
];

export const getMealsExample = (tripsUUID) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440002', // Fixed UUID for predictability
    trips_uuid: tripsUUID,
    name: 'Dinner at Ichiran',
    address: '123 Japan, Japan',
    meal_time: '2025-07-02 19:00:00',
  }
];

export const getPOIsExample = (tripsUUID) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440003', // Fixed UUID for predictability
    trips_uuid: tripsUUID,
    name: 'Skytree',
    address: 'Asakusa, Japan',
  }
];

export const getHotelsExample = (tripsUUID) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440004', // Fixed UUID for predictability
    trips_uuid: tripsUUID,
    name: 'Hilton Osaka',
    address: '456 Avenue, Osaka',
    check_in: '2025-07-01',
    check_out: '2025-07-07',
    booking_reference: 'HIL123456',
  }
];

export const getTransportsExample = (tripsUUID) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440005',
    trips_uuid: tripsUUID,
    name: 'Flight to Japan',
    type: 'Flight',
    address: 'NRT Airport, Japan',
    provider: 'ANA',
    booking_reference: 'ANA789',
    departure_time: '2025-07-01 08:00:00',
    arrival_time: '2025-07-01 12:00:00',
    origin: 'TPE, Taiwan',
    destination: 'NRT, Japan',
  }
];

export const getTagsExample = () => [
  { uuid: '550e8400-e29b-41d4-a716-446655440006', name: 'city', owner_email: 'test@tripborder.com' },
  { uuid: '550e8400-e29b-41d4-a716-446655440007', name: 'culture', owner_email: 'test@tripborder.com' }
];

export const getTripTagsExample = (tripsUUID, tags) => [
  { trips_uuid: tripsUUID, tags_uuid: tags[0].uuid },
  { trips_uuid: tripsUUID, tags_uuid: tags[1].uuid },
];

export const getRatingsExample = (knex, tripsUUID, hotels) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440008',
    trips_uuid: tripsUUID,
    entity_id: hotels[0].uuid,
    entity_type: 'hotel',
    comment: 'Great stay, friendly staff!',
    score: 4,
    owner_email: 'test@tripborder.com',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  }
];

export const getTripSharesExample = (knex, tripsUUID) => [
  {
    uuid: '550e8400-e29b-41d4-a716-446655440009',
    trips_uuid: tripsUUID,
    shared_email: 'test@tripborder.com',
    shared_at: knex.fn.now(),
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  },
  {
    uuid: '550e8400-e29b-41d4-a716-446655440010',
    trips_uuid: tripsUUID,
    shared_email: 'test2@tripborder.com',
    shared_at: knex.fn.now(),
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  }
];
