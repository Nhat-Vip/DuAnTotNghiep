let list = document.querySelector(".ImageSlider .ListImage");
let items = document.querySelectorAll(".ImageSlider .ListImage .item");
let dots = document.querySelectorAll(".ImageSlider .dots li");
let prev = document.getElementById("prev");
let next = document.getElementById("next");

let active = 0;
let lenghtItem = items.length - 1;

next.onclick = function () {
    if (active + 1 > lenghtItem) {
        active = 0;
    }
    else {
        active += 1;
    }
    reloadSlider();
}
prev.onclick = function(){
    if (active - 1 < 0) {
        active = lenghtItem;
    }
    else {
        active -= 1;
    }
    reloadSlider();
}

let refreshSLider = setInterval(()=>{
    next.click()},3000
);

function reloadSlider() {
    let checkLeft = items[active].offsetLeft;
    list.style.left = - checkLeft + "px";
    let lastActiveDot = document.querySelector(".ImageSlider .dots li.active");
    lastActiveDot.classList.remove("active");
    dots[active].classList.add("active");

    clearInterval(refreshSLider);
    let refreshSLider = setInterval(()=>{
        next.click()},3000
    );
}
dots.forEach((li,key)=>{
    li.addEventListener('click',function(){
        active = key;
        reloadSlider();
    })
})

