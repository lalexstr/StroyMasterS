import Notiflix from 'notiflix';

const NotiflixConfig = {
  init() {
    Notiflix.Notify.init({
      width: '320px',
      position: 'right-top',
      distance: '20px',
      opacity: 1,
      fontSize: '15px',
      cssAnimationStyle: 'from-top',
    });

    Notiflix.Loading.init({
      svgColor: '#4caf50',
    });

    Notiflix.Confirm.init({
      titleColor: '#4caf50',
    });
  }
};

export default NotiflixConfig;