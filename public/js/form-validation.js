
export function formValidate() {
    document.addEventListener("keyup", (e) => {
        let pattern = e.target.pattern || e.target.dataset.pattern;
        let $inputElement = document.getElementById(e.target.name);
        if (!$inputElement) {
            return;
        }
        let existingError = $inputElement.nextElementSibling;

            

        if (pattern && e.target.value !== "") {
            let regexp = new RegExp(pattern);

            if (!regexp.test(e.target.value)) {
                $inputElement.classList.remove("contact-form-valid");
                $inputElement.classList.add("contact-form-invalid");

                if (!existingError) {
                    const $pInfo = document.createElement("p");
                    $pInfo.textContent = e.target.title;
                    $pInfo.classList.add("text-form-invalid");
                    e.target.insertAdjacentElement("afterend", $pInfo);
                }
            } else {
                $inputElement.classList.add("contact-form-valid");
                $inputElement.classList.remove("contact-form-invalid");

                if (existingError) existingError.remove();
            }
        }

        if (e.target.value === "") {
            $inputElement.classList.remove("contact-form-valid");
            $inputElement.classList.remove("contact-form-invalid");

            if (existingError && existingError.classList.contains("text-form-invalid")) existingError.remove();
        }
    });

}