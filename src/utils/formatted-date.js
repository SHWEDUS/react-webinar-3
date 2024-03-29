import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'

export function formatDate(date, locale) {
  try {
    dayjs.locale(locale);
    const currentDate = date.split("T");
    return `${dayjs(currentDate[0]).format(`DD MMMM YYYY ${locale === 'ru' ? 'г.' : 'y.'}`)} ${locale === 'ru' ? 'в' : 'at'} ${currentDate[1].slice(0, 5)}`;
  } catch (e) {
    return "";
  }
}