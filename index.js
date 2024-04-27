



// Function to generate random number between 0 and 1
function getRandomNumber() {
    console.log(Math.random());
    return Math.random();
}


function letsPredict() {
    return getRandomNumber() < 0.5 ? 'Heads' : 'Tails';
}

// Main function to run the program
function main() {
    const result = letsPredict();
    console.log('Coin flip result:', result);
}

// Call the main function
main();