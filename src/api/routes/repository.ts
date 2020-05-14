import { ResponseBody } from '@/api/types'
import axios from 'axios'
import routes from '@/api/routes'

export type RepositoryResponse = ResponseBody<Data>

export interface Data {
  data: Record<string, any>;
}

export const getRepositories = async (): Promise<RepositoryResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.login.path,
        method: routes.login.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}
