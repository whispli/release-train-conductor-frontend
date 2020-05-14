import { ResponseBody } from '@/api/types'
import axios from 'axios'
import routes from '@/api/routes'

export type ReleasePlanePullRequestsResponse = ResponseBody<ArrayData>
export type ReleasePlanePullRequestResponse = ResponseBody<Data>

export interface ArrayData {
  data: Array<Record<string, any>>;
}

export interface Data {
  data: Record<string, any>;
}

export const getReleasePlanePullRequests =
  async (repoSlug: string): Promise<ReleasePlanePullRequestsResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.getReleasePlanePullRequests.path(repoSlug),
        method: routes.getReleasePlanePullRequests.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}

export const createReleasePlanePullRequest =
  async (repoSlug: string): Promise<ReleasePlanePullRequestResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.createReleasePlanePullRequest.path(repoSlug),
        method: routes.getRepositories.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}

export const deployReleasePlanePullRequest =
  async (repoSlug: string, pullRequestId: string): Promise<ReleasePlanePullRequestResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.deployReleasePlanePullRequest.path(repoSlug, pullRequestId),
        method: routes.getRepositories.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}
