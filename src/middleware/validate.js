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
          message: issue.message
        })));
      } else {
        req[source] = result.data;
      }
    }
    if (errors.length) return res.status(400).json({ success: false, message: 'Request validation failed', errors });
    return next();
  };
}
