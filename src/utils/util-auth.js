import jwtDecoder from "jwt-decode";
import router from "@/router/router";
const tokenValidator = (token) => {
    if (token) {
      console.log(`auth token : ${token}`);
      let decodedToken = jwtDecoder(token);
      console.log(`Received Token : ${JSON.stringify(decodedToken)}`);
  
      let expireAt = new Date(0);
      expireAt.setUTCSeconds(decodedToken.exp);
      console.log(`Will Expire At : ${expireAt}`);
  
      if (Date.now() < expireAt) {
        return token;
      } else new Error("Login");
    } else {
      new Error("Login");
    }
  };

export { tokenValidator };