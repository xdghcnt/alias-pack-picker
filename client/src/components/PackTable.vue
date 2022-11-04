<template>
  <table class="m-auto">
    <tr v-for="group in packGroups" :key="group.name"
        :class="{'opacity-30': group.disabled, 'line-through': group.disabled}">
      <td class="bg-gray-800" >
        {{group.name}}
        <span class="cursor-pointer" @click="group.disabled = !group.disabled">⌫</span>
      </td>
      <td v-for="item in group.items" :key="item" class="w-13rem"
          :class="{'opacity-30': item.disabled, 'line-through': item.disabled, 'bg-black-alpha-90': item.disabled}">
        {{item.name}}
        <span class="cursor-pointer" @click="item.disabled = !item.disabled">⌫</span></td>
    </tr>
  </table>
  <div v-if="!hafRemoved" @click="removeHalf" class="p-2 bg-bluegray-900 mt-3 m-auto cursor-pointer" style="display: table">-7</div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {packs} from "@/components/packs";

export default defineComponent({
  name: 'PackTable',
  components: {
  },

  setup() {
    function shuffle<T>(array: T[]): T[] {
      let currentIndex = array.length,  randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    }
    const packGroups = ref(packs);
    const hafRemoved = ref(false);
    const removeHalf = () => {
      const array = shuffle([...packGroups.value]).splice(0, 7);
      packGroups.value = packGroups.value.filter((it) => array.includes(it));
      hafRemoved.value = true;
    };
    return {
      packGroups,
      removeHalf,
      hafRemoved,
    }
  }
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  border: 1px solid rgba(128, 128, 128);
  color: var(--gray-100);
}
td {
  border-bottom: 1px solid rgba(128, 128, 128);
  padding: 0.5rem;
}
tr {
  background: var(--gray-700);
}
tr:nth-child(odd) {
  background: #393737;
}
tr:hover {
  background: var(--bluegray-900);
}
</style>
