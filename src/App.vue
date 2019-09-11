<template>
  <v-app>
    <loading :active.sync="show.isLoading"
             :can-cancel="false"></loading>
    <v-dialog
            v-model="show.deployReleaseTrainConfirmationDialog"
            max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Are you sure you want to do this?</v-card-title>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
                  color="green darken-1"
                  text
                  @click="() => { this.show.deployReleaseTrainConfirmationDialog = false }"
          >
            No
          </v-btn>

          <v-btn
                  color="green darken-1"
                  text
                  @click="() => {this.show.deployReleaseTrainConfirmationDialog = false; deployReleaseTrain() }"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-content>
      <v-container class="fill-height" fluid v-if="show.PrepareReleaseTrain">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn @click="prepareReleaseTrain()" x-large color="warning" >Prepare Release Train</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="fill-height" fluid v-if="show.DeployReleaseTrain">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn @click="() => {this.show.deployReleaseTrainConfirmationDialog = true}" x-large color="error">Deploy Release Train</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="fill-height" fluid v-if="show.PrepareReleasePlane">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn @click="prepareReleasePlane()" x-large color="success" >Prepare Release Plane</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="fill-height" fluid v-if="show.DeployReleasePlane">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn @click="deployReleasePlane()" x-large color="info">Deploy Release Plane</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'App',
  data: () => ({
    show: {
      PrepareReleaseTrain: true,
      DeployReleaseTrain: false,
      PrepareReleasePlane: false,
      DeployReleasePlane: false,
      DeployToOverseasTerminals: false,
      isLoading: false,
      deployReleaseTrainConfirmationDialog: false
    },
    apiBaseUri: 'http://127.0.0.1:3333/api/v1',
    repositories: [],
    repositoryPullRequests: {}
  }),
  components: {
    Loading
  },
  created () {
    this.$vuetify.theme.dark = true
  },
  async mounted() {
    this.show.isLoading = true
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
    getReleasePlanePullRequests: async (apiBaseUri, repoSlug) => {
      return axios.get(apiBaseUri + `/repositories/${repoSlug}/release-plane-pull-requests`)
    },
    createReleasePlanePullRequest: async (apiBaseUri, repoSlug) => {
      return axios.post(apiBaseUri + `/repositories/${repoSlug}/release-plane-pull-requests`)
    },
    deployReleasePlanePullRequest: async (apiBaseUri, repoSlug, pullRequestId) => {
      return axios.patch(apiBaseUri + `/repositories/${repoSlug}/release-plane-pull-requests/${pullRequestId}`)
    },
    checkForPullRequests: async function () {
      this.show.isLoading = true
      for (let repository of this.repositories) {
        const response = await this.getReleaseTrainPullRequests(this.apiBaseUri, repository.slug)

        if (response.data.data) {
          this.repositoryPullRequests[repository.slug] = response.data.data
        } else {
          delete this.repositoryPullRequests[repository.slug]
        }
      }

      if (Object.keys(this.repositoryPullRequests).length > 0) {
        this.showDeployReleaseTrain()
      } else {
        this.showPrepareReleaseTrain()
        await this.checkForReleasePlanePullRequests()
      }
      this.show.isLoading = false
    },
    checkForReleasePlanePullRequests: async function () {
      this.show.isLoading = true
      for (let repository of this.repositories) {
        const response = await this.getReleasePlanePullRequests(this.apiBaseUri, repository.slug)

        if (response.data.data) {
          this.repositoryPullRequests[repository.slug] = response.data.data
        } else {
          delete this.repositoryPullRequests[repository.slug]
        }
      }

      if (Object.keys(this.repositoryPullRequests).length > 0) {
        this.showDeployReleasePlane()
      } else {
        this.showPrepareReleaseTrain()
      }
      this.show.isLoading = false
    },
    prepareReleaseTrain: async function () {
      let createdPullRequest = false

      this.show.isLoading = true
      for (let repository of this.repositories) {
        try {
          await this.createReleaseTrainPullRequest(this.apiBaseUri, repository.slug)
          createdPullRequest = true
        } catch (err) {
          // Just ignore if the PR could not be created.
          // TODO: Read the payload and check that it failed because there were no changes to be pulled
        }
      }

      if (!createdPullRequest) {
        this.showPrepareReleasePlane()
        this.show.isLoading = false
        return;
      }

      await this.checkForPullRequests()
      this.show.isLoading = false
    },
    deployReleaseTrain: function () {
      this.show.isLoading = true
      const promises = []

      for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
        for (let i=0; i < this.repositoryPullRequests[repoSlug].length; i++) {
          promises.push(this.deployReleaseTrainPullRequest(this.apiBaseUri, repoSlug, this.repositoryPullRequests[repoSlug][i].id))
        }
      }

      Promise.all(promises).then(() => {
        this.showPrepareReleaseTrain()
        this.show.isLoading = false
      })
    },
    prepareReleasePlane: async function () {
      this.show.isLoading = true
      for (let repository of this.repositories) {
        try {
          await this.createReleasePlanePullRequest(this.apiBaseUri, repository.slug)
        } catch (err) {
          // Just ignore if the PR could not be created.
          // TODO: Read the payload and check that it failed because there were no changes to be pulled
        }
      }

      await this.checkForReleasePlanePullRequests()
      this.show.isLoading = false
    },
    deployReleasePlane: function () {
      this.show.isLoading = true
      const promises = []

      for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
        for (let i=0; i < this.repositoryPullRequests[repoSlug].length; i++) {
          promises.push(this.deployReleasePlanePullRequest(this.apiBaseUri, repoSlug, this.repositoryPullRequests[repoSlug][i].id))
        }
      }

      Promise.all(promises).then(() => {
        this.showPrepareReleaseTrain()
        this.show.isLoading = false
      })
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
    },
    showPrepareReleasePlane: function () {
      this.hideAll()
      this.show.PrepareReleasePlane = true
    },
    showDeployReleasePlane: function () {
      this.hideAll()
      this.show.DeployReleasePlane = true
    },
  }
}
</script>
