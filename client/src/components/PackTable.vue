<template>
  <div id="coin" :class="coinClass">
    <div class="side-a"></div>
    <div class="side-b"></div>
  </div>
  <div class="text-center mb-3">
    {{messageInd + 1}}) {{messages[messageInd]}}
    <span v-if="messageInd === 1">
      <span class="px-2 bg-bluegray-900 cursor-pointer" @click="pickCoin('tails')">Орёл</span>&nbsp;
      <span class="px-2 bg-bluegray-900 cursor-pointer" @click="pickCoin('heads')">Решка</span>
    </span>
  </div>
  <table class="m-auto">
    <tr v-for="group in packGroups" :key="group.name"
        :class="{'opacity-30': group.disabled, 'line-through': group.disabled}">
      <td class="bg-gray-800" >
        {{group.name}}
        <span v-if="!group.picked && !group.disabled && [3,4,11,12].includes(messageInd)" class="cursor-pointer" @click="banGroup(group); messageInd++;">⌫&nbsp;</span>
        <span v-if="!group.picked && !group.disabled && [5,8].includes(messageInd)" class="cursor-pointer" @click="pickGroup(group); messageInd++">☆</span>
      </td>
      <td v-for="item in group.items" :key="item" class="w-13rem"
          :class="{'opacity-30': item.disabled, 'line-through': item.disabled, 'bg-teal-800': group.picked,
          'bg-black-alpha-90': item.disabled }">
        <div v-if="pickedItems.includes(item)" class="circle">
          {{pickedItems.indexOf(item) + 1}}
        </div>
        {{item.name}}
        <span v-if="group.picked && !pickedItems.includes(item)" class="cursor-pointer" @click="banItem(group, item); messageInd++">⌫</span>
      </td>
    </tr>
  </table>
  <div v-if="!hafRemoved" @click="removeHalf" class="p-2 bg-bluegray-900 mt-3 m-auto cursor-pointer" style="display: table">-7</div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {Group, Item, packs} from "@/components/packs";

export default defineComponent({
  name: 'PackTable',
  components: {
  },

  setup() {
    const winCoinTeam = ref<1 | 2>();
    const loseCoinTeam = ref<1 | 2>();
    const messageInd = ref(0);
    const messages = computed(() => [
        `Сделайте -7`,
        `Команда на 1 слоте: орёл или решка?`,
        `...`,
        `Команда на ${winCoinTeam.value} слоте банит строку`,
        `Команда на ${loseCoinTeam.value} слоте банит строку`,
        `Команда на ${winCoinTeam.value} слоте пикает строку`,
        `Команда на ${winCoinTeam.value} слоте банит столбец`,
        `Команда на ${loseCoinTeam.value} слоте банит столбец`,
        `Команда на ${loseCoinTeam.value} слоте пикает строку`,
        `Команда на ${loseCoinTeam.value} слоте банит столбец`,
        `Команда на ${winCoinTeam.value} слоте банит столбец`,
        `Команда на ${winCoinTeam.value} слоте банит строку`,
        `Команда на ${loseCoinTeam.value} слоте банит строку`,
        `Команда на ${winCoinTeam.value} слоте банит столбец`,
        `Команда на ${loseCoinTeam.value} слоте банит столбец`,
        `Всё`,
    ])
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
      messageInd.value++;
      const array = shuffle([...packGroups.value]).splice(0, 7);
      packGroups.value = packGroups.value.filter((it) => array.includes(it));
      hafRemoved.value = true;
    };
    const coinClass = ref('');
    const pickedItems = ref<Item[]>([]);
    const pickGroup = (group: Group) => {
      group.picked = !group.picked;
    };
    const banGroup = (group: Group) => {
      group.disabled = !group.disabled
      const lastGroups = packGroups.value.filter((it) => !it.disabled && !it.picked);
      if (lastGroups.length === 1)
        lastGroups[0].picked = true;
    };
    const banItem = (group: Group, item: Item) => {
      item.disabled = !item.disabled;
      if (group.items.filter((it) => it.disabled).length === 2)
        pickItem(group.items.find((it) => !it.disabled)!);
      else {
        const pickedItem = group.items.find((it) => pickedItems.value.includes(it));
        if (pickedItem)
            pickItem(pickedItem);
      }
    };
    const pickItem = (item: Item) => {
      if (!pickedItems.value.includes(item))
        pickedItems.value.push(item);
      else
        pickedItems.value.splice(pickedItems.value.indexOf(item), 1);
    };
    let team1Picked: 'heads' | 'tails';
    const pickCoin = (side: 'heads' | 'tails') => {
      team1Picked = side;
      void flipCoin();
    };
    const flipCoin = async () => {
      coinClass.value = '';
      setTimeout(() => {
        coinClass.value = Math.random() <= 0.5 ? 'heads' : 'tails';
        winCoinTeam.value = team1Picked === coinClass.value ? 1 : 2;
        loseCoinTeam.value = team1Picked === coinClass.value ? 2 : 1;
        messageInd.value++;
        setTimeout(() => messageInd.value++, 3000);
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
      banItem,
      pickGroup,
      messageInd,
      messages,
      pickCoin,
      banGroup,
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
