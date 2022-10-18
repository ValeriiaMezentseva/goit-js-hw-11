import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './api-service'
import markup from './templates';

   
const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')

};

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
lightBox.on('show.lightbox');



let currentPage = 1;
let totalHits = 0;
let query = '';

const render = photos => {
    const photoMarkUp = photos.map(markup).join('');
    refs.gallery.insertAdjacentHTML('beforeend', photoMarkUp)
};

const clear = () => {
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.classList.add('is-hidden'); 
    totalHits = 0;
};

refs.form.addEventListener('submit', onFormSubmit);


async function onFormSubmit(event) {
    event.preventDefault();
    currentPage = 1;
    query = event.target.elements.searchQuery.value.trim();
    if (query === '') {
        Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
        );
        clear();
        lightBox.refresh();
        return;
    }
    const data = await fetchImages(query, currentPage);
    totalHits = data.hits.length;
    let hitsData = data.totalHits

    if (hitsData > 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
    } else 
    //  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.loadMoreBtn.classList.add('is-hidden');

    try {
        if (hitsData === 0) {
         Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
            );  
            clear(); 
        }
        if (hitsData > 0) {
            refs.gallery.innerHTML = '';
            Notiflix.Notify.success(`Hooray! We found ${hitsData} images.`);
            render(data.hits, refs.gallery); 
            lightBox.refresh(); 
        }
    } catch (error) {
        console.log(error);
    }

}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)


async function onLoadMoreBtnClick() {
    currentPage += 1;
    const response = await fetchImages(query, currentPage);
    render(response.hits, refs.gallery);
    totalHits += response.hits.length;
     lightBox.refresh();
    if (response.hits === response.totalHits) {
       Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        ); 
        refs.loadMoreBtn.classList.add('is-hidden');
    }
   
};







