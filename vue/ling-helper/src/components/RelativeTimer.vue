<template>
  <span>{{ message }}</span>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, onUnmounted, ref, watch,
} from 'vue';

interface Block {
  message: string;
  before: number;
}

function getTime(date: Date) {
  let hours = date.getHours();
  let add = 'AM';
  if (hours > 11) {
    hours -= 12;
    add = 'PM';
  }
  if (hours === 0) {
    hours = 12;
  }
  return `${hours}:${date.getMinutes().toString().padStart(2, '0')} ${add}`;
}

const blocks: Block[] = [{
  before: 5,
  message: 'Just now',
}, {
  before: 40,
  message: 'Seconds ago',
}, {
  before: 80,
  message: 'A minute ago',
}, {
  before: 270,
  message: 'A few minutes ago',
}];

export default defineComponent({
  props: {
    baseDate: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    let id: number;
    const message = ref('');

    const calculateMessage = (): string => {
      const currentTime = Date.now();
      const time = (currentTime - props.baseDate) / 1000;
      for (const block of blocks) {
        if (time < block.before) {
          return block.message;
        }
      }
      const minutes = time / 60;
      if (minutes < 59.5) {
        return `${Math.round(minutes)} minutes ago`;
      }
      const date = new Date(currentTime);
      const baseDate = new Date(props.baseDate);
      const hours = minutes / 60;
      if (hours < 12 || (hours < 24 && baseDate.getDate() === date.getDate())) {
        return `${Math.round(hours)} hours ago`;
      }
      if (hours < 48) {
        return `Yesterday at ${getTime(baseDate)}`;
      }
      return `${Math.round(hours / 24)} days ago`;
    };
    const doUpdate = () => {
      message.value = calculateMessage();
    };

    watch(() => props.baseDate, doUpdate);

    onMounted(() => {
      // Start timer
      doUpdate();
      id = setInterval(doUpdate, 6000);
    });

    onUnmounted(() => {
      clearInterval(id);
    });

    return {
      message,
    };
  },
});
</script>

<style>

</style>
