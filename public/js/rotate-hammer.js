const $imgHammer = document.querySelector(".navbar-brand img"),
    $firstBtn = document.querySelector(".btn1"),
    $secondBtn = document.querySelector(".btn2"),
    $thirdBtn = document.querySelector(".btn3"),
    $stopBtn = document.querySelector(".btn4");

function removeDisabled(){

    $firstBtn.classList.remove("disabled");
    $firstBtn.classList.remove("btn-disabled");

    $secondBtn.classList.remove("disabled");
    $secondBtn.classList.remove("btn-disabled");

    $thirdBtn.classList.remove("disabled");
    $thirdBtn.classList.remove("btn-disabled");


}
function firstBtnDisabled () {
    $firstBtn.classList.add("disabled");
    $firstBtn.classList.add("btn-disabled");
}

function secondBtnDisabled() {
    $secondBtn.classList.add("disabled");
    $secondBtn.classList.add("btn-disabled");
}

function thirdBtnDisabled() {
    $thirdBtn.classList.add("disabled");
    $thirdBtn.classList.add("btn-disabled");
}
function stopBtnDisabled() {
    $firstBtn.classList.remove("focus-style"); 
    $secondBtn.classList.remove("focus-style"); 
    $thirdBtn.classList.remove("focus-style"); 
}


export function hammer() {
    document.addEventListener("click", (e) => {

        if (e.target === $firstBtn) {
            $imgHammer.classList.toggle("hammer-rotate-slow");
            if ($imgHammer.classList.contains("hammer-rotate-slow")) {
                $firstBtn.classList.add("focus-style");
                secondBtnDisabled();
                thirdBtnDisabled();
            } else {
                $firstBtn.classList.remove("focus-style");         
                removeDisabled();                
            }

        }
        if (e.target === $secondBtn) {
            $imgHammer.classList.toggle("hammer-rotate-medium");
            if ($imgHammer.classList.contains("hammer-rotate-medium")) {
                $secondBtn.classList.add("focus-style");
                firstBtnDisabled();
                thirdBtnDisabled();
            } else {
                $secondBtn.classList.remove("focus-style"); 
                removeDisabled();
            }
        }
        if (e.target === $thirdBtn) {
            $imgHammer.classList.toggle("hammer-rotate-fast");
            if ($imgHammer.classList.contains("hammer-rotate-fast")) {
                $thirdBtn.classList.add("focus-style");
                firstBtnDisabled();
                secondBtnDisabled();
            } else {
                $thirdBtn.classList.remove("focus-style"); 
                removeDisabled();
            }
        }
        if (e.target === $stopBtn) {
            $imgHammer.classList.remove("hammer-rotate-slow");
            $imgHammer.classList.remove("hammer-rotate-medium");
            $imgHammer.classList.remove("hammer-rotate-fast");
            stopBtnDisabled();
            removeDisabled();
        }
    });
}


