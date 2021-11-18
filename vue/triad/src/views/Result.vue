<script lang="ts">
import { computed, defineComponent, Fragment, h, onMounted, onUnmounted, ref, VNode } from 'vue';
import { useRoute } from 'vue-router';
import { FormResponse, getResponses } from '@/api/googleSheets';
import projects, { Project } from '@/data/project';
import { ResponseItem } from '@/components/Triad.vue';
import Responses from '@/components/Responses.vue';

export default defineComponent({
  components: {
    Responses,
  },
  setup() {
    const route = useRoute();
    const projectId = route.params.id as string;
    const projectDefinition = projects.find(project => project.id === projectId)!;
    // if (!projectDefinition) {
    //   return () => h('p', `404: Unable to find project with ID '${projectId}'`);
    // }

    const languageIndex = ref(0);
    const currentProject = computed<Project>(() => projectDefinition.languages[languageIndex.value]);

    const formResponses = ref<FormResponse[]>([]);
    const data = ref<{ [key: string]: number }>({});
    const rawData: { [key: string]: number } = {};
    const totalRows = ref(0);
    const isLoaded = ref(false);
    function addData(array: ResponseItem[]) {
      for (const item of array) {
        const key = item[0].join(':');
        if (key in rawData) {
          rawData[key]++;
        } else {
          rawData[key] = 1;
        }
      }
    }
    onMounted(() => {
      getResponses(route.params.id as string)
        .then((rows) => {
          rows.forEach((row) => {
            addData(row.data);
          });
          formResponses.value = rows;
          isLoaded.value = true;
          data.value = rawData;
          totalRows.value = rows.length || 1;
        })
        .catch(console.error);
    });

    return {
      formResponses,
      data,
      totalRows,
      isLoaded,
      projectDefinition,
      currentProject,
      languageIndex,
      setLanguageIndex: (index: number) => languageIndex.value = index,
    };
  },
  render(): VNode {
    const { currentProject, data, isLoaded, formResponses,
      languageIndex, projectDefinition, setLanguageIndex, totalRows } = this;
    const topLevel = [
      h('h2', 'Project Responses'),
      h('h3', { class: 'print-only' }, currentProject.name),
      h('p', { class: 'screen-only' },
        h('select', {
          value: languageIndex,
          onChange: (event: Event) => {
            setLanguageIndex(parseInt((event.target as HTMLSelectElement).value, 10));
          }
        }, projectDefinition.languages.map((project, index) =>
          h('option', {
            value: index,
          }, project.name)
        )),
      ),
      h('p', { class: 'screen-only' },
        h('button', { onClick() { print(); } }, 'Print Results'),
      ),
    ];
    if (isLoaded) {
      const { items } = currentProject;
      const totalPossibleMatches = (items.length - 2) * totalRows;
      const header = h('thead', h('tr', items.map((item, index) =>
        h('th', index === 0 ? '' : item),
      )));
      const rows = [];
      for (let rowIndex = 0; rowIndex < items.length - 1; rowIndex++) {
        const item = items[rowIndex];
        const colStart = rowIndex + 1;
        const cells: VNode[] = [
          h('th', { colspan: rowIndex + 1 }, item),
        ];
        for (let colIndex = colStart; colIndex < items.length; colIndex++) {
          const value = data[`${rowIndex}:${colIndex}`] || 0;
          cells.push(h('td', { style: { backgroundColor: `rgba(255,171,145,${value / totalPossibleMatches})` } }, value));
        }

        rows.push(h('tr', cells));
      }
      const body = h('tbody', rows);
      topLevel.push(h('table', { class: 'distribution-table' }, [
        header,
        body,
      ]));
    }
    topLevel.push(h(Responses, { formResponses }))
    return h('div', { class: 'response-visualization' }, topLevel);
  },
});
</script>

<style>
.distribution-table {
  border-spacing: 0;
}
.distribution-table th {
  text-align: right;
  padding: 4px 8px;
  background-color: whitesmoke;
}
.response-visualization {
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media only screen {
  .print-only {
    display: none;
  }
}
@media print {
  body {
    color-adjust: exact;
  }
  .screen-only {
    display: none;
  }
  @page {
    size: A4;
    margin: 0.4in;
  }
}
</style>
