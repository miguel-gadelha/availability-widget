import { decode } from "jsonwebtoken";
import Cookies from "js-cookie";

export default class TeamUtils {
  public static getCurrentTeam() {
    try {
      const jwt = Cookies.get("auth");

      // TODO: token not availlable here

      if (!jwt) {
        return null;
      }

      return decode(jwt);
    } catch (error) {
      throw new Error("Something went wrong decoding the jwt token:" + error);
    }
  }
}
