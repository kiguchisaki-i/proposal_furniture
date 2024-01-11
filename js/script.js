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


/* parallax */
const targets = document.querySelectorAll(".parallax");
targets.forEach((target) => {
    gsap.fromTo(
        target.querySelector("img"),
        {
            y: 0,
            scale: 1.3,
        },
        {
            y: -60,
            scale: 1, 
            ease: "none",
            scrollTrigger: {
                trigger: target,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                // markers: true,
            },
        }
    );
});
