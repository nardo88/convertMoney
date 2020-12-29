document.addEventListener('DOMContentLoaded', () => {
   'use strict';

    const input = document.querySelector('.main__input'),
        result = document.querySelector('.main__result'),
        mainHave = document.querySelector('.main__have'),
        mainNeed = document.querySelector('.main__need'),
        reverse = document.querySelector('.main__reverse');

    let have = 'RUB',
        need = 'RUB';
    let indexEUR;
    let indexUSD;
    let indexEURforUSD;
    let indexUSDforEUR;

    const debounce = (fn, ms) => {
        let timeOut;
        return function () {
            const fnCall = () => fn.apply(null, arguments);
            clearTimeout(timeOut);
            timeOut = setTimeout(fnCall, ms)
        };
    }

    const getUER = () => {
        fetch('https://api.exchangeratesapi.io/latest?base=EUR')
            .then(response => response.json())
            .then(data => {
                indexEUR = data.rates.RUB;
                indexEURforUSD = data.rates.USD
            })
    }
    const getUSD = () => {
        fetch('https://api.exchangeratesapi.io/latest?base=USD')
            .then(response => response.json())
            .then(data => {
                indexUSD = data.rates.RUB;
                indexUSDforEUR = data.rates.EUR;
            })
    }

    getUER()
    getUSD()
    
   
    function showRezult() {
        
        input.value = input.value.replace(/\D/gi, '')
        if (have === "RUB"){
            switch(need){
                case 'EUR':
                    result.textContent = (+input.value / indexEUR).toFixed(2);
                    break;
                case 'RUB':
                    result.textContent = +input.value
                    break;
                case 'USD':
                    result.textContent = (+input.value / indexUSD).toFixed(2);
            }
        }
        if (have === "EUR"){
            switch(need){
                case 'EUR':
                    result.textContent = +input.value
                    break;
                case 'RUB':
                    result.textContent = (+input.value * indexEUR).toFixed(2)
                    break;
                case 'USD':
                    result.textContent = (+input.value * indexEURforUSD).toFixed(2);
            }
        }
        if (have === "USD"){
            switch(need){
                case 'EUR':
                    result.textContent = (+input.value * indexUSDforEUR).toFixed(2)
                    break;
                case 'RUB':
                    result.textContent = (+input.value * indexUSD).toFixed(2)
                    break;
                case 'USD':
                    result.textContent = +input.value 
            }
        }
    }

    function changeValute(e){
        const target = e.target;
        [...target.parentElement.children].forEach(item => {
           item.classList.remove('active')
       })
       target.classList.add('active');
       if(target.parentElement.classList.contains('main__have')){
            have = target.dataset.valute
       } else if (target.parentElement.classList.contains('main__need')){
            need = target.dataset.valute
       }
       showRezult()
    }

    mainHave.addEventListener('click', changeValute)
    mainNeed.addEventListener('click', changeValute)

    reverse.addEventListener('click', () => {
        [have, need] = [need, have];
        showRezult();
        let newHave = '';
        let newNeed = '';

        [...mainHave.children].forEach(item => {
            if (item.classList.contains('active')){
                newNeed = item.dataset.valute
            }
        });

        [...mainNeed.children].forEach(item => {
            if (item.classList.contains('active')){
                newHave = item.dataset.valute
            }
        });

        [...mainNeed.children].forEach(elem => {
            elem.classList.remove('active');
                if(elem.dataset.valute === newNeed){
                    elem.classList.add('active')
                }
       });

       [...mainHave.children].forEach(elem => {
            elem.classList.remove('active');
                if(elem.dataset.valute === newHave){
                    elem.classList.add('active')
                }
            })
    })
    
    showRezult = debounce(showRezult, 300)

    input.addEventListener('input', showRezult)

})