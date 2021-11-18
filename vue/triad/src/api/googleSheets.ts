const responseSheetId = '1_m8_KfPFjZ4wEeNlpyTuG3FStZqzYzdow4BlVTQEKmE';

function getRequestLink(sheetId: string, query: string) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tq=${query}`;
}

const dateRegEx = /Date\((\w+),(\w+),(\w+),(\w+),(\w+),(\w+)\)/;
export function parseDate (date: string) {
  const parsed = dateRegEx.exec(date);
  if (!parsed) {
    throw new Error(`Unexpected date format: ${date}`);
  }
  const [, year, month, day, hour, minute, second] = parsed;
  const parsedDate = new Date(
    parseInt(year),
    parseInt(month),
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second),
  );
  return parsedDate.toLocaleDateString() + ' @ ' + parsedDate.toLocaleTimeString();
}
export function dateToISO (date: string) {
  const parsed = dateRegEx.exec(date);
  if (!parsed) {
    throw new Error(`Unexpected date format: ${date}`);
  }
  const [, year, month, day, hour, minute, second] = parsed;
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

interface Column {
  id: string;
  label: string;
  type: 'string' | 'datetime';
  pattern?: string;
}

interface Row {
  c: {
    v: string;
    f?: string;
  }[];
}

async function querySheet(sheetId: string, query: string) {
  const response = await fetch(getRequestLink(sheetId, query));
  if (response.status >= 400) {
    throw new Error(`Server responded with error code ${response.status}: ${response.statusText}`);
  }
  const textData = await response.text();
  const { table } = JSON.parse(
    textData.slice(textData.indexOf('{'), textData.lastIndexOf('}') + 1)
  ) as { table: { cols: Column[]; rows: Row[] } };
  return {
    header: table.cols,
    rows: table.rows.map(row => row.c.map(cell => cell && cell.v)),
  };
}

export interface FormResponse {
  timestamp: string;
  data: any[];
  gender: string;
  age: string;
  firstLanguage?: string;
  secondLanguages?: string;
}

export const getResponses = async (projectId: string): Promise<FormResponse[]> => {
  const { rows } = await querySheet(responseSheetId, `select A, B, C, D, E, F where G = '${projectId}'`);
  return rows.map(row => ({
    timestamp: parseDate(row[0]),
    data: JSON.parse(row[1]),
    gender: row[2],
    age: row[3],
    firstLanguage: row[4],
    secondLanguages: row[5],
  }));
};
