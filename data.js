// VARIABLES
const alphaErr = 'containts one or more forbidden character(s)';
const lengthErr = 'must be between';

// ARRAYS
const navLinks = [
    { 
        id: 0,
        href: '/',
        text: 'Home',
        imgPath: null,
        txtClr: null
    },
    {
        id: 1,
        href: '/games',
        text: 'Games',
        imgPath: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/basic-page-files/bg1.jpg)',
        txtClr: '#000'
    },
    {
        id: 2,
        href: '/genres',
        text: 'Genres',
        imgPath: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/basic-page-files/bg3.jpg)',
        txtClr: '#fff'
    },
    {
        id: 3,
        href: '/developers',
        text: 'Developers',
        imgPath: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/basic-page-files/bg2.jpg)',
        txtClr: '#fff'
    }
];

const sortInputArr = [
    {
        id: 'ascending',
        name: "sort",
        value: 1,
        text: "Ascending"
    },
    {
        id: 'decending',
        name: "sort",
        value: -1,
        text: "Descending"
    }
];

const alphabetArray = [
    {
        id: 0,
        name: 'A'
    },
    {
        id: 1,
        name: 'B'
    },
    {
        id: 2,
        name: 'C'
    },
    {
        id: 3,
        name: 'D'
    },
    {
        id: 4,
        name: 'E'
    },
    {
        id: 5,
        name: 'F'
    },
    {
        id: 6,
        name: 'G'
    },
    {
        id: 7,
        name: 'H'
    },
    {
        id: 8,
        name: 'I'
    },
    {
        id: 9,
        name: 'J'
    },
    {
        id: 10,
        name: 'K'
    },
    {
        id: 11,
        name: 'L'
    },
    {
        id: 12,
        name: 'L'
    },
    {
        id: 13,
        name: 'M'
    },
    {
        id: 14,
        name: 'N'
    },
    {
        id: 15,
        name: 'O'
    },
    {
        id: 16,
        name: 'P'
    },
    {
        id: 17,
        name: 'Q'
    },
    {
        id: 18,
        name: 'R'
    },
    {
        id: 19,
        name: 'S'
    },
    {
        id: 20,
        name: 'T'
    },
    {
        id: 21,
        name: 'U'
    },
    {
        id: 22,
        name: 'V'
    },
    {
        id: 23,
        name: 'W'
    },
    {
        id: 24,
        name: 'X'
    },
    {
        id: 25,
        name: 'Y'
    },
    {
        id: 26,
        name: 'Z'
    },
];

const priceArray = [
    {
        id: 0,
        name: 'Price',
        value: 'NaN'
    },
    {
        id: 1,
        name: 'Price',
        value: '0 - 9'
    },
    {
        id: 2,
        name: 'Price',
        value: '10 - 19'
    },
    {
        id: 3,
        name: 'Price',
        value: '20 - 29'
    },
    {
        id: 4,
        name: 'Price',
        value: '30 - 39'
    },
    {
        id: 5,
        name: 'Price',
        value: '40 - 49'
    },
    {
        id: 6,
        name: 'Price',
        value: '50 - 59'
    },
    {
        id: 7,
        name: 'Price',
        value: '60 - 69'
    },
    {
        id: 8,
        name: 'Price',
        value: '70 - 79'
    },
    {
        id: 9,
        name: 'Price',
        value: '80 - 89'
    },
    {
        id: 10,
        name: 'Price',
        value: '90 - 99'
    },
];

const ratingArray = [
    {
        id: 0,
        name: 'null'
    },
    {
        id: 1,
        name: '0'
    },
    {
        id: 2,
        name: '1'
    },
    {
        id: 3,
        name: '2'
    },
    {
        id: 4,
        name: '3'
    },
    {
        id: 5,
        name: '4'
    },
    {
        id: 6,
        name: '5'
    },
    {
        id: 7,
        name: '6'
    },
    {
        id: 8,
        name: '7'
    },
    {
        id: 9,
        name: '8'
    },
    {
        id: 10,
        name: '9'
    },
    {
        id: 11,
        name: '10'
    },
];

module.exports = {
    alphabetArray,
    sortInputArr,
    priceArray,
    ratingArray,
    navLinks,
    alphaErr,
    lengthErr,
};