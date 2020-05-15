import axios from 'axios'
import routes from '@/api/routes'

export interface LoginData {
  data: {
    message: string,
    token: string,
    type: string,
  };
}

export interface LogoutData {
  ok: string;
}

export const login = async (input: Record<string, any>): Promise<LoginData> => {
  try {
    const response = await axios.request<LoginData>(
      {
        url: routes.login.path,
        method: routes.login.method,
        data: {
          email: input.email,
          password: input.password,
        },
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}

export const logout = async (): Promise<LogoutData> => {
  try {
    const response = await axios.request<LogoutData>(
      {
        url: routes.logout.path,
        method: routes.logout.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}
