<template>
  <v-app>
    <v-content>
      <InitiateReleaseTrain/>
    </v-content>
  </v-app>
</template>

<script>
import InitiateReleaseTrain from './components/InitiateReleaseTrain';

export default {
  name: 'App',
  components: {
    InitiateReleaseTrain,
  },
  data: () => ({
    //
  }),
};
</script>
