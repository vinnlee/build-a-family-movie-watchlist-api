// Parents may modify any watchlist
// Children may only modify their own

export function authorizeModification(req, res, next) {
  const user = req.user;

  if (user && user.role === "parent") return next();

  if (
    user &&
    user.role === "child" &&
    String(req.params.userId) === String(user.id)
  ) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}