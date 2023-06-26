// 2. THE CAT API Отримую дані про котів
const API_ENDPOINT = 'https://api.thecatapi.com/v1';

const request = async url => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw errorData;
    }
  } catch (error) {
    throw {
      message: error.message,
      status: error.status
    }
  }
}

const api = {
  fetchCats: async limitNumber => {
    try {
      toggleSpinner();
      const catData = await request(`${API_ENDPOINT}/images/search?limit=${limitNumber}&page=10&order=Desc`);
      showCatData(catsList, catData);
    } catch (error) {
      console.log(error)      
    }
  },
  fetchRandomCats: async () => {
    try {
      toggleSpinner();
      const catData = await request(`${API_ENDPOINT}/images/search?limit=60`);
      showCatData(randomCatsList, catData);
    } catch (error) {
      console.log(error)
    }
  }
}


// 3. Отримую випадкові дані про котів
const catsList = document.querySelector('.cats-list');
const randomCatsList = document.querySelector('.random-cats-list');

const showCatData = (catsList, cats) => {
  cats.map(cat => {
    const catItem = document.createElement('li');
    const catImage = document.createElement('img');
    const catId = document.createElement('p');

    catImage.setAttribute('src', cat.url);
    catImage.classList.add('lazy');
    catImage.dataset.src = cat.url;
    catImage.dataset.id = cat.id;
    catId.innerText = cat.id;

    catItem.className = 'cat-item';
    catItem.appendChild(catImage);
    catItem.appendChild(catId);
    
    // Event Delegation 
    // catItem.addEventListener('click', () => {
    //   toggleModal();
    //   showModal(cat.url, cat.id);
    // })

    catsList.appendChild(catItem);
  })
  lazyLoad();
  toggleSpinner();

  // 3-1.
  catsList.addEventListener('click', e => {
    const path = e.path;
    const catCard = path.find(elem => elem.className === 'cat-item');
    
    if (catCard) {
      const clickedCatImageInfo = catCard.querySelector('img');
      toggleModal();
      showModal(
        clickedCatImageInfo.getAttribute('data-src'),
        clickedCatImageInfo.getAttribute('data-id')
      );
    }
  })
}


// 4. modal 
const modalWrapper = document.querySelector('.modal-wrapper');
modalWrapper.classList.add('hidden');
const showModal = (url, id) => {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const modalContents = document.createElement('section');
  modalContents.className = 'modal-contents';

  const modalHeader = document.createElement('header');

  const modalTitle = document.createElement('div');
  modalTitle.className = 'modal-title';
  modalTitle.innerText = 'Cat Modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerText = 'CLOSE';

  const catImage = document.createElement('img');
  catImage.setAttribute('src', url);

  const catId = document.createElement('p');
  catId.innerText = id;

  closeBtn.addEventListener('click', () => onCloseModal() );
  overlay.addEventListener('click', () => onCloseModal() );

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);

  modalContents.appendChild(modalHeader);
  modalContents.appendChild(catImage);
  modalContents.appendChild(catId);

  modalWrapper.appendChild(overlay);
  modalWrapper.appendChild(modalContents);
}

// 4-1. modal 
const toggleModal = () => {
  modalWrapper.classList.toggle('hidden');
}

// 4-2. 
const onCloseModal = () => {
  modalWrapper.innerHTML = '';
  toggleModal();
}


// 1. 
const limitNumberForm = document.querySelector('#limit-form');
const inputlimitNumber = document.querySelector('#limit-number');
const getRandomCatsButton = document.querySelector('.get-random-cats');

limitNumberForm.addEventListener('submit', e => {
  e.preventDefault();
  let numberReg = /[1-9]/;
  if (!inputlimitNumber.value) {
    alert('<10');
    return
  }
  if (numberReg.test(inputlimitNumber.value)) {
    if (inputlimitNumber.value < 1 || inputlimitNumber.value > 10) {
      alert('<10');
      return
    }
    catsList.innerHTML = '';
    api.fetchCats(inputlimitNumber.value);
  } else {
    alert('<10');
  }
})

getRandomCatsButton.addEventListener('click', () => {
  randomCatsList.innerHTML = '';
  api.fetchRandomCats();
  infiniteScroll();
})


// 5. 
const infiniteScroll = () => {
  window.addEventListener('scroll', () => {
    if (scrollHeight() < documentHeight() - window.innerHeight) return
    api.fetchRandomCats();
  })
}

// Функція для отримання поточної висоти прокручування
const scrollHeight = () => {
  return window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement.scrollTop || document.body.scrollTop);
}

// 
const documentHeight = () => {
  return Math.max(
    document.body.scrollHeight, document.body.offsetHeight,
    document.documentElement.clientHeight, document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  )
}

// 6. Lazy Loading 
const lazyLoad = () => {
  const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
}


// 7. Loading Spinner 
const spinnerWrapper = document.querySelector('.spinner-wrapper');
spinnerWrapper.classList.add('hidden');

const overlay = document.createElement('div');
overlay.className = 'overlay';

const spinnerContents = document.createElement('div');
spinnerContents.className = 'spinner-contents';

const spinnerImage = document.createElement('img');
spinnerImage.className = 'spinner-image';
spinnerImage.setAttribute('src', './images/cat.png');

const spinnerText = document.createElement('p');
spinnerText.innerText = 'Loading...';

spinnerContents.appendChild(spinnerImage);
spinnerContents.appendChild(spinnerText);

spinnerWrapper.appendChild(overlay);
spinnerWrapper.appendChild(spinnerContents);


// 7-1. Loading Spinner 
const toggleSpinner = () => {
  spinnerWrapper.classList.toggle('hidden');
}