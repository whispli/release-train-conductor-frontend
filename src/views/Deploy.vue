<template>
  <VApp>
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
            :disabled="isLoading"
            :loading="isLoading"
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
                :disabled="isLoading"
                :loading="isLoading"
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
                :disabled="isLoading"
                :loading="isLoading"
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
                :disabled="isLoading"
                :loading="isLoading"
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
                :disabled="isLoading"
                :loading="isLoading"
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

import { getRepositories } from '@/api/routes/repository'
import {
  getReleaseTrainPullRequests,
  createReleaseTrainPullRequest,
  deployReleaseTrainPullRequest,
} from '@/api/routes/release-train'
import {
  getReleasePlanePullRequests,
  createReleasePlanePullRequest,
  deployReleasePlanePullRequest,
} from '@/api/routes/release-plane'
import { User } from '@/types'

@Component({ })
export default class Deploy extends Vue {
  @State private readonly user!: User

private repositories: any[] = []
  private repositoryPullRequests: Record<string, any> = {}
  private show: Record<string, boolean> = {
    prepareReleaseTrain: true,
    deployReleaseTrain: false,
    prepareReleasePlane: false,
    deployReleasePlane: false,
    DeployToOverseasTerminals: false,
    isLoading: false,
    deployReleaseTrainConfirmationDialog: false,
  }

  private async mounted() {
    this.show.isLoading = true
    const response = await getRepositories(this.user.token)
    this.repositories = response.data

    this.checkForPullRequests()
  }

  private async checkForPullRequests() {
    this.show.isLoading = true
    for (let repository of this.repositories) {
      const response = await getReleaseTrainPullRequests(
        this.user.token,
        repository.slug,
      )

      if (response.data) {
        this.repositoryPullRequests[repository.slug] = response.data
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
  }

  private async checkForReleasePlanePullRequests() {
    this.show.isLoading = true
    for (let repository of this.repositories) {
      const response = await getReleasePlanePullRequests(
        this.user.token,
        repository.slug,
      )

      if (response.data) {
        this.repositoryPullRequests[repository.slug] = response.data
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
  }

  private async prepareReleaseTrain() {
    let createdPullRequest = false

    this.show.isLoading = true
    for (let repository of this.repositories) {
      try {
        await createReleaseTrainPullRequest(
          this.user.token,
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
  }

  private deployReleaseTrain() {
    this.show.deployReleaseTrainConfirmationDialog = false
    this.show.isLoading = true
    const promises = []

    for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
      for (let i = 0; i < this.repositoryPullRequests[repoSlug].length; i++) {
        promises.push(
          deployReleaseTrainPullRequest(
            this.user.token,
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
  }

  private async prepareReleasePlane() {
    this.show.isLoading = true
    for (let repository of this.repositories) {
      try {
        await createReleasePlanePullRequest(
          this.user.token,
          repository.slug,
        )
      } catch (err) {
        // Just ignore if the PR could not be created.
        // TODO: Read the payload and check that it failed because there were no changes to be pulled
      }
    }

    await this.checkForReleasePlanePullRequests()
    this.show.isLoading = false
  }

  private deployReleasePlane() {
    this.show.isLoading = true
    const promises = []

    for (let repoSlug of Object.keys(this.repositoryPullRequests)) {
      for (let i = 0; i < this.repositoryPullRequests[repoSlug].length; i++) {
        promises.push(
          deployReleasePlanePullRequest(
            this.user.token,
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
  }

  private hideAll() {
    for (let componentName of Object.keys(this.show)) {
      this.show[componentName] = false
    }
  }

  private showPrepareReleaseTrain() {
    this.hideAll()
    this.show.prepareReleaseTrain = true
  }

  private showDeployReleaseTrain() {
    this.hideAll()
    this.show.deployReleaseTrain = true
  }

  private showPrepareReleasePlane() {
    this.hideAll()
    this.show.prepareReleasePlane = true
  }

  private showDeployReleasePlane() {
    this.hideAll()
    this.show.deployReleasePlane = true
  }
}
</script>
