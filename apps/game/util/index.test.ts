import {
  closeEnough,
  extractCard,
  genRandomIndex,
  getRandomFromArr,
  getResponses,
  removeFromArr,
  shuffleArray,
} from './index';
import Fun from 'dataset/sets/Fun';

test('properly generates random index for a given length', () => {
  let length = 5;
  let randomIndex = genRandomIndex(length);
  expect(randomIndex).toBeLessThan(length);
  expect(randomIndex).toBeGreaterThanOrEqual(0);
});

test('properly removes element from array', () => {
  let arr = ['hello', 'test'];
  expect(removeFromArr(arr, 'hello')).toMatchObject(['test']);
});

test('properly returns true when words are close enough to eachother', () => {
  expect(closeEnough('hello', 'hello.')).toBeTruthy();
  expect(closeEnough('hello', 'hellfather')).toBeFalsy();
});

test('properly gets random element from array', () => {
  let arr = ['hello', 'from', 'the', 'other', 'side'];
  expect(arr.includes(getRandomFromArr(arr))).toBeTruthy();
});

test('properly gets responses for quizlet set', () => {
  const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();
  let result = getResponses(quizletSet);
  expect(result).toMatchObject([
    'Woody',
    'Beauty and the Beast',
    'Tinker Bell',
    'Mushu',
    'Snow White',
    'Walt Disney',
    'Rapunzel',
    'Ariel',
    'Cinderella',
    'Mr. Incredible',
    'Alice',
    'Belle',
    'Nemo',
    'Bambi',
    'Simba',
    'Captain Hook',
    'Dumbo',
    'Peter Pan',
    'Pinocchio',
    'Mike Wazowski',
    '101 Dalmations',
    'Mowgli',
  ]);
});

test('properly extracts cards from quizlet set', () => {
  const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();
  let result = extractCard(quizletSet.studiableItem[0]);
  expect(result).toMatchObject({
    question: 'He was worried about being replaced by a new toy.',
    image: 'https://o.quizlet.com/THalR.XHHWZjqUUfg9mzKw_m.png',
    answer: 'Woody',
  });
});
