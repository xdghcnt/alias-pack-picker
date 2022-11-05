<template>
  <PackTable/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PackTable from './components/PackTable.vue';

@Options({
  components: {
    PackTable,
  },
})
export default class App extends Vue {}
</script>

<style>
@import '~primeflex/primeflex.css';
@import '~primeflex/themes/arya-blue.scss';
html {
  background: #1e1e1e;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgba(255, 255, 255, 0.87);
  margin-top: 15px;
}
</style>
