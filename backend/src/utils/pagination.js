// PERBAIKAN #5a: pagination untuk endpoint publik
exports.getPagination = (req, defaultLimit = 12, maxLimit = 50) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  let limit = parseInt(req.query.limit, 10) || defaultLimit;
  limit = Math.min(Math.max(limit, 1), maxLimit);
  return { page, limit, offset: (page - 1) * limit };
};

exports.buildMeta = (count, page, limit) => ({
  total: count,
  page,
  limit,
  totalPages: Math.ceil(count / limit),
});
