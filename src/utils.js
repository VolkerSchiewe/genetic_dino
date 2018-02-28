// return the index of the maximum value in the given array
export function indexOfMaxValue(array) {
    return array.reduce(function (indexOfMax, element, index, array) {
        return element > array[indexOfMax] ? index : indexOfMax;
    }, 0);
}

// return an array with numbers from 0 to @length
export function range(length) {
    let list = [];
    for (let i = 0; i < length; i++) {
        list.push(i);
    }
    return list;
}

// open download dialog in browser
export function download(filename, content, data_type) {
    let element = document.createElement('a');
    element.setAttribute('href', data_type + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// round given number to a given precision
export function precisionRound(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

// return a random number between min and max
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}