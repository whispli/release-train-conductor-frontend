<template>
  <VContainer>
    <VRow
      class="fill-height"
      align="center"
      justify="center">
      <div :style="{ width: '450px' }" class="text-left">
        <VCard
          width="450"
          flat
          class="py-2 px-0">
          <VCardText>
            <VCardTitle class="justify-center font-weight-bold headline">
              Login
            </VCardTitle>
            <VCardText class="text-center">
              <VTextField
                v-model="email"
                :rules="rules"
                label="Email"
                autocomplete="off"
                @keyup.enter="onSubmit"/>
              <VTextField
                v-model="password"
                :rules="rules"
                autocomplete="new-password"
                label="Password"
                type="password"
                @keyup.enter="onSubmit"/>
              <VBtn
                :disabled="isPending"
                :loading="isPending"
                color="info"
                depressed
                x-large
                @click="onSubmit">
                Login
              </VBtn>
            </VCardText>
          </VCardText>
        </VCard>
      </div>
    </VRow>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { login, logout } from '@/api/routes/auth'

@Component({ })
export default class Login extends Vue {
  private isPending: boolean = false
  private email: string | null = null
  private password: string | null = null

  private readonly rules = [
    (value: string) => !!value || 'Required.',
  ]

  async onSubmit() {
    if (!this.email || !this.password || this.isPending) {
      return
    }

    this.isPending = true

    try {
      const { data } = await login({ email: this.email, password: this.password })
      const token = data.token
      this.$store.dispatch('setUser', { email: this.email, token })
      this.$router.push('deploy')
    } catch (err) {
      return
    } finally {
      this.isPending = false
    }
  }
}
</script>
