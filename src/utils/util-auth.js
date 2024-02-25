import jwtDecoder from "jwt-decode";

const tokenValidator = (token) => {
    if (token) {
      let decodedToken = jwtDecoder(token);
      let expireAt = new Date(0);
      expireAt.setUTCSeconds(decodedToken.exp);
      if (Date.now() < expireAt) {
        return token;
      } else {
        alert("세션이 만료되었습니다.");
        throw "Login";
      }
    } else {
      throw "Login";
    }
  };

export { tokenValidator };