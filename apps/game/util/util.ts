import levenshtein from 'js-levenshtein'

export const genRandomIndex = (length) => {
    return Math.floor(Math.random() * length)
}

export const removeFromArr = (arr, item) => {
    return arr.filter(it => it != item)
}

export const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}

// Close enough function that allows similar but not equal answers that mean the same thing
export const closeEnough = (arg1: string, arg2: string) => {
    console.log("Answers: ", arg1, arg2)
    let distance = levenshtein(arg1, arg2)
    let similarity = 1 - (distance / Math.max(arg1.length, arg2.length))
    console.log("Similarity: ", similarity)
    return similarity > 0.7
}