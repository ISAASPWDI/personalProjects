export function ageCalculator() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-age-calculator')) {
            const $inputValues = document.querySelectorAll('.age-inputs-value');
            const today = new Date();
            const birthDate = new Date($inputValues[2].value, $inputValues[1].value - 1, $inputValues[0].value);

            let year = today.getFullYear() - birthDate.getFullYear();
            let month = today.getMonth() - birthDate.getMonth();
            let day = today.getDate() - birthDate.getDate();

            if (day < 0) {
                month--;
                const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                day += previousMonth;
            }

            if (month < 0) {
                year--;
                month += 12;
            }
            if (Array.prototype.every.call($inputValues, (inputValue) => inputValue.value !== '')) {
                const $ageResults = document.querySelectorAll('.age-results');
                const dayNumber = Number($inputValues[0].value);
                const monthNumber = Number($inputValues[1].value);
                const yearNumber = Number($inputValues[2].value);

                let verfInputValue = [];
                $inputValues.forEach((inputValue) => {
                    if (inputValue.value !== '') {
                        verfInputValue.push(true);
                    }
                });
                const inputsTrue = verfInputValue.filter((el) => {
                    return el === true;
                });


                let isValidDay = dayNumber >= 1 && dayNumber <= getMaxDaysInMonth(yearNumber, monthNumber - 1);
                let isValidMonth = monthNumber >= 1 && monthNumber <= 12;
                let isValidYear = yearNumber <= today.getFullYear() && yearNumber >= today.getFullYear() - 100;
                
                let isValid = isValidDay && isValidMonth && isValidYear;
                
                if (!isValidDay) {
                    if (!$inputValues[0].nextElementSibling) {
                        showError('day', 'Must be a valid day');
                    }
                }
                
                if (!isValidMonth) {
                    if (!$inputValues[1].nextElementSibling) {
                        showError('month', 'Must be a valid month');
                    }
                }
                
                if (!isValidYear) {
                    if (!$inputValues[2].nextElementSibling) {
                        showError('year', 'Must be in the past');
                    }
                }
                
                if (isValid && inputsTrue.length === 3) {
                    $ageResults[0].textContent = year;
                    $ageResults[1].textContent = month;
                    $ageResults[2].textContent = day;
                } else {
                    $ageResults[0].textContent = '--';
                    $ageResults[1].textContent = '--';
                    $ageResults[2].textContent = '--';
                }
            }

            function getMaxDaysInMonth(year, month) {
                return new Date(year, month, 0).getDate();
            }

            function showError(inputId, errorMessage) {

                const $input = document.getElementById(inputId);
                const $parr = document.createElement('p');
                $parr.textContent = `🔔 ${errorMessage}`;
                $parr.style.fontSize = '12px';
                $parr.classList.add('error-form', 'text-center');
                $input.insertAdjacentElement('afterend', $parr);
                $inputValues.forEach((inputValue) => {
                    const $prevInputValueEl = inputValue.previousElementSibling;
                    if (inputValue.value !== '') {
                        $prevInputValueEl.style.color = 'rgb(214, 51, 43)';
                        inputValue.classList.add('calculate-form-border');
                    }

                });

            }

            if (Array.prototype.some.call($inputValues, (inputValue) => inputValue.value === '')) {

                const $fragment = document.createDocumentFragment();
                $inputValues.forEach((inputValue) => {
                    if (inputValue.value === '') {
                        const $verfNextEl = inputValue.nextElementSibling;
                        if (!$verfNextEl) {
                            const $prevInputValueEl = inputValue.previousElementSibling;
                            $prevInputValueEl.style.color = 'rgb(214, 51, 43)';
                            inputValue.classList.add('calculate-form-border');
                            const $parr = document.createElement('p');
                            $parr.textContent = '🔔 This field is required';
                            $parr.style.fontSize = '12px';
                            $parr.style.marginBottom = '0px';
                            $parr.classList.add('error-form', 'text-center');

                            $fragment.appendChild($parr);
                            inputValue.insertAdjacentElement('afterend', $fragment.firstElementChild);
                        }

                    }

                });
            }

        }

    });
    document.addEventListener('focusout', (e) => {
        if (e.target.classList.contains('age-inputs-value')) {
            const $inputValues = document.querySelectorAll('.age-inputs-value');
            
            $inputValues.forEach((inputValue) => {

                        const $prevInputValueEl = inputValue.previousElementSibling;
                        $prevInputValueEl.style.color = '';
                        inputValue.classList.remove('calculate-form-border');
                        const $nextInputValueEl = inputValue.nextElementSibling;
                        if ($nextInputValueEl) {
                            $nextInputValueEl.remove();
                        }
            });
        }
    });
}

