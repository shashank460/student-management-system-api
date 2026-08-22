function replaceRequestValue(req, source, value) {
  if (source !== 'query') {
    req[source] = value;
    return;
  }
  for (const key of Object.keys(req.query)) delete req.query[key];
  Object.assign(req.query, value);
}

export function validate({ body, params, query } = {}) {
  return (req, res, next) => {
    const errors = [];
    for (const [source, schema] of Object.entries({ body, params, query })) {
      if (!schema) continue;
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        errors.push(...result.error.issues.map((issue) => ({
          source,
          path: issue.path.join('.'),
          code: issue.code,
          message: issue.message
        })));
      } else {
        replaceRequestValue(req, source, result.data);
      }
    }
    if (errors.length) {
      return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'Request validation failed', errors });
    }
    return next();
  };
}
