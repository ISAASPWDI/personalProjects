import {hammer} from  "./rotate-hammer.js";
import { formValidate } from "./form-validation.js";
import { activeStates} from "./mortgage-calculator.js";
import { ageCalculator } from "./age-calculator.js";
import { uploader } from "./uploader.js";
import { toDoList } from "./to-do-list.js";
import { productList } from "./product-list-cart.js";
import { ApiFunction } from "./creating-api.js";


document.addEventListener("DOMContentLoaded",()=>{
    hammer();
    formValidate();
    activeStates();
    ageCalculator();
    uploader();
    toDoList();
    productList();
    ApiFunction();
});

