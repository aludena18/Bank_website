'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//for (let i = 0; i < btnsOpenModal.length; i++)
//btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(bt => bt.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////////////
// Page navigation

//1st way
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//2nd way, more efficient by using delegation
//1. Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    //2. Determine what element originated the event
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////////
// 194. Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  console.log(clicked.dataset);

  // Guard clause
  if (!clicked) return;

  //Active tab
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////////////////////
//195. PASSING ARGUMENT TO EVENTS HANDLERS

const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__link');

const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));

///////////////////////////////////////////////////////////////////////
//196. IMPLEMENTING STICKING NAVIGATION

//This way is not efficient
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(this.window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//197. Implementing sticking nav with INTERSECTION OBSERVER API
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

///////////////////////////////////////////////////////////////////////
//198. Revealing elements on scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  //section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

///////////////////////////////////////////////////////////////////////
//199. lazy load images
const images = document.querySelectorAll('img[data-src]');

const imgCallback = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace data with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  rootMargin: '200px',
  threshold: 0,
});

images.forEach(img => {
  imgObserver.observe(img);
});
///////////////////////////////////////////////////////////////////////
//200. Building a slider
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const maxSlide = slides.length;
let curSlide = 0;

const goToSlide = function (slide) {
  slides.forEach((el, i) => {
    el.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
goToSlide(0);

//Next Slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
btnRight.addEventListener('click', nextSlide);

//Previuos Slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
btnLeft.addEventListener('click', prevSlide);

// Slider part 2
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

const dotContainer = document.querySelector('.dots');
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(el => el.classList.remove('dots__dot--active'));
  document
    .querySelector(`button[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    console.log(e.target.dataset);
    //const slide = e.target.dataset.slide;
    const { slide } = e.target.dataset; //using destructuring
    goToSlide(slide);
    activateDot(slide);
  }
});

createDots();
activateDot(0);

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
/*
// 186. Selecting. creating and deleting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    //message.parentElement.removeChild(message);
  });

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
console.log(message.style.height);

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use
logo.clasName = 'jonas';
*/

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   // const s1coords = section1.getBoundingClientRect();
//   // console.log(s1coords);

//   // console.log(e.target.getBoundingClientRect());

//   // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

//   // console.log(
//   //   'height/width viewport',
//   //   document.documentElement.clientHeight,
//   //   document.documentElement.clientWidth
//   // );

//   //Scrolling;
//   //window.scrollTo(s1coords.left, s1coords.top);

//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   section1.scrollIntoView({ behavior: 'smooth' });
// });

///////////////////////////////////////
// Types of Events and Event Handlers
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
//   console.log('Function deleted');
// }, 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

//191.  Event Propagation in Practice

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min + 1)) + min;
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

///////////////////////////////////////
// DOM Traversing
// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
//});

//////////////////////////////////////////////////////////////////////////
// // Test: Call and Bind methods
// console.log('hi');

// const abel = {
//   name: 'Abel Ludeña',
//   age: 38,
//   courses: [],
//   addCourse(course, type) {
//     console.log(
//       `${this.name} is ${this.age} and has taken a
//       new course called ${course}`
//     );
//     this.courses.push({ name: course, type: type });
//   },
// };

// const santiago = {
//   name: 'Santiago Ludeña',
//   age: 36,
//   courses: [],
// };

// const addCourse = abel.addCourse;
// addCourse.call(santiago, 'java', 'modern');
// console.log(santiago.courses);

// const santiAddCourse = addCourse.bind(santiago);
// santiAddCourse('Phyton', 'Basic');
// santiAddCourse('Visual', 'Advance');

// //Partial application
// const santiJavaCarrer = addCourse.bind(santiago, 'Java');
// santiJavaCarrer('Vanilla');
// santiJavaCarrer('Full Stack');

// console.log(santiago.courses);
//////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
// Lifecycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
