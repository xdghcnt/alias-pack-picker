<template>
  <div id="coin" :class="coinClass" @click="flipCoin">
    <div class="side-a"></div>
    <div class="side-b"></div>
  </div>
  <table class="m-auto">
    <tr v-for="group in packGroups" :key="group.name"
        :class="{'opacity-30': group.disabled, 'line-through': group.disabled}">
      <td class="bg-gray-800" >
        {{group.name}}
        <span class="cursor-pointer" @click="group.disabled = !group.disabled">⌫</span>
      </td>
      <td v-for="item in group.items" :key="item" class="w-13rem"
          :class="{'opacity-30': item.disabled, 'line-through': item.disabled,
          'bg-black-alpha-90': item.disabled, 'bg-teal-800': pickedItems.includes(item) }">
        <div v-if="pickedItems.includes(item)" class="circle">
          {{pickedItems.indexOf(item) + 1}}
        </div>
        {{item.name}}
        <span class="cursor-pointer" @click="item.disabled = !item.disabled">⌫</span>&nbsp;
        <span class="cursor-pointer" @click="pickItem(item)">☆</span>
      </td>
    </tr>
  </table>
  <div v-if="!hafRemoved" @click="removeHalf" class="p-2 bg-bluegray-900 mt-3 m-auto cursor-pointer" style="display: table">-7</div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {Item, packs} from "@/components/packs";

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
    const coinClass = ref('');
    const pickedItems = ref<Item[]>([]);
    const pickItem = (item: Item) => {
      if (!pickedItems.value.includes(item))
        pickedItems.value.push(item);
      else
        pickedItems.value.splice(pickedItems.value.indexOf(item), 1);
    };
    const flipCoin = async () => {
      coinClass.value = '';
      setTimeout(() => {
        coinClass.value = Math.random() <= 0.5 ? 'heads' : 'tails';
      }, 100);
    };
    return {
      packGroups,
      removeHalf,
      hafRemoved,
      flipCoin,
      coinClass,
      pickItem,
      pickedItems,
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
body {
  padding-top: 50px;
  background: #F7F7F7;
  -webkit-perspective: 800px;
}
h1{
  text-align: center;
}
#coin {
  position: relative;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  cursor: pointer;
}
#coin div {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  -webkit-box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
  -moz-box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
  box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
}
.side-a {
  background: url(coin-r.png);
}
.side-b {
  background: url(coin-a.png);
}

#coin {
  transition: -webkit-transform 1s ease-in;
  -webkit-transform-style: preserve-3d;
  position: absolute;
  left: 23px;
  top: 23px;
}
#coin div {
  position: absolute;
  -webkit-backface-visibility: hidden;
  background-size: contain;
}
.side-a {
  z-index: 100;
}
.side-b {
  -webkit-transform: rotateY(-180deg);
}
#coin.heads {
  -webkit-animation: flipHeads 3s ease-out forwards;
  -moz-animation: flipHeads 3s ease-out forwards;
  -o-animation: flipHeads 3s ease-out forwards;
  animation: flipHeads 3s ease-out forwards;
}
#coin.tails {
  -webkit-animation: flipTails 3s ease-out forwards;
  -moz-animation: flipTails 3s ease-out forwards;
  -o-animation: flipTails 3s ease-out forwards;
  animation: flipTails 3s ease-out forwards;
}

@-webkit-keyframes flipHeads {
  from { -webkit-transform: rotateY(0); -moz-transform: rotateY(0); transform: rotateY(0); }
  to { -webkit-transform: rotateY(1800deg); -moz-transform: rotateY(1800deg); transform: rotateY(1800deg); }
}
@-webkit-keyframes flipTails {
  from { -webkit-transform: rotateY(0); -moz-transform: rotateY(0); transform: rotateY(0); }
  to { -webkit-transform: rotateY(1980deg); -moz-transform: rotateY(1980deg); transform: rotateY(1980deg); }
}

.circle {
  display: inline-block;
  background: var(--red-700);
  border-radius: 50%;
  text-align: center;
  width: 21px;
  line-height: 20px;
}
</style>
