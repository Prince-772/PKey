export function setCookies(res, data) {
  res.cookies.set("jwtToken", data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 60 * 60 * 24,  // 1 day
  });
}
export function clearCookies(res) {
  res.cookies.delete("jwtToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:"none",
  });
}