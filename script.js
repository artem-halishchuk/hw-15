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
        document.querySelector('.calculator-form__submit').disabled = true;
        document.querySelector('.constructor__components').style.filter = 'grayscale(100%)';
    }
    else {
        document.querySelector('.calculator-form__submit').disabled = false;
        document.querySelector('.constructor__components').style.filter = 'grayscale(0%)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    pizza = document.querySelector('.pizza');
    console.log(getPizzaCircle());
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
        if (e.target.matches('.x')) {
            dragTarget = e.target.cloneNode(true);
            dragTarget.style.position = 'fixed';
            document.body.append(dragTarget);
            setDragTargetPos(mousePoint);
        }
    })
    window.addEventListener('mousemove', e => {
        let mousePoint = new Point(e.clientX, e.clientY);
        if (dragTarget) {
            setDragTargetPos(mousePoint);
        }
    })
    window.addEventListener('mouseup', e => {
        if (dragTarget) {
            let pizzaCircle = getPizzaCircle();
            let mousePos = new Point(e.clientX, e.clientY);

            if(pizzaCircle.containsPoint(mousePos)) {
                let newPos = getPosOnPizza(mousePos);
                console.log(newPos);
                setDragTargetPos(newPos);
                pizza.append(dragTarget);

                dragTarget.style.position = 'absolute';
                dragTarget.classList.replace('x', 'y');
                dragTarget = null;
            }
            else {
                dragTarget.remove();
                dragTarget = null;
            }
        }
    })
})
