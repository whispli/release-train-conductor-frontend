<template>
  <v-app>
    <v-content>
      <InitiateReleaseTrain v-if="show.initiateReleaseTrain" />
      <ReleaseReleaseTrain v-if="show.releaseReleaseTrain" />
    </v-content>
  </v-app>
</template>

<script>
import InitiateReleaseTrain from './components/InitiateReleaseTrain';
import ReleaseReleaseTrain from './components/ReleaseReleaseTrain';

export default {
  name: 'App',
  components: {
    InitiateReleaseTrain,
    ReleaseReleaseTrain
  },
  data: () => ({
    show: {
      initiateReleaseTrain: true,
      releaseReleaseTrain: false
    }
  }),
};
</script>
