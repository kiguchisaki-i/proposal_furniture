/* cursor */
const changeCursor = (target, pointer) => {
    const pointerAreas = document.querySelectorAll(target);
    const targetPointer = document.querySelector(pointer);
    if (pointerAreas.length === 0 || !targetPointer) {
        return;
    }
    pointerAreas.forEach((pointerArea) => {
        pointerArea.addEventListener("mouseenter", () => {
            targetPointer.classList.add("is-active");
        });

        pointerArea.addEventListener("mouseleave", () => {
            targetPointer.classList.remove("is-active");
        });

        pointerArea.addEventListener("mousemove", (e) => {
            targetPointer.style.top = e.clientY + "px";
            targetPointer.style.left = e.clientX + "px";
        });
    });
};
changeCursor(".products__item", ".cursor-pointer");

/* fadein */
document.addEventListener("scroll", function () {
    const elements = document.querySelectorAll(".display");

    for (const element of elements) {
        const isVisible =
            element.getBoundingClientRect().top < window.innerHeight;
        if (isVisible) {
            element.classList.add("is-done");
        }
    }
});

/* header */
const header = document.getElementById("header");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop > lastScrollTop) {
        header.classList.add("is-hidden");
    } else {
        header.classList.remove("is-hidden");
    }
    lastScrollTop = currentScrollTop;
});

/* furnitureCanvasWrap */
//z-index & opacity
document.addEventListener("DOMContentLoaded", function () {
    var productsGridElement = document.querySelector(".products__grid");
    var furnitureCanvasWrapElement = document.getElementById("furnitureCanvasWrap");
    var contactElement = document.getElementById("contact");
    var hasAnimated = false;

    window.addEventListener("scroll", function () {
        var productsGridRect = productsGridElement.getBoundingClientRect();
        var contactRect = contactElement.getBoundingClientRect();
        var windowHeight = window.innerHeight;

        if (!hasAnimated && productsGridRect.bottom >= windowHeight * 0.05 && productsGridRect.top <= windowHeight) {
            furnitureCanvasWrapElement.style.transition = "opacity 1s, z-index 0.8s";
            furnitureCanvasWrapElement.style.opacity = "0";
            furnitureCanvasWrapElement.style.zIndex = "-2";

            setTimeout(function () {
                furnitureCanvasWrapElement.style.transition = "opacity 1s, z-index 0.8s";
                furnitureCanvasWrapElement.style.opacity = "1";
            }, 500);

            hasAnimated = true;
        } else if (hasAnimated && (productsGridRect.bottom < windowHeight * 0.1 || productsGridRect.top > windowHeight)) {
            furnitureCanvasWrapElement.style.transition = "opacity 1s, z-index 0.8s";
            furnitureCanvasWrapElement.style.opacity = "1";
            furnitureCanvasWrapElement.style.zIndex = "";
            hasAnimated = false;
        }

        if (contactRect.top <= windowHeight && contactRect.bottom >= 0) {
            furnitureCanvasWrapElement.style.transition = "opacity 1s, z-index 0.8s";
            furnitureCanvasWrapElement.style.opacity = "0";
            furnitureCanvasWrapElement.style.zIndex = "-2";
        } else {
        }
    });
});





