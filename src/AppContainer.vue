<template>
  <VApp>
    <VContent>
      <div class="h-full">
        <RouterView />
      </div>
    </VContent>
  </VApp>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ })
export default class AppContainer extends Vue {
}
</script>
