import axios from 'axios'
import routes from '@/api/routes'

export interface ArrayData {
  data: ReleasePlanePullRequest[]
}

export interface Data {
  data: ReleasePlanePullRequest
}

interface ReleasePlanePullRequest {
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

export const getReleasePlanePullRequests =
  async (jwt: string, repoSlug: string): Promise<ArrayData> => {
  try {
    const response = await axios.request(
      {
        url: routes.getReleasePlanePullRequests.path(repoSlug),
        method: routes.getReleasePlanePullRequests.method,
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

export const createReleasePlanePullRequest =
  async (jwt: string, repoSlug: string): Promise<Data> => {
  try {
    const response = await axios.request(
      {
        url: routes.createReleasePlanePullRequest.path(repoSlug),
        method: routes.createReleasePlanePullRequest.method,
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

export const deployReleasePlanePullRequest =
  async (jwt: string, repoSlug: string, pullRequestId: string): Promise<Data> => {
  try {
    const response = await axios.request(
      {
        url: routes.deployReleasePlanePullRequest.path(repoSlug, pullRequestId),
        method: routes.deployReleasePlanePullRequest.method,
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
