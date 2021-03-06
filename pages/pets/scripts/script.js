window.addEventListener('DOMContentLoaded', (event) => {
  burgerMenuInit();
});

//Swiper----------------------

   let mySwiper = new Swiper('.swiper-container', {
  
      slidesPerView: 1,
      spaceBetween: 40,
      slidesPerColumn: 3,
      slidesPerGroup: 1,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
          slidesPerColumn: 3,
          slidesPerGroup: 2,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 40,
          slidesPerColumn: 2,
          slidesPerGroup: 4,
        },
      },
    });

  

// Burger menu-----------------------------------------

const burgerMenuInit = () => {
  const burgerOverlay = document.querySelector('.burger__overlay');
  const burgerMenuIcon = document.querySelector('.header__burger');
  burgerMenuIcon.addEventListener('click', event => {
    const headerLogo = document.querySelector('.header__logo');
    headerLogo.classList.toggle('unvisible')
    burgerMenuIcon.classList.toggle('rotate');
    burgerMenuIcon.classList.toggle('unrotate');
    const burgerMenu = document.querySelector('.burger__menu');
    burgerMenu.classList.toggle('open');
    burgerMenu.classList.toggle('hide');
    burgerOverlay.classList.toggle('unvisible');
    const body = document.querySelector('body');
    body.classList.toggle('overflow');
  });
  burgerOverlay.addEventListener('click', event => {
    burgerMenuIcon.click();
  });
  const burgerLinks = document.querySelectorAll('.burger__link');
  burgerLinks.forEach(element => element.addEventListener('click', event => {
    burgerMenuIcon.click();
  }));
}

//Pets array----------------------------------
let pets = []; // 8
let fullPetsList = []; // 48
const request = new XMLHttpRequest();
request.open('GET', '../../assets/pets.json');
request.onload = () => {
  pets = JSON.parse(request.response);
  
  fullPetsList = (() => {
    let tempArr = [];

    for (let i = 0; i < 6; i++) {
      const newPets = pets;

      for ( let j = pets.length; j > 0; j--) {
        let randInd = Math.floor(Math.random() * j);
        const randElem = newPets.splice(randInd, 1)[0];
        newPets.push(randElem);
      }

        tempArr = [...tempArr, ...newPets]
    }
    return tempArr;
  })();


  fullPetsList = sort863(fullPetsList);
  
  createPets(fullPetsList);
  mySwiper.update();
  popupp();
}

const createPets = (petsList) => {
  const elem = document.querySelector('.swiper-wrapper');
  elem.innerHTML += createElements(petsList);

}

createElements = (petsList) => {
 let str = '';
 for (let i = 0; i < petsList.length; i++) {
    str +=`<div class="swiper-slide"><img class="card__img" src="${petsList[i].img}" alt="${petsList[i].type}"><p class="card__title">${petsList[i].name}</p><button class="button card__button">Learn more</button></div>`
 } 
 return str;
}

request.send();

const sort863 = (list) => {
  let unique8List = [];
  let length = list.length;
  for (let i = 0; i < length / 8; i++) {
    const uniqueStepList = [];
    for (j = 0; j < list.length; j++) {
      if (uniqueStepList.length >= 8) {
        break;
      }
      const isUnique = !uniqueStepList.some((item) => {
        return item.name === list[j].name;
      });
      if (isUnique) {
        uniqueStepList.push(list[j]);
        list.splice(j, 1);
        j--;
      }
    }
    unique8List = [...unique8List, ...uniqueStepList];
  }
  list = unique8List;


  list = sort6recursively(list);

  return list;
}

const sort6recursively = (list) => {
  const length = list.length;

  for (let i = 0; i < (length / 6); i++) {
    const stepList = list.slice(i * 6, (i * 6) + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && (ind !== j);
      });

      if (duplicatedItem !== undefined) {
        const ind = (i * 6) + j;
        const which8OfList = Math.trunc(ind / 8);

        list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

        sort6recursively(list);
      }
    }
  }

  return list;
}




