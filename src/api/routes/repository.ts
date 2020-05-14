import { ResponseBody } from '@/api/types'
import axios from 'axios'
import routes from '@/api/routes'

export type RepositoryResponse = ResponseBody<Data>

export interface Data {
  data: Array<Record<string, any>>;
}

export const getRepositories = async (): Promise<RepositoryResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.getRepositories.path,
        method: routes.getRepositories.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}
