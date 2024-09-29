
let countOfDivsYourResultsCreated = false;

export function activeStates() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('form-calculate-style')) {
            const $inputGroup = e.target.closest('.input-group');
            $inputGroup.classList.add('active');
            const $span = $inputGroup.querySelector('.input-group-text');
            $span.style.backgroundColor = 'rgb(217, 219, 48)';
        }

        if (e.target.classList.contains('form-check-input') && e.target.type === 'radio') {
            const $formChecks = document.querySelectorAll('.form-check');
            $formChecks.forEach((formCheck) => {
                formCheck.classList.remove('active');
            });
            const $formCheck = e.target.closest('.form-check');
            $formCheck.classList.add('active');
            const existingRadioError = document.querySelector('.mortgage-type + .div-style');
            if (existingRadioError) {
                existingRadioError.remove();
            }
        }
        if (e.target.classList.contains('calculate-repay')) {

            const $formControls = document.querySelectorAll('.form-calculate-style');

            $formControls.forEach((formControl) => {
                const $inputGroup = formControl.closest('.input-group');
                const existingError = $inputGroup.nextElementSibling;

                if (formControl.value === '') {
                    if (!existingError || !existingError.classList.contains('div-style')) {
                        const $parrDiv = document.createElement("div");
                        const $parr = document.createElement("p");
                        $parr.textContent = "🔔 This field is required";
                        $parr.classList.add("error-form");
                        $parrDiv.classList.add("div-style");

                        const $span = $inputGroup.querySelector('.input-group-text');
                        $span.style.backgroundColor = 'rgb(214, 51, 43)';
                        $span.style.color = 'rgb(255,255,255)';

                        $inputGroup.classList.add('calculate-form-border');
                        $inputGroup.classList.add("style-error-form");

                        $inputGroup.insertAdjacentElement("afterend", $parrDiv);
                        $parrDiv.insertAdjacentElement("afterbegin", $parr);
                    }
                } else if (existingError && existingError.classList.contains('div-style')) {
                    existingError.remove();
                    $inputGroup.classList.remove("style-error-form");
                    $inputGroup.classList.remove('calculate-form-border');

                    const $span = $inputGroup.querySelector('.input-group-text');
                    $span.style.backgroundColor = 'rgb(227, 244, 252)';
                    $span.style.color = 'rgb(86, 113, 126)';
                }
            });

            const $formChecks = document.querySelectorAll('.form-check');
            const aux = [];

            $formChecks.forEach((formCheck) => {
                let verf = formCheck.classList.contains('active');
                aux.push(verf);
            });

            const existingRadioError = document.querySelector('.mortgage-type + .div-style');
            if (!aux.includes(true)) {
                if (!existingRadioError) {
                    const $parrDiv = document.createElement("div");
                    const $parr = document.createElement("p");
                    $parr.textContent = "🔔 This field is required";
                    $parr.classList.add("error-form");
                    $parrDiv.classList.add("div-style");
                    document.querySelector('.mortgage-type').insertAdjacentElement('afterend', $parrDiv);
                    $parrDiv.insertAdjacentElement("afterbegin", $parr);
                }
            }

            if (Array.prototype.every.call($formControls, formControl => formControl.value !== '') && Array.prototype.some.call($formChecks, formCheck => formCheck.classList.contains('active'))) {
                let regexp,
                    pattern,
                    objForm = [];
                $formControls.forEach((formControl) => {
                    pattern = formControl.pattern;
                    regexp = new RegExp(pattern);
                    formControl.value = formControl.value.trim();
                    objForm.push({
                        id: formControl.id,
                        boolean: regexp.test(formControl.value),
                        value: formControl.value
                    });
                });
                const truePattern = objForm.filter((el) => {
                    return el.boolean === true;
                });
                const falsePattern = objForm.filter((el) => {
                    return el.boolean === false;
                });

                for (const el of falsePattern) {

                    const $formControl = document.getElementById(el.id);
                    const $inputGroup = $formControl.closest('.input-group');
                    const $parrDiv = document.createElement("div");
                    const $parr = document.createElement("p");

                    if (el.id === 'amount') {
                        $parr.textContent = '🔔 Write a correct number';
                    } else {
                        $parr.innerHTML = "🔔 Write a correct<br><span class='span-style-lg'>number</span>";
                    }

                    $parr.classList.add("error-form");
                    $parr.style.width = '100%';
                    $parrDiv.classList.add("div-style");
                    const $span = $inputGroup.querySelector('.input-group-text');
                    $span.style.backgroundColor = 'rgb(214, 51, 43)';
                    $span.style.color = 'rgb(255,255,255)';
                    $inputGroup.classList.add("style-error-form");
                    $inputGroup.classList.add('calculate-form-border');
                    $inputGroup.insertAdjacentElement("afterend", $parrDiv);
                    $parrDiv.insertAdjacentElement("afterbegin", $parr);

                }


                if (truePattern.length === 3) {
                    let amount = truePattern[0].value,
                        term = truePattern[1].value * 12,
                        interest = truePattern[2].value / 1200,
                        monthlyRepay = (amount * interest * Math.pow(1 + interest, term)) / (Math.pow(1 + interest, term) - 1);
                        let totalRepay = monthlyRepay * term;
                        let totalInterest = totalRepay - amount;


                    const setComa = (arg) =>{
                        let rounded = Math.floor(arg),
                            formatted = rounded.toLocaleString() + '.' + arg.toFixed(2).split('.')[1];
                        return formatted;
                    }
                    if (!countOfDivsYourResultsCreated) {
                        const fragment = document.createDocumentFragment();

                        const $results = document.querySelector('.results');
                        $results.classList.add('row', 'p-3');

                        const $divResults = document.querySelector('.div-results');
                        $divResults.classList.add('d-none');

                        const $divYourResults = document.createElement('div');
                        $divYourResults.classList.add('col-12', 'your-results-animation');
                        fragment.appendChild($divYourResults);

                        const $divInfoYourResults = document.createElement('div');
                        $divInfoYourResults.classList.add('mb-4');
                        $divYourResults.appendChild($divInfoYourResults);

                        const $h3YourResults = document.createElement('h3');
                        $h3YourResults.textContent = 'Your results';
                        $h3YourResults.classList.add('mb-3');
                        $divInfoYourResults.appendChild($h3YourResults);

                        const $parrYourResults = document.createElement('p');
                        $parrYourResults.textContent = "Your results are shown below based on the information you provided. To adjust the results, edit the form and click 'calculate repayments' again.";
                        $divInfoYourResults.appendChild($parrYourResults);

                        const $divRepayments = document.createElement('div');
                        $divRepayments.classList.add('row', 'border-top', 'pt-4', 'your-results-style');
                        $divYourResults.appendChild($divRepayments);

                        const $divMonthRepay = document.createElement('div');
                        $divMonthRepay.classList.add('col-12');
                        $divRepayments.appendChild($divMonthRepay);

                        const $parrTextMonth = document.createElement('p');
                        if (document.querySelector('.form-check').classList.contains('active') && document.getElementById('repayment').id === 'repayment' ) {
                            $parrTextMonth.textContent = "Your monthly repayments"
                        } else{
                            $parrTextMonth.textContent = "Your interests"
                        }
                        // $parrTextMonth.textContent = "Your monthly repayments";
                        $parrTextMonth.classList.add('mb-2','indicator-one');
                        $divMonthRepay.appendChild($parrTextMonth);

                        const $parrMonthRepay = document.createElement('p');
                        $parrMonthRepay.classList.add('h4', 'parr-month-repay-style','indicator-two'); // Estilo para la cuota mensual
                        if (document.querySelector('.form-check').classList.contains('active') && document.getElementById('repayment').id === 'repayment' ) {
                            $parrMonthRepay.innerHTML = `${'$'.concat(setComa(monthlyRepay))}<hr>`;
                        $divMonthRepay.appendChild($parrMonthRepay);
                        } else{
                            $parrMonthRepay.innerHTML = `${'$'.concat(setComa(totalInterest))}<hr>`;
                            $divMonthRepay.appendChild($parrMonthRepay);
                        }
                        

                        const $divTotalRepay = document.createElement('div');
                        $divTotalRepay.classList.add('col-12');
                        $divRepayments.appendChild($divTotalRepay);

                        const $parrTextTotal = document.createElement('p');
                        $parrTextTotal.textContent = "Total you'll repay over the term";
                        $parrTextTotal.classList.add('mb-2');
                        $divTotalRepay.appendChild($parrTextTotal);

                        const $parrTotalRepay = document.createElement('p');
                        $parrTotalRepay.classList.add('h4', 'parr-total-style'); // Estilo para el monto total
                        $parrTotalRepay.textContent = '$'.concat(setComa(totalRepay));

                        $divTotalRepay.appendChild($parrTotalRepay);

                        $results.appendChild(fragment);
                        countOfDivsYourResultsCreated = true;
                    } else {
                        const $indicatorOne = document.querySelector('.indicator-one');
                        const $indicatorTwo = document.querySelector('.indicator-two');
                        if (document.querySelector('.form-check').classList.contains('active') && document.getElementById('repayment').id === 'repayment' ) {
                            $indicatorOne.textContent = "Your monthly repayments"
                        } else{
                            $indicatorOne.textContent = "Your interests"
                        }
                        
                        const $parrMonthRepay = document.querySelector('.parr-month-repay-style');
                        const $parrTotalRepay = document.querySelector('.parr-total-style');
                        $parrMonthRepay.classList.add('hide-parr');
                        $parrTotalRepay.classList.add('hide-parr');
                        $parrMonthRepay.innerHTML = `<p class="parr-month-repay-style">${'$'.concat(setComa(monthlyRepay))}</p> <hr>`;
                        $parrTotalRepay.textContent = '$'.concat(setComa(totalRepay));
                        $parrMonthRepay.classList.remove('hide-parr');
                        $parrTotalRepay.classList.remove('hide-parr');
                        if (document.querySelector('.form-check').classList.contains('active') && document.getElementById('repayment').id === 'repayment' ) {
                            $indicatorTwo.innerHTML = `${'$'.concat(setComa(monthlyRepay))}<hr>`;
                        } else{
                            $indicatorTwo.innerHTML = `${'$'.concat(setComa(totalInterest))}<hr>`;
                        }
                    }
                }


            }
        }
        if (e.target.type === 'button') {
            const $formControls = document.querySelectorAll('.form-calculate-style');
            $formControls.forEach((formControl) => {
                formControl.value = '';
            });
            const $calculateFormBorders = document.querySelectorAll('.calculate-form-border');
            $calculateFormBorders.forEach((calculateFormBorder) => {
                calculateFormBorder.classList.remove('calculate-form-border');
            });
            const $divStyles = document.querySelectorAll('.div-style');
            $divStyles.forEach((divStyle) => {
                divStyle.remove();
            });
            const $spans = document.querySelectorAll('.input-group-text');
            $spans.forEach((span) => {
                span.style.backgroundColor = 'rgb(227, 244, 252)';
                span.style.color = 'rgb(86, 113, 126)';
            });
            const $formChecks = document.querySelectorAll('.form-check');
            $formChecks.forEach((formCheck) => {
                formCheck.classList.remove('active');
            });
            const $formCheckInputs = document.querySelectorAll('.form-check-input');
            $formCheckInputs.forEach((formCheckInput) => {
                formCheckInput.classList.add('remove-check-input');
                formCheckInput.checked = false;
            });
        }

    });

    document.addEventListener('focusout', function (e) {
        if (e.target.classList.contains('form-calculate-style')) {
            const $inputGroup = e.target.closest('.input-group');
            $inputGroup.classList.remove('active');
            $inputGroup.classList.add('calculate-form-border');
            const $span = $inputGroup.querySelector('.input-group-text');
            $span.style.backgroundColor = 'rgb(227, 244, 252)';
            $span.style.color = 'rgb(86, 113, 126)';
            if (e.target.value === '') {

                const $parrError = $inputGroup.nextElementSibling;
                if (!$parrError || !$parrError.classList.contains('div-style')) {

                    const $parrDiv = document.createElement("div");
                    const $parr = document.createElement("p");

                    $parr.textContent = "🔔 This field is required";
                    $parr.classList.add("error-form");
                    $parrDiv.classList.add("div-style");
                    const $span = $inputGroup.querySelector('.input-group-text');
                    $span.style.backgroundColor = 'rgb(214, 51, 43)';
                    $span.style.color = 'rgb(255,255,255)';
                    $inputGroup.classList.add("style-error-form");

                    $inputGroup.insertAdjacentElement("afterend", $parrDiv);
                    $parrDiv.insertAdjacentElement("afterbegin", $parr);
                }
                const $span = $inputGroup.querySelector('.input-group-text');
                $span.style.backgroundColor = 'rgb(214, 51, 43)';
                $span.style.color = 'rgb(255,255,255)';

            } else {
                const $inputGroup = e.target.closest('.input-group');
                $inputGroup.classList.remove('calculate-form-border');
                const $parrError = $inputGroup.nextElementSibling;
                if ($parrError && $parrError.classList.contains('div-style')) {
                    $parrError.remove();
                    $inputGroup.classList.remove("style-error-form");
                }
            }
        }
    });

}

