import { MediaType, StudiableCardSideLabel } from 'dataset/types';
import levenshtein from 'js-levenshtein';

// genRandomIndex generates a random number between 0 and length.
export const genRandomIndex = length => {
  return Math.floor(Math.random() * length);
};

// removeFromArr removes an item from an array.
export const removeFromArr = (arr, item) => {
  return arr.filter(it => it != item);
};

// shuffleArray shuffles an array of elements.
export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

// closeEnough uses the levenshtein distance algorithm to accept words that
// are close enough to the actual answer.
export const closeEnough = (arg1: string, arg2: string) => {
  let distance = levenshtein(arg1, arg2);
  let similarity = 1 - distance / Math.max(arg1.length, arg2.length);
  return similarity > 0.7;
};

// getResponses gets the text responses from the quizletSet
export const getResponses = set => {
  let responses = [];
  for (let item of set.studiableItem) {
    for (let entry of item.cardSides) {
      const { label, media } = entry;
      if (label == StudiableCardSideLabel.WORD) {
        for (let med of media) {
          switch (med.type) {
            case MediaType.TEXT:
              responses.push(med.plainText);
          }
        }
      }
    }
  }

  return responses;
};

export interface Card {
  question: string;
  image: string;
  answer: string;
}

// extractCard returns a Card from the given studiableItem.
export const extractCard = (item): Card => {
  let question = '';
  let image = '';
  let answer = '';
  for (let entry of item.cardSides) {
    const { label, media } = entry;
    if (label == StudiableCardSideLabel.DEFINITION) {
      for (let med of media) {
        switch (med.type) {
          case MediaType.TEXT:
            question = med.plainText;
          case MediaType.IMAGE:
            image = med.url;
        }
      }
    } else if (label == StudiableCardSideLabel.WORD) {
      for (let med of media) {
        switch (med.type) {
          case MediaType.TEXT:
            answer = med.plainText;
        }
      }
    }
  }

  return {
    question,
    image,
    answer,
  };
};

// genPossibleAnswers takes the possible responses and generates three other
// random responses.
export const genPossibleAnswers = (allResponses, answer) => {
  let answers = [];
  for (let i = 0; i < 3; i++) {
    let randomChoice = allResponses[genRandomIndex(allResponses.length)];
    if (allResponses.length > 3) {
      while (randomChoice == answer || answers.includes(randomChoice)) {
        randomChoice = allResponses[genRandomIndex(allResponses.length)];
      }

      answers.push(randomChoice);
    } else {
      answers.push('Choice ' + i);
    }
  }
  answers.push(answer);
  return answers;
};

// getRandomFromArr is a utility that retrieves a random element from an array.
export const getRandomFromArr = (arr: any[]) => {
  return arr[genRandomIndex(arr.length)];
};
