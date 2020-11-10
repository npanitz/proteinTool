const delay = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('A')
            resolve();
        }, 1000)
    });
};

const main = () => {
    console.log('C');
    // delay().then(() => { console.log('B') });
    delayWithCallback(() => {
        console.log('B');
    })
    console.log('D');
};


const delayWithCallback = (callBack) => {
    setTimeout(() => {
        console.log('A');
        callBack();
    }, 1000)
    console.log('F');
}

main();
console.log('E');