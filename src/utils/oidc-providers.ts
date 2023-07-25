import config from "@app/config/config";

export const authLogin = async (email: string, password: string) => {
  const data = {
    email,
    password
  }

  const response = await fetch(`${config.backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) throw new Error("Login is failed");
  
  const responseLogin = await response.json();
  localStorage.setItem('profile', JSON.stringify(responseLogin.user));
  localStorage.setItem('token', responseLogin.tokens.access.token);
  
  return {
    profile: responseLogin.user,
    token: responseLogin.tokens.access.token,
  }
};

export const getLoginData = async () => {
  return new Promise((res, rej) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Error getting token data");
      }

      let profile = localStorage.getItem("profile");
      if (!profile) {
        throw new Error("Error getting profile data");
      }
      profile = JSON.parse(profile);
      
      return res({
        token,
        profile
      });
    } catch (error) {
      console.log(error);
      return rej(null);
    }
  });
};
