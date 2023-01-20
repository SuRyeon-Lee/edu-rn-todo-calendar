import dayjs from 'dayjs';

export const fillEmptyColumns = (columns, start, end) => {
  const filledColumns = columns.slice(0);

  // 1. 첫날 이전 공백 채우기
  const startDay = dayjs(start).get('day'); //1월의 시작은 일요일 -> 0
  for (let i = 1; i <= startDay; i += 1) {
    const date = dayjs(start).subtract(i, 'day');
    filledColumns.unshift(date);
  }
  // 2. 마지막날 이후 공백 채우기
  const endDay = dayjs(end).get('day'); //1월의 끝은 화요일 -> 2
  /**
    0 -> 6
    1 -> 5
    2 -> 4
    endDay + ? = 6
   */
  for (let i = 1; i <= 6 - endDay; i += 1) {
    const date = dayjs(end).add(i, 'day');
    filledColumns.push(date);
  }

  return filledColumns;
};
export const getCalendarColumns = (now) => {
  //이번달의 첫날을 가져와 1.1
  const start = dayjs(now).startOf('month');
  //이번달의 마지막날을 가져와 1.31
  const end = dayjs(now).endOf('month');
  //이번달의 길이를 알고싶으니까 마지막 일을 가져와 31
  const endDate = dayjs(end).get('date');

  //이제 이번달 31을 다 배열에 담는다.
  const columns = [];
  for (let i = 0; i < endDate; i += 1) {
    const date = dayjs(start).add(i, 'day');
    columns.push(date);
  }

  const filledColumns = fillEmptyColumns(columns, start, end);
  return filledColumns;
};
