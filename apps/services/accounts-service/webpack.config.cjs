const DATABASE_RUNTIME = "@growblic/database/client";

module.exports = (options) => ({
  ...options,
  externals: (options.externals ?? []).map((external) => {
    if (typeof external !== "function") return external;
    return function growblicBackendExternal(context, callback) {
      if (context.request === DATABASE_RUNTIME) return callback();
      return external.call(this, context, callback);
    };
  }),
});
