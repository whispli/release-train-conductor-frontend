import axios from 'axios'
import routes from '@/api/routes'

export interface Data {
  data: Repository[]
}

interface Repository {
    created_on: string
    description: string
    fork_policy: string
    full_name: string
    has_issues: boolean
    has_wiki: boolean
    is_private: boolean
    language: string
    links: Record<string, any>
    mainbranch: Record<string, any>
    name: string
    owner: Record<string, any>
    project: Record<string, any>
    scm: string
    size: number
    slug: string
    type: string
    updated_on: string
    uuid: string
    website: string | null
    workspace: Record<string, any>
}

export const getRepositories = async (jwt: string): Promise<Data> => {
  try {
    const response = await axios.request(
      {
        url: routes.getRepositories.path,
        method: routes.getRepositories.method,
        headers: {
          Authorization: 'Bearer ' + jwt,
        },
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}
