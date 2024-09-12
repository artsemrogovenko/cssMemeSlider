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

