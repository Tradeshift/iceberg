import { findKey } from 'lodash';

export const formatFloat = n => parseFloat(n.toFixed(3).slice(0, -1));

export const getValuePair = (arr, value) => {
    const key = arr ? findKey(arr, ['x', formatFloat(value)]) : 0;
    return key ? arr[parseInt(key, 10)].y : 0;
};

// const d = new Date();
// const m = d.getMonth();
// const y = d.getFullYear();
const m = 0;
const y = 2019;
const lastDay = new Date(y, m + 1, 0).getDate();

export const startDate = `${y}-${m < 10 ? `0${m + 1}` : m + 1}-01`;
export const endDate = `${y}-${m < 10 ? `0${m + 1}` : m + 1}-${lastDay}`;
