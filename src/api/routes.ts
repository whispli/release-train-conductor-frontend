import { toPath } from './utils'
import { Route, RouteWithParams } from './types/routes'

/**
 * @see Http\Auth\RegisterController@login
 */
const login: Route = {
  type: 'LoginPayload',
  method: 'POST',
  path: toPath('/login'),
}

/**
 * @see Http\Auth\RegisterController@logout
 */
const logout: Route = {
  type: 'LogoutPayload',
  method: 'POST',
  path: toPath('/logout'),
}

/**
 * @see Http\RepositoryController@index
 */
const getRepositories: Route = {
  type: 'RepositoryPayload',
  method: 'GET',
  path: toPath('/repositories'),
}

/**
 * @see Http\ReleaseTrainPullRequestController@index
 */
const getReleaseTrainPullRequests: RouteWithParams = {
  type: 'ReleaseTrainPullRequestPayload',
  method: 'GET',
  path: (repoSlug: string) => {
    return toPath(`/repositories/${repoSlug}/release-train-pull-requests`)
  },
}

/**
 * @see Http\ReleaseTrainPullRequestController@store
 */
const createReleaseTrainPullRequest: RouteWithParams = {
  type: 'ReleaseTrainPullRequestPayload',
  method: 'POST',
  path: (repoSlug: string) => {
    return toPath(`/repositories/${repoSlug}/release-train-pull-requests`)
  },
}

/**
 * @see Http\ReleaseTrainPullRequestController@update
 */
const deployReleaseTrainPullRequest: RouteWithParams = {
  type: 'ReleaseTrainPullRequestPayload',
  method: 'PATCH',
  path: (repoSlug: string, pullRequestId: string) => {
    return toPath(`/repositories/${repoSlug}/release-train-pull-requests/${pullRequestId}`)
  },
}

/**
 * @see Http\ReleasePlanePullRequestController@index
 */
const getReleasePlanePullRequests: RouteWithParams = {
  type: 'ReleasePlanePullRequestPayload',
  method: 'GET',
  path: (repoSlug: string) => {
    return toPath(`/repositories/${repoSlug}/release-plane-pull-requests`)
  },
}

/**
 * @see Http\ReleasePlanePullRequestController@store
 */
const createReleasePlanePullRequest: RouteWithParams = {
  type: 'ReleasePlanePullRequestPayload',
  method: 'POST',
  path: (repoSlug: string) => {
    return toPath(`/repositories/${repoSlug}/release-plane-pull-requests`)
  },
}

/**
 * @see Http\ReleasePlanePullRequestController@update
 */
const deployReleasePlanePullRequest: RouteWithParams = {
  type: 'ReleasePlanePullRequestPayload',
  method: 'PATCH',
  path: (repoSlug: string, pullRequestId: string) => {
    return toPath(`/repositories/${repoSlug}/release-plane-pull-requests/${pullRequestId}`)
  },
}


export const routes = {
  login,
  logout,

  getRepositories,

  getReleaseTrainPullRequests,
  createReleaseTrainPullRequest,
  deployReleaseTrainPullRequest,

  getReleasePlanePullRequests,
  createReleasePlanePullRequest,
  deployReleasePlanePullRequest,
}

export default routes
