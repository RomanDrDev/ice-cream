
//* скрываем скролл, добавляя паддинг body и объектам с position: fixed

const body = document.querySelector('body');
// массив объектов с position: fixed (всем добавлен класс lock-padding)
const lockPadding = document.querySelectorAll('.lock-padding');
let unlock = true;

const timeout = 800;

function bodyLock() {
   // получаем ширину скрола (разницу между шириной окна и объекта внутри него)
   const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

   if (lockPadding.length > 0) {
      for (let i = 0; i < lockPadding.length; i++) {
         const el = lockPadding[i];
         // добавляем паддинг элементу с классом lock-padding
         el.getElementsByClassName.paddingRight = lockPaddingValue;
      }
   }
   // добавляем паддинг body (компенсируем смещение контента)
   body.style.paddingRight = lockPaddingValue;
   // добавляем маржин иконке бургера (компенсируем смещение контента)
   menuIcon.style.marginRight = lockPaddingValue;
   body.classList.add('lock');

   // исключаем повторные нажатия
   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

//* открываем скролл и убираем паддинг у body и объектов с position: fixed
function bodyUnlock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let i = 0; i < lockPadding.length; i++) {
            const el = lockPadding[i];
            el.style.paddingRight = '0px';
         }
      }
      body.style.paddingRight = '0px';
      menuIcon.style.marginRight = '0px';
      body.classList.remove('lock');
      // решаем проблему резкого появления скрола при закрытии элемента
   }, timeout - 400);

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

//* BURGER-MENU

const menuIcon = document?.querySelector("[data-burger]");
const nav = document?.querySelector("[data-nav]");
const navLinks = nav.querySelectorAll("a");
const header = document.querySelector(".header");


if (menuIcon) {
   menuIcon.addEventListener('click', () => {
      menuIcon?.classList.toggle('active');
      nav?.classList.toggle('active');
      header.classList.toggle('active');
      // запрещаем скролл при открытом меню
      if (menuIcon.classList.contains('active')) {
         bodyLock();
      } else {
         bodyUnlock();
      }
   });
}


//* скролл тз меню, кнопок до якоря на странице 
const anchors = document.querySelectorAll('[data-goto]');

if (anchors.length > 0) {
   anchors.forEach(anchor => {
      anchor.addEventListener("click", onAnchorClick);
   });

   function onAnchorClick(e) {
      // получаем объект-ссылку, где был клик
      const anchor = e.target;
      // проверяем заполнен ли атрибут и существует ли данный объект
      if (anchor.dataset.goto && document.querySelector(anchor.dataset.goto)) {
         const gotoBlock = document.querySelector(anchor.dataset.goto);
         // учитываем высоту шапки
         const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.pageYOffset - document.querySelector('.header').offsetHeight + 50;

         // закрываем меню при клике на пункт меню
         if (menuIcon.classList.contains('active')) {
            bodyUnlock();
            menuIcon.classList.remove('active');
            nav.classList.remove('active');
            header.classList.remove('active');
         }

         window.scrollTo({
            top: gotoBlockValue,
            behavior: 'smooth'
         });
         e.preventDefault();
      }
   }
}

//* SLIDER-FEEDBACKS

const sliderFeedbacks = document.querySelector(".slider-feedbacks");
const slidesFeedback = sliderFeedbacks.querySelectorAll(".slider-feedbacks__item");
const wrapperDots = sliderFeedbacks.querySelector(".slider-feedbacks__dots-wrapper");

// Точки добавляем на страницу динамически
const dots = [];

for (let i = 0; i < slidesFeedback.length; i++) {
   const dot = document.createElement('button');
   // Идентифицируем точку (добавляем data-атрибут slide-to с индексом)
   dot.dataset.slideTo = i;
   // Добавляем класс со стилями
   dot.classList.add('slider-feedbacks__dot');
   // При создании первой точки делаем её активной
   if (i == 0) dot.classList.add('slider-feedbacks__dot--active');
   // Остальные слайды скрываем
   if (i != 0) slidesFeedback[i].style.display = 'none';
   // При клике на точку вызываем функцию показа слайда
   dot.addEventListener('click', showSlideFeedback);
   // Выводим в обертку для dots
   wrapperDots.append(dot);
   // Добавляем точки в массив
   dots.push(dot);
}

