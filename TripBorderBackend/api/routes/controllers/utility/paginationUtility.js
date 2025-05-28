export const getPaginationLimit = (req, _res) => req.query.limit || 10;

export const getPaginationOffset = (req, _res) => {
  const limit = getPaginationLimit(req);
  const { page } = req.query || 1;
  const offset = (page - 1) * limit;

  return offset;
};
