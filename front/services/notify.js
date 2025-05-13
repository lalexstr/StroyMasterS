import { Notiflix } from 'notiflix';

export default {
  success(message) {
    Notiflix.Notify.success(message);
  },
  error(message) {
    Notiflix.Notify.failure(message);
  },
  info(message) {
    Notiflix.Notify.info(message);
  },
  warning(message) {
    Notiflix.Notify.warning(message);
  },
  loading() {
    Notiflix.Loading.circle();
  },
  removeLoading() {
    Notiflix.Loading.remove();
  }
};