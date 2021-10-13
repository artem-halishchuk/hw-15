class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceTo(point) {
        let dx = point.x - this.x;
        let dy = point.y - this.y;
        return Math.sqrt((dx*dx)+(dy*dy));
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
}
class Circle {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }
    containsPoint(point) {
        return this.center.distanceTo(point) < this.radius;
    }
}
let dragTarget = null;
let pizza;

function getPizzaCircle() {
    let rect = pizza.getBoundingClientRect();
    let cx = rect.left + rect.width/2;
    let cy = rect.top + rect.height/2;
    let center = new Point(cx, cy);
    return new Circle(center, rect.width/2)
}

function setDragTargetPos(point) {
    let rect = dragTarget.getBoundingClientRect();
    point.move(-rect.width/2, -rect.height/2);
    dragTarget.style.left = point.x+'px';
    dragTarget.style.top = point.y+'px';
}
function getPosOnPizza(mousePos) {
    let rect = pizza.getBoundingClientRect();
    return new Point(mousePos.x - rect.left, mousePos.y - rect.top);
}
function activeComponents(e) {
    if (e.value === "0") {
        document.querySelector('.constructor__components').style.filter = 'grayscale(100%)';
        document.querySelector('.constructor-sauces__form').style.filter = 'grayscale(100%)';
        return true;
    }
    else {
        document.querySelector('.constructor__components').style.filter = 'grayscale(0%)';
        document.querySelector('.constructor-sauces__form').style.filter = 'grayscale(0%)';
        return false;
    }
}
function activeSubmit() {
    if (!document.querySelector('.constructor-pizza__list > li')) {
        document.querySelector('.constructor-sauces__form').childNodes.forEach(e => e.disabled = true);
        document.querySelector('.calculator-form__submit').disabled = true;
        return true;
    }
    else {
        document.querySelector('.constructor-sauces__form').childNodes.forEach(e => e.disabled = false);
        document.querySelector('.calculator-form__submit').disabled = false;
        return false;
    }
}
let arrPrice = [];
function price(event) {
    let priceList = document.querySelector('.calculator-form__list');
    let pizzaComponents = document.querySelector('.constructor-pizza__list');
    let sauces = document.querySelector('.constructor-sauces__form');

    arrPrice = [];
    if (!arrPrice.length) arrPrice.push({name: 'Тесто', price: 20, number: 1, index: arrPrice.length});

    pizzaComponents.childNodes.forEach(e => {
        let elementPizza = e;
        let search = arrPrice.find(e => e.name === elementPizza.dataset.name);
        if (!search) arrPrice.push({
            name: elementPizza.dataset.name,
            price: parseFloat(elementPizza.dataset.price),
            number: 1,
            index: arrPrice.length
        });
        else arrPrice[search.index].number += 1;
    });

    sauces.childNodes.forEach(e => {
        let elementSauces = e;
        if(elementSauces.nodeType === 1 && elementSauces.matches('input')) {
            if(!elementSauces.checked) return;
            let search = arrPrice.find(e => e.name === elementSauces.dataset.name);
            if (!search) arrPrice.push({
                name: elementSauces.dataset.name,
                price: parseFloat(elementSauces.dataset.price),
                number: 1,
                index: arrPrice.length
            });
            else arrPrice[search.index].number += 1;
        }
    });
    console.log(arrPrice);
}

document.addEventListener('DOMContentLoaded', () => {
    let sauces = document.querySelector('.constructor-sauces__form');
    pizza = document.querySelector('.constructor-pizza__list');
    //console.log(getPizzaCircle());
    activeComponents(document.querySelector('.calculator-form__size'));
    document.querySelector('.calculator-form__size').addEventListener('click', e => {
        activeComponents(e.target);
    })


    window.addEventListener('mousedown', e => {
        if (document.querySelector('.calculator-form__size').value === "0") {
            //alert('Выберете размер пиццы');
            return;
        }

        let mousePoint = new Point(e.clientX, e.clientY);

        if (e.target.matches('.constructor-components__item')) {
            dragTarget = e.target.cloneNode(true);
            dragTarget.style.position = 'fixed';
            //document.body.append(dragTarget);
            pizza.append(dragTarget);
            setDragTargetPos(mousePoint);
            
        }
        if (e.target.matches('.constructor-pizza__list > .constructor-components__item-pizza')) {
            dragTarget = e.target.cloneNode(true);
            e.target.remove();
            dragTarget.style.position = 'fixed';
            //document.body.append(dragTarget);
            pizza.append(dragTarget);
            setDragTargetPos(mousePoint);
        }
    })
    window.addEventListener('mousemove', e => {
        let mousePoint = new Point(e.clientX, e.clientY);
        if (dragTarget) {
            setDragTargetPos(mousePoint);
            pizza.append(dragTarget);
        }
    })
    window.addEventListener('mouseup', e => {
        if (dragTarget) {
            let pizzaCircle = getPizzaCircle();
            let mousePos = new Point(e.clientX, e.clientY);

            if(pizzaCircle.containsPoint(mousePos)) {
                let newPos = getPosOnPizza(mousePos);
                //console.log(newPos);
                setDragTargetPos(newPos);
                pizza.append(dragTarget);

                dragTarget.style.position = 'absolute';
                dragTarget.classList.replace('constructor-components__item', 'constructor-components__item-pizza');
                dragTarget = null;
            }
            else {
                dragTarget.remove();
                dragTarget = null;
            }
            activeSubmit();
            price();
        }
    })
    sauces.addEventListener('click', e => {
        if (document.querySelector('.calculator-form__size').value === "0") return;
        if(e.target.matches('input')) price(event.target);
    })

    
})