// Pagination

const paginationButtonNext = document.querySelector('.pagination__button-next'),
  paginationButtonPre = document.querySelector('.pagination__button-pre'), 
  paginationButtonCurrent = document.querySelector('.pagination__button-currentPage'), 
  paginationButtonFirst = document.querySelector('.pagination__button-first'), 
  paginationButtonLast = document.querySelector('.pagination__button-last');

  paginationButtonNext.addEventListener('click', event => {
    mySwiper.slideNext();
  });
  paginationButtonPre.addEventListener('click', event => {
    mySwiper.slidePrev();
  });
  paginationButtonFirst.addEventListener('click', event => {
    mySwiper.slideTo(0);
  });
  paginationButtonLast.addEventListener('click', event => {
    mySwiper.slideTo(48);
  });


  mySwiper.on('slideChange', function () {
    if ((mySwiper.realIndex / mySwiper.params.slidesPerGroup) + 1 === 1) {
      paginationButtonFirst.classList.add('pagination__button-disabled');
      paginationButtonPre.classList.add('pagination__button-disabled');
    } else {
      paginationButtonFirst.classList.remove('pagination__button-disabled');
      paginationButtonPre.classList.remove('pagination__button-disabled');
    };
    if ((mySwiper.realIndex / mySwiper.params.slidesPerGroup) + 1 === 48 / (mySwiper.params.slidesPerGroup * mySwiper.params.slidesPerColumn)) {
      paginationButtonLast.classList.add('pagination__button-disabled');
      paginationButtonNext.classList.add('pagination__button-disabled');
    } else {
      paginationButtonLast.classList.remove('pagination__button-disabled');
      paginationButtonNext.classList.remove('pagination__button-disabled');
    };
    paginationButtonCurrent.textContent = `${(mySwiper.realIndex / mySwiper.params.slidesPerGroup) + 1}`;
  });




  //Popup

const popupp = () => {
  const popupOverlay = document.querySelector('.popup__overlay');
  const popup = document.querySelector('.popup');
  const popupContent = document.querySelector('.popup__content');
  const closeButton = document.querySelector('.popup__close-button');
  
  document.querySelectorAll('.swiper-slide').forEach(item => {
    item.addEventListener('click', () => {
      console.log(item.childNodes[1].innerText);
      popupContent.innerHTML = '';
      insertCard(item);
      popup.classList.add('visible');
      document.body.classList.add('overflow');
    });
  });
  
  closeButton.addEventListener('click', () => {
    popup.classList.remove('visible');
    document.body.classList.remove('overflow');
  });
  
  popupOverlay.addEventListener('click', () => {
    popup.classList.remove('visible');
    document.body.classList.remove('overflow');
  });
  
  function insertCard(card) {
    pets.forEach(pet => {
      if (pet['name'] === card.childNodes[1].innerText) {
        popupContent.insertAdjacentHTML('beforeend', 
        `<div class="popup__column">
            <img src="${pet.img}" alt="${pet.type} ${pet.name}">
        </div>
        <div class="popup__column">
            <h2 class="popup__title">${pet.name}</h2>
            <p class="popup__pet-type">${pet.type} - ${pet.breed}</p>
            <p class="popup__pet-description">${pet.description}</p>
            <ul class="popup__list-info">
                <li class="popup__list-item"><span class="list-item__bold">Age: </span><span class="list-item__normal">${pet.age}</span></li>
                <li class="popup__list-item"><span class="list-item__bold">Inoculations: </span><span class="list-item__normal">${pet.inoculations}</span></li>
                <li class="popup__list-item"><span class="list-item__bold">Diseases: </span><span class="list-item__normal">${pet.diseases}</span></li>
                <li class="popup__list-item"><span class="list-item__bold">Parasites: </span><span class="list-item__normal">${pet.parasites}</span></li>
            </ul>
        </div>`);
      }
    })
   } 
   
  }
  

  