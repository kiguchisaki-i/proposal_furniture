const mySwiper = new Swiper('.swiper', {
loop: true,
    slidesPerView: "auto",
    speed: 18000,
    allowTouchMove: false,
    spaceBetween: 90,
    autoplay: {
        delay: 0,
    },   
    
});
document.addEventListener("DOMContentLoaded", function () {
        const productObjs = document.querySelectorAll('[data-product-obj]');
        productObjs.forEach((obj, index) => {
            if (index !== 0) {
                obj.style.display = 'none';
            }
        });

        const colorButtons = document.querySelectorAll('[data-product-trigger]');
        colorButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productTriggerValue = this.getAttribute('data-product-trigger');
                colorButtons.forEach(btn => {
                    btn.classList.remove('is-active');
                });

                this.classList.add('is-active');

                productObjs.forEach(obj => {
                    const objValue = obj.getAttribute('data-product-obj');
                    if (objValue === productTriggerValue) {
                        obj.style.display = 'block';
                    } else {
                        obj.style.display = 'none';
                    }
                });
            });
        });
    });