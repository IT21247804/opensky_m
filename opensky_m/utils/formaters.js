export const currencyFormat = (val) => {
    return (val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
}

export const leadZeros = (val, length) => {
    return (val.toString().padStart(length, '0'))
}