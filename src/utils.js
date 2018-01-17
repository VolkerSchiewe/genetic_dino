export function indexOfMaxValue(array) {
    return array.reduce(function (indexOfMax, element, index, array) {
        return element > array[indexOfMax] ? index : indexOfMax
    }, 0);
}

export function range(length) {
    let list = [];
    for (let i = 0; i < length; i++) {
        list.push(i);
    }
    return list
}
