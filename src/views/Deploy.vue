<template>
  <VApp>
    <Loading :active.sync="show.isLoading" :can-cancel="false" />
    <VDialog
      v-model="show.deployReleaseTrainConfirmationDialog"
      max-width="290">
      <VCard>
        <VCardTitle class="headline">
          Are you sure you want to do this?
        </VCardTitle>

        <VCardActions>
          <div class="flex-grow-1" />

          <VBtn
            color="green darken-1"
            text
            @click="show.deployReleaseTrainConfirmationDialog = false">
            No
          </VBtn>

          <VBtn
            color="green darken-1"
            text
            @click="deployReleaseTrain">
            Yes
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VContent>
      <VContainer
        v-if="show.prepareReleaseTrain"
        class="fill-height"
        fluid>
        <VRow>
          <VCol cols="12">
            <div class="text-center">
              <VBtn
                color="warning"
                x-large
                @click="prepareReleaseTrain">
                Prepare Release Train
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VContainer>
      <VContainer
        v-if="show.deployReleaseTrain"
        class="fill-height"
        fluid>
        <VRow>
          <VCol cols="12">
            <div class="text-center">
              <VBtn
                color="error"
                x-large
                @click="show.deployReleaseTrainConfirmationDialog = true">
                Deploy Release Train
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VContainer>
      <VContainer
        v-if="show.prepareReleasePlane"
        class="fill-height"
        fluid>
        <VRow>
          <VCol cols="12">
            <div class="text-center">
              <VBtn
                color="success"
                x-large
                @click="prepareReleasePlane">
                Prepare Release Plane
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VContainer>
      <VContainer
        v-if="show.deployReleasePlane"
        class="fill-height"
        fluid>
        <VRow>
          <VCol cols="12">
            <div class="text-center">
              <VBtn
                color="info"
                x-large
                @click="deployReleasePlane">
                Deploy Release Plane
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VContent>
  </VApp>
</template>

<script>
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'Deploy',
  components: { Loading },
  data: () => ({
    show: {
      prepareReleaseTrain: true,
      deployReleaseTrain: false,
      prepareReleasePlane: false,
      deployReleasePlane: false,
      DeployToOverseasTerminals: false,
      isLoading: false,
      deployReleaseTrainConfirmationDialog: false,
    },
    apiBaseUri: 'http://127.0.0.1:3333/api/v1',
    repositories: [],
    repositoryPullRequests: {},
  }),
  async mounted() {
    this.show.isLoading = true
    const response = await this.getRepositories(this.apiBaseUri)
    this.repositories = response.data.data

    this.checkForPullRequests()
  },
  methods: {
    async getRepositories (apiBaseUri) {
      return axios.get(apiBaseUri + '/repositories')
    },
    async getReleaseTrainPullRequests (apiBaseUri, repoSlug) {
      return axios.get(
        apiBaseUri + `/repositories/${repoSlug}/release-train-pull-requests`,
      )
    },
    async createReleaseTrainPullRequest (apiBaseUri, repoSlug) {
      return axios.post(
        apiBaseUri + `/repositories/${repoSlug}/release-train-pull-requests`,
      )
    },
    async deployReleaseTrainPullRequest (
      apiBaseUri,
      repoSlug,
      pullRequestId,
    ) {
      return axios.patch(
        apiBaseUri +
          `/repositories/${repoSlug}/release-train-pull-requests/${pullRequestId}`,
      )
    },
    async getReleasePlanePullRequests (apiBaseUri, repoSlug) {
      return axios.get(
        apiBaseUri + `/repositories/${repoSlug}/release-plane-pull-requests`,
      )
    },
    async createReleasePlanePullRequest (apiBaseUri, repoSlug) {
      return axios.post(
        apiBaseUri + `/repositories/${repoSlug}/release-plane-pull-requests`,
      )
    },
    async deployReleasePlanePullRequest (
      apiBaseUri,
      repoSlug,
      pullRequestId,
    ) {
      return axios.patch(
        apiBaseUri +
          `/repositories/${repoSlug}/release-plane-pull-requests/${pullRequestId}`,
      )
    },
    async checkForPullRequests() {
      this.show.isLoading = true
      for (let repository of this.repositories) {
        const response = await this.getReleaseTrainPullRequests(
          this.apiBaseUri,
          repository.slug,
        )

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
    async checkForReleasePlanePullRequests() {
      this.show.isLoading = true
      for (let repository of this.repositories) {
        const response = await this.getReleasePlanePullRequests(
          this.apiBaseUri,
          repository.slug,
        )

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
    async prepareReleaseTrain() {
      let createdPullRequest = false

      this.show.isLoading = true
      for (let repository of this.repositories) {
        try {
          await this.createReleaseTrainPullRequest(
            this.apiBaseUri,
            repository.slug,
          )
          createdPullRequest = true
        } catch (err) {
          // Just ignore if the PR could not be created.
          // TODO: Read the payload and check that it failed because there were no changes to be pulled
        }
      }

      if (!createdPullRequest) {
        this.showPrepareReleasePlane()
        this.show.isLoading = false
        return
      }

      await this.checkForPullRequests()
      this.show.isLoading = false
    },
    deployReleaseTrain() {
      this.show.deployReleaseTrainConfirmationDialog = false
      this.show.isLoading = true
      const promises = []

      for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
        for (let i = 0; i < this.repositoryPullRequests[repoSlug].length; i++) {
          promises.push(
            this.deployReleaseTrainPullRequest(
              this.apiBaseUri,
              repoSlug,
              this.repositoryPullRequests[repoSlug][i].id,
            ),
          )
        }
      }

      Promise.all(promises).then(() => {
        this.showPrepareReleaseTrain()
        this.show.isLoading = false
      })
    },
    async prepareReleasePlane() {
      this.show.isLoading = true
      for (let repository of this.repositories) {
        try {
          await this.createReleasePlanePullRequest(
            this.apiBaseUri,
            repository.slug,
          )
        } catch (err) {
          // Just ignore if the PR could not be created.
          // TODO: Read the payload and check that it failed because there were no changes to be pulled
        }
      }

      await this.checkForReleasePlanePullRequests()
      this.show.isLoading = false
    },
    deployReleasePlane: function() {
      this.show.isLoading = true
      const promises = []

      for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
        for (let i = 0; i < this.repositoryPullRequests[repoSlug].length; i++) {
          promises.push(
            this.deployReleasePlanePullRequest(
              this.apiBaseUri,
              repoSlug,
              this.repositoryPullRequests[repoSlug][i].id,
            ),
          )
        }
      }

      Promise.all(promises).then(() => {
        this.showPrepareReleaseTrain()
        this.show.isLoading = false
      })
    },
    hideAll() {
      for (let componentName of Object.keys(this.show)) {
        this.show[componentName] = false
      }
    },
    showPrepareReleaseTrain() {
      this.hideAll()
      this.show.prepareReleaseTrain = true
    },
    showDeployReleaseTrain() {
      this.hideAll()
      this.show.deployReleaseTrain = true
    },
    showPrepareReleasePlane() {
      this.hideAll()
      this.show.prepareReleasePlane = true
    },
    showDeployReleasePlane() {
      this.hideAll()
      this.show.deployReleasePlane = true
    },
  },
}
</script>
