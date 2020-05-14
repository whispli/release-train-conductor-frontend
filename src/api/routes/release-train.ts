import axios from 'axios'
import routes from '@/api/routes'

export interface ArrayData {
  data: ReleaseTrainPullRequest[]
}

export interface Data {
  data: ReleaseTrainPullRequest
}

interface ReleaseTrainPullRequest {
  author: Record<string, any>
  close_source_branch: boolean
  closed_by: Record<string, any> | null
  comment_count: number
  created_on: string
  description: string
  destination: Record<string, any>
  id: number
  links: Record<string, any>
  merge_commit: any
  reason: string
  source: Record<string, any>
  state: string
  summary: Record<string, any>
  task_count: number
  title: string
  type: string
  updated_on: string
}

export const getReleaseTrainPullRequests =
  async (jwt: string, repoSlug: string): Promise<ArrayData> => {
  try {
    const response = await axios.request<ArrayData>(
      {
        url: routes.getReleaseTrainPullRequests.path(repoSlug),
        method: routes.getReleaseTrainPullRequests.method,
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

export const createReleaseTrainPullRequest = async (jwt: string, repoSlug: string): Promise<Data> => {
  try {
    const response = await axios.request<Data>(
      {
        url: routes.createReleaseTrainPullRequest.path(repoSlug),
        method: routes.createReleaseTrainPullRequest.method,
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

export const deployReleaseTrainPullRequest =
  async (jwt: string, repoSlug: string, pullRequestId: string): Promise<Data> => {
  try {
    const response = await axios.request<Data>(
      {
        url: routes.deployReleaseTrainPullRequest.path(repoSlug, pullRequestId),
        method: routes.deployReleaseTrainPullRequest.method,
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
