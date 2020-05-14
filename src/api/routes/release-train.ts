import { ResponseBody } from '@/api/types'
import axios from 'axios'
import routes from '@/api/routes'

export type ReleaseTrainPullRequestsResponse = ResponseBody<ArrayData>
export type ReleaseTrainPullRequestResponse = ResponseBody<Data>

export interface ArrayData {
  data: Array<Record<string, any>>;
}

export interface Data {
  data: Record<string, any>;
}

export const getReleaseTrainPullRequests =
  async (repoSlug: string): Promise<ReleaseTrainPullRequestsResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.getReleaseTrainPullRequests.path(repoSlug),
        method: routes.getReleaseTrainPullRequests.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}

export const createReleaseTrainPullRequest =
  async (repoSlug: string): Promise<ReleaseTrainPullRequestResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.createReleaseTrainPullRequest.path(repoSlug),
        method: routes.getRepositories.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}

export const deployReleaseTrainPullRequest =
  async (repoSlug: string, pullRequestId: string): Promise<ReleaseTrainPullRequestResponse> => {
  try {
    const response = await axios.request(
      {
        url: routes.deployReleaseTrainPullRequest.path(repoSlug, pullRequestId),
        method: routes.getRepositories.method,
      },
    )

    return response.data
  } catch (err) {
    throw err
  }
}
