import { ResponseBody } from '@/api/types'
import axios from 'axios'
import routes from '@/api/routes'

export type LoginResponse = ResponseBody<LoginData>
export type LogoutResponse = ResponseBody<LogoutData>

export interface LoginData {
  data: Record<string, any>;
}

export interface LogoutData {
  ok: string;
}

export const login = async (input: Record<string, any>): Promise<LoginResponse> => {
  try {
    const response = await axios.request(
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

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await axios(
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
