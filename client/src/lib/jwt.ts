function ParseJWT(token: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  if (!base64Url) {
    return;
  }
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

export default ParseJWT;
