const slider = document.querySelector('.slider');
const controls = document.querySelector('.controls');
const caption = document.querySelector('.caption');
let slider_width = slider.getBoundingClientRect().width; // ширина слайдера
let drawed = false;
let root = document.documentElement;
let currentSlide = 0;
let slidesData = [];

function parseData() {
    fetch('assets/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Преобразуем ответ в JSON
        })
        .then(obj => {
            slidesData = [...obj]; // Присваиваем загруженные данные переменной
            initialize();
        })
        .catch(error => {
            console.error('Ошибка при загрузке JSON:', error);
        });
}
window.onload = parseData;

let mouseInBrowser = true;
// Для отслеживания выхода за рамки
document.addEventListener('mousemove', (event) => {
    const borderThreshold = 3; // расстояние в пикселях от границы браузера

    const isLeft = event.clientX < borderThreshold;
    const isRight = (window.innerWidth - event.clientX) < borderThreshold;

    if ( isLeft || isRight) {
        console.log('указатель выходит за рамку браузера');
        mouseInBrowser=false;
    }else{
        mouseInBrowser=true;
    }
});

let resizeTimeout;

window.addEventListener('resize', () => {
    slider_width = slider.getBoundingClientRect().width;
    if (drawed) {
        root.style.setProperty('--offset', `-${slider_width * (currentSlide)}px`);
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {

            root.style.setProperty('--my-delay', '0s');

            const images = document.querySelectorAll('img');
            images.forEach((image) => {
                updateStyle(image);
            });

        }, 50);
        if (mouseInBrowser) {
            setTimeout(() => {
                root.style.setProperty('--my-delay', '1s');
            }, 1000);
        }
    }
});
const selectors = document.querySelectorAll('.control');

function initialize() {
    drawAllcards();

    controls.addEventListener('mouseover', event => {
        const element = event.target.closest('.control_area');
        if (element) {
            const round = element.querySelector('.control'); // Находим дочерний элемент .control
            round.classList.add('hover');
        }
    });
    controls.addEventListener('mouseout', event => {
        const element = event.target.closest('.control_area');
        if (element) {
            const round = element.querySelector('.control'); // Находим дочерний элемент .control
            round.classList.remove('hover');
        }
    });

    controls.addEventListener('click', event => {
        const element = event.target.closest('.control_area');
        if (element) {
            selectors.forEach(selector => {
                selector.classList.remove('control_active');
            });
            const id = element.id;
            currentSlide = id - 1;
            const mem = slidesData[currentSlide];
            const round = element.querySelector('.control');
            round.classList.add('control_active');
            // slider.innerHTML = `<img src="../cssMemeSlider/assets/${slidesData[id - 1]['img']}" alt="img"></img>`;
            root.style.setProperty('--offset',`-${slider_width*(currentSlide)}px`);
            root.style.setProperty('--slider-bg-color', mem['bgcolor']);
            caption.style.opacity='0';
            setTimeout(() => {
                caption.textContent =  mem['description'];
                caption.style.opacity='1';
            }, 500); // Время должно совпадать с продолжительностью перехода
        }
    });
}


function drawAllcards(){
    for (let i = 0; i < slidesData.length; i++) {
        const meme = document.createElement('img');
        meme.src = `../cssMemeSlider/assets/${slidesData[i]['img']}`;
        meme.alt = 'img';
        slider.appendChild(meme);
        meme.onload = ()=>{
            updateStyle(meme);
        }
    }
    if(!drawed){
        caption.textContent =  slidesData[0]['description'];
        document.documentElement.style.setProperty('--slider-bg-color', slidesData[0]['bgcolor']);
        selectors[0].classList.add('control_active');
    }
    drawed=true;
}

function updateStyle(element){
    const image_width = element.clientWidth; // ширина отображения в слайдере
    const margin= (slider_width - image_width) / 2; // оступ с края
    element.style.marginRight = `${margin}px`;
    element.style.marginLeft = `${margin}px`;
}