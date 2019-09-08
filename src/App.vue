<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid v-if="show.PrepareReleaseTrain">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn @click="prepareReleaseTrain()">Prepare Release Train</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="fill-height" fluid v-if="show.DeployReleaseTrain">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn @click="deployReleaseTrain()">Deploy Release Train</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="fill-height" fluid v-if="show.DeployToOverseasTerminals">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn>Deploy to Overseas Terminals</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data: () => ({
    show: {
      PrepareReleaseTrain: true,
      DeployReleaseTrain: false,
      DeployToOverseasTerminals: false
    },
    apiBaseUri: 'http://127.0.0.1:3333/api/v1',
    repositories: [],
    repositoryPullRequests: {}
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
  async mounted() {
    const response = await this.getRepositories(this.apiBaseUri)
    this.repositories = response.data.data

    this.checkForPullRequests()
  },
  methods: {
    getRepositories: async (apiBaseUri) => {
      return axios.get(apiBaseUri + '/repositories')
    },
    getReleaseTrainPullRequests: async (apiBaseUri, repoSlug) => {
      return axios.get(apiBaseUri + `/repositories/${repoSlug}/release-train-pull-requests`)
    },
    createReleaseTrainPullRequest: async (apiBaseUri, repoSlug) => {
      return axios.post(apiBaseUri + `/repositories/${repoSlug}/release-train-pull-requests`)
    },
    deployReleaseTrainPullRequest: async (apiBaseUri, repoSlug, pullRequestId) => {
      return axios.patch(apiBaseUri + `/repositories/${repoSlug}/release-train-pull-requests/${pullRequestId}`)
    },
    checkForPullRequests: async function () {
      for (let repository of this.repositories) {
        const response = await this.getReleaseTrainPullRequests(this.apiBaseUri, repository.slug)

        if (response.data.data) {
          this.repositoryPullRequests[repository.slug] = response.data.data
        }
      }

      if (Object.keys(this.repositoryPullRequests).length > 0) {
        this.showDeployReleaseTrain()
      } else {
        this.showPrepareReleaseTrain()
      }
    },
    prepareReleaseTrain: async function () {
      for (let repository of this.repositories) {
        try {
          await this.createReleaseTrainPullRequest(this.apiBaseUri, repository.slug)
        } catch (err) {
          // Just ignore if the PR could not be created.
          // TODO: Read the payload and check that it failed because there were no changes to be pulled
        }
      }

      this.checkForPullRequests()
    },
    deployReleaseTrain: function () {
      if (!confirm('Are you sure you want to deploy the release train?')) {
        return;
      }

      const promises = []

      for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
        for (let i=0; i < this.repositoryPullRequests[repoSlug].length; i++) {
          promises.push(this.deployReleaseTrainPullRequest(this.apiBaseUri, repoSlug, this.repositoryPullRequests[repoSlug][i].id))
        }
      }

      Promise.all(promises).then(() => {
        this.showPrepareReleaseTrain()
      });
    },
    hideAll: function () {
      for (let componentName of Object.keys(this.show)) {
        this.show[componentName] = false
      }
    },
    showPrepareReleaseTrain: function () {
      this.hideAll()
      this.show.PrepareReleaseTrain = true
    },
    showDeployReleaseTrain: function () {
      this.hideAll()
      this.show.DeployReleaseTrain = true
    }
  }
};
</script>
