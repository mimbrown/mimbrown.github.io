<template>
  <h2>Thank You!</h2>
  <p>
    Your response has been recorded. <router-link to="/">Click here</router-link> to return to the home screen, or you will be redirected in <Timer :start="10" /> seconds.
  </p>
</template>

<script lang="ts">
import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export const Timer = defineComponent({
  props: {
    start: {
      type: Number,
      default: 10,
    },
  },
  setup(props) {
    const router = useRouter();
    const time = ref(props.start);

    let timer: number;
    onMounted(() => {
      timer = setInterval(() => {
        if (--time.value < 1) {
          router.push('/');
        }
      }, 1000);
    });
    onUnmounted(() => clearInterval(timer));

    return {
      time,
    };
  },
  render() {
    return h('span', null, this.time);
  },
});

export default defineComponent({
  components: {
    Timer,
  },
});
</script>

<style>
</style>
