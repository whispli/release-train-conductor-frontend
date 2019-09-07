<template>
  <v-app>
    <v-content>
      <PrepareReleaseTrain v-if="show.PrepareReleaseTrain" />
      <DeployReleaseTrain v-if="show.DeployReleaseTrain" />
    </v-content>
  </v-app>
</template>

<script>
import PrepareReleaseTrain from './components/PrepareReleaseTrain';
import DeployReleaseTrain from './components/DeployReleaseTrain';

export default {
  name: 'App',
  components: {
    PrepareReleaseTrain,
    DeployReleaseTrain
  },
  data: () => ({
    show: {
      PrepareReleaseTrain: true,
      DeployReleaseTrain: false
    }
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
};
</script>