function showSlideFeedback(e) {
   // Получаем значение data-атрибута slide-to, по которому был клик
   const slideTo = e.target.dataset.slideTo;

   slidesFeedback.forEach(item => item.style.display = "none");
   slidesFeedback[slideTo].style.display = "block";

   // Добавляем класс активности текущей точке
   dots.forEach(dot => dot.classList.remove('slider-feedbacks__dot--active'));
   e.target.classList.add('slider-feedbacks__dot--active');
}


//*  POPUPS

const popupLinks = document.querySelectorAll('.popup-link');
// коллекция форм, при оправке которых открывается попап
// const submitForms = document.querySelectorAll('#buy-now-products, #franchise');


// определяем текущий попап по нажатой ссылке
if (popupLinks.length > 0) {
   for (let i = 0; i < popupLinks.length; i++) {
      const popupLink = popupLinks[i];
      popupLink.addEventListener("click", function (e) {
         const popupName = popupLink.getAttribute('href').replace('#', '');
         const curentPopup = document.getElementById(popupName);

         // вызываем попап
         popupOpen(curentPopup);
         // блокируем переход по ссылке
         e.preventDefault();
      });
   }
}

// закрытие попапа при нажатии на элемент c классом close-popup
const popupCloseLink = document.querySelectorAll('.close-popup');
if (popupCloseLink.length > 0) {
   for (let i = 0; i < popupCloseLink.length; i++) {
      const el = popupCloseLink[i];
      el.addEventListener("click", function (e) {
         popupClose(el.closest('.popup'));
         e.preventDefault();
      });
   }
}

// открытие текущего попапа с ссылкой в попапе
function popupOpen(curentPopup) {
   if (curentPopup && unlock) {
      // получаем открытый попап
      const popupActive = document.querySelector('.popup.open');
      if (popupActive) {
         // закрываем открытый попап
         popupClose(popupActive, false);
      } else {
         bodyLock();
      }
      // открываем текущий попап
      curentPopup.classList.add('open');
      curentPopup.addEventListener("click", function (e) {
         // отсекаем все, кроме фона (блокируем закрытие при клике внутри попапа)
         if (!e.target.closest('.popup__content')) {
            popupClose(e.target.closest('.popup'));
         }
      });
   }
}

// при попапах внутри других попапов
function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      // закрываем активный попап-"родитель"
      popupActive.classList.remove('open');
      if (doUnlock) {
         // запрещаем разблокировать скрол
         bodyUnlock();
      }
   }
}

// вызов попапа успешной отправки формы
// if (submitForms.length > 0) {
//    const successfullyPopup = document.getElementById('successfully-popup');


//    for (let i = 0; i < submitForms.length; i++) {
//       const submitForm = submitForms[i];

//       submitForm.addEventListener("submit", function (e) {
//          e.preventDefault();
//          const message = submitForm.querySelector('.form-box__message');
//          const userPhone = submitForm.querySelector('.form-box__phone').value;

//          if (ValidPhone(userPhone)) {
//             popupOpen(successfullyPopup);
//             message.classList.remove('active');
//          } else {
//             message.classList.add('active');
//          };
//       });
//    }
// }

// закрываем попап клавишей Esc
document.addEventListener("keydown", function (e) {
   if (e.keyCode == 27) {
      const popupActive = document.querySelector('.popup.open');
      if (popupActive)
         popupClose(popupActive);
   }
});

(function () {
   // проверяем поддержку (в т.ч. для IE11)
   if (!Element.prototype.closest) {
      Element.prototype.closest = function (css) {
         var node = this;
         while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
         }
         return null;
      };
   }
})();
(function () {
   // проверяем поддержку (в т.ч. для IE11)
   if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.matchesSelector ||
         Element.prototype.mozMatchesSelector ||
         Element.prototype.msMatchesSelector;
   }
})();

//* Подсветка активного пункта меню при скролле

// const observer = new IntersectionObserver((entries) => {
//    entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//          document.querySelectorAll('.nav__link').forEach((link) => {
//             let id = link.getAttribute('href').replace('#', '');
//             if (id === entry.target.id) {
//                link.classList.add('nav__link--active');
//             } else {
//                link.classList.remove('nav__link--active');
//             }
//          });
//       }
//    });
// }, {
//    // в каком процентном соотношении считать секцию открытой
//    threshold: 0.5
// });

// document.querySelectorAll('section').forEach(section => { observer.observe(section) });