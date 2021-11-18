<template>
  <table class="response-table">
    <thead>
      <tr>
        <th>Gender</th>
        <th>Age</th>
        <th>Completed</th>
        <th>First Language</th>
        <th>Second Language(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of formResponses" :key="index">
        <td>{{ item.gender }}</td>
        <td>{{ item.age }}</td>
        <td>{{ item.timestamp }}</td>
        <td>{{ item.firstLanguage }}</td>
        <td>{{ item.secondLanguages }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormResponse } from '@/api/googleSheets';

export default defineComponent({
  props: {
    formResponses: {
      type: Array as PropType<FormResponse[]>,
      required: true,
    }
  },
});
</script>

<style>
table {
  border-collapse: collapse;
}
td, th {
  padding: 4px 8px;
}
.response-table {
  margin-top: 50px;
}
.response-table tbody tr {
  border-top: 1px solid rgba(0,0,0,0.4);
}
</style>
