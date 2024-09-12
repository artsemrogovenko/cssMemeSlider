const slider = document.querySelector('.slider');
const controls = document.querySelector('.controls');
const caption = document.querySelector('.caption');
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


function initialize() {
    let root = document.documentElement;
    const selectors = document.querySelectorAll('.control');

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
            const mem = slidesData[id - 1];
            const round = element.querySelector('.control');
            round.classList.add('control_active');
            slider.innerHTML = `<img src="../cssMemeSlider/assets/${slidesData[id - 1]['img']}" alt="img"></img>`;
            caption.innerHTML = mem['description'];
            root.style.setProperty('--slider-bg-color', mem['bgcolor']);
        }
    });
}





