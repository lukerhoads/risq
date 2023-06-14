const aiOptionResponses = {
  Woody: ['Buzz Lightyear', 'Jessie', 'Andy'],
  'Beauty and the Beast': [
    'The Shape of Water',
    'King Kong',
    'Edward Scissorhands',
  ],
  'Tinker Bell': ['Wendy Darling', 'Fairy Godmother', 'Peter Pan'],
  Mushu: ['Mulan', 'Li Shang', 'Shan Yu'],
  'Snow White': ['The Seven Dwarfs', 'Evil Queen', 'Prince Charming'],
  'Walt Disney': ['Mickey Mouse', 'Disneyland', 'Animation'],
  Rapunzel: ['Flynn Rider', 'Tower', 'Lanterns'],
  Ariel: ['Under the Sea', 'Flounder', 'Ursula'],
  Cinderella: ['Fairy Godmother', 'Prince Charming', 'Glass Slipper'],
  'Mr. Incredible': ['Elastigirl', 'Dash', 'Syndrome'],
  Alice: ['Wonderland', 'Mad Hatter', 'Queen of Hearts'],
  Belle: ['Beast', 'Gaston', 'Enchanted Rose'],
  Nemo: ['Marlin', 'Dory', 'Finding Dory'],
  Bambi: ['Thumper', 'Flower', 'Great Prince of the Forest'],
  Simba: ['Mufasa', 'Scar', 'Pride Rock'],
  'Captain Hook': ['Tinker Bell', 'Neverland', 'Crocodile'],
  Dumbo: ['Timothy Q. Mouse', 'Circus', 'Feather'],
  'Peter Pan': ['Wendy Darling', 'Neverland', 'Lost Boys'],
  Pinocchio: ['Geppetto', 'Jiminy Cricket', 'Pleasure Island'],
  'Mike Wazowski': ['James P. Sullivan', 'Boo', 'Monsters, Inc.'],
  '101 Dalmatians': ['Cruella de Vil', 'Pongo', 'Perdita'],
  Mowgli: ['Baloo', 'Bagheera', 'Shere Khan'],
};

// aiOptions retrieves pre-generated mock AI responses that are a
// response to a question.
// See the AI integration guide for more info.
export const aiOptions = (term, definition) => {
  if (Object.keys(aiOptionResponses).includes(term)) {
    return aiOptionResponses[term];
  }

  return [];
};

// aiSentenceGrade queries the AI, asking it whether a sentence makes
// contextual sense.
// See the AI integration guide for more info.
export const aiSentenceGrade = (term: string, sentence: string) => {
  return sentence.toLowerCase().includes(term.toLowerCase());
};
