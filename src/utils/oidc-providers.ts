import { sleep } from "./helpers";

export const authLogin = async (email: string, password: string) => {
  await sleep(500); // Simulate request
  return new Promise((res, rej) => {
    if (email !== "admin@example.com" || password !== "admin") {
      return rej({ message: "Credentials are wrong!" });
    }
    const authentication = { profile: { email: "admin@example.com" } };
    localStorage.setItem("authentication", JSON.stringify(authentication));
    return res(authentication);
  });
};

export const getAuthStatus = async () => {
  await sleep(500); // Simulate request
  return new Promise((res, rej) => {
    try {
      let authentication = localStorage.getItem("authentication");
      if (!authentication) {
        throw new Error("Error getting authentication data");
      }
      authentication = JSON.parse(authentication);
      return res(authentication);
    } catch (error) {
      console.log(error);
      return rej(null);
    }
  });
};
