import { findKey } from 'lodash';

export const formatFloat = n => parseFloat(n.toFixed(3).slice(0, -1));

export const getValuePair = (arr, value) => {
    const key = arr ? findKey(arr, ['x', formatFloat(value)]) : 0;
    return key ? arr[parseInt(key, 10)].y : 0;
};

export const isNull = n => n === null;

const today = new Date();
const day = d => d.getDate();
const month = d => d.getMonth();
const year = d => d.getFullYear();

const start = new Date(new Date().setDate(day(today) - 30));

const formatDateToString = (d) => {
    const dd = day(d);
    const mm = month(d);
    const yyyy = year(d);
    return `${yyyy}-${mm < 10 ? `0${mm + 1}` : mm + 1}-${dd}`;
};

export const startDate = formatDateToString(start);
export const endDate = formatDateToString(today);
