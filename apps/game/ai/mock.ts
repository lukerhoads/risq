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

const aiReverseOptionResponses = {
  "Woody": [
    "Who was concerned about being replaced by a new toy?",
    "In the Toy Story series, who worried about being replaced by a newer toy?",
    "Which character was worried about being replaced by a new toy in the Toy Story franchise?"
  ],
  "Beauty and the Beast": [
    "Which movie features a young girl who falls in love with a creature?",
    "In the Disney film, what is the story of a young girl who falls in love with a beast called?",
    "What is the title of the movie where a young girl develops feelings for a beast-like creature?"
  ],
  "Tinker Bell": [
    "Who is Peter's friend in the Peter Pan stories?",
    "In Peter Pan, who is the fairy that is a friend of Peter?",
    "What is the name of the fairy who is a close friend of Peter Pan?"
  ],
  "Mushu": [
    "Whose task is it to restore honor to the family?",
    "In Mulan, who is assigned the job of restoring honor to the family?",
    "Who is the character responsible for bringing honor back to the family in Mulan?"
  ],
  "Snow White": [
    "Who lives with seven men but loves only one prince?",
    "In the classic fairy tale, who lives with seven dwarfs but ultimately falls in love with a prince?",
    "What character lives with seven dwarfs but has true love for a prince in the Snow White story?"
  ],
  "Walt Disney": [
    "Who is the creator of the Magical Kingdom?",
    "In the Disney universe, who is credited as the creator of the Magical Kingdom?",
    "What is the name of the person who is considered the creator of the Magical Kingdom?"
  ],
  "Rapunzel": [
    "Who can't keep her hair to herself?",
    "In the Disney film, who is the character with incredibly long hair that she can't control?",
    "What character in a Disney movie has long hair that she struggles to keep contained?"
  ],
  "Ariel": [
    "Who wants to be where the people are?",
    "In The Little Mermaid, which character desires to be part of the human world?",
    "What is the name of the mermaid who dreams of experiencing life among humans?"
  ],
  "Cinderella": [
    "Who can't seem to keep her shoe on?",
    "In the fairy tale, which character loses her shoe and struggles to keep it on?",
    "What character in the classic story consistently has difficulty keeping her shoe in place?"
  ],
  "Mr. Incredible": [
    "Who just wants to be super?",
    "In The Incredibles, which character desires to embrace his superhero identity?",
    "What is the name of the character from The Incredibles who yearns to be a superhero?"
  ],
  "Alice": [
    "Who falls down the rabbit hole?",
    "In Alice in Wonderland, which character tumbles down a rabbit hole into a magical world?",
    "What is the name of the girl who enters a fantastical realm by falling down a rabbit hole?"
  ],
  "Belle": [
    "Who breaks the spell on an enchanted castle?",
    "In Beauty and the Beast, who is the young woman that breaks the spell on the enchanted castle?",
    "What is the name of the character in Beauty and the Beast who frees an enchanted castle from a curse?"
  ],
  "Nemo": [
    "Who finds himself needing to be rescued?",
    "In Finding Nemo, which character gets lost and requires rescue?",
    "What is the name of the clownfish in Finding Nemo who becomes separated from his father?"
  ],
  "Bambi": [
    "Who is Thumper's friend?",
    "In the Disney film, who is Thumper's close companion?",
    "What is the name of Thumper's friend in the movie Bambi?"
  ],
  "Simba": [
    "Who just can't wait to be king?",
    "In The Lion King, which character eagerly anticipates becoming the king of the Pride Lands?",
    "What is the name of the lion cub in The Lion King who is destined to be king?"
  ],
  "Captain Hook": [
    "Who is Peter Pan's enemy?",
    "In Peter Pan, who is the primary antagonist and enemy of Peter Pan?",
    "What is the name of the pirate captain who serves as Peter Pan's arch-nemesis?"
  ],
  "Dumbo": [
    "Who is the flying elephant?",
    "In the Disney film, which character is an elephant with the ability to fly?",
    "What is the name of the adorable elephant who can fly in the movie Dumbo?"
  ],
  "Peter Pan": [
    "Who never wants to grow up?",
    "In the story, who is the boy who refuses to grow up and remains in Neverland?",
    "What is the name of the character who embodies eternal youth and never wants to grow up?"
  ],
  "Pinocchio": [
    "Who is the boy with a growing nose?",
    "In the classic tale, who is the wooden puppet whose nose grows when he tells lies?",
    "What is the name of the character who is a wooden puppet with a nose that grows longer when he lies?"
  ],
  "Mike Wazowski": [
    "Who was Sully's university roommate?",
    "In Monsters, Inc., who is the one-eyed monster that was Sully's roommate in university?",
    "What is the name of the one-eyed monster who was Sully's roommate in Monsters, Inc.?"
  ],
  "101 Dalmations": [
    "Which dog was highlighted in this Disney movie?",
    "In the Disney animated film, which breed of dog is featured prominently?",
    "What is the title of the Disney movie that centers around a large number of spotted dogs?"
  ],
  "Mowgli": [
    "Who was raised in the jungle?",
    "In The Jungle Book, who is the human child raised by wolves in the jungle?",
    "What is the name of the character who is a human child raised by animals in the jungle?"
  ]
}

// aiReverseOptions retrieves pre-generated mock AI responses that are a
// response to a question, in reverse (for when answerWithTerm is false).
// See the AI integration guide for more info.
export const aiReverseOptions = (term, definition) => {
  if (Object.keys(aiReverseOptionResponses).includes(term)) {
    return aiReverseOptionResponses[term];
  }

  return [];
}

// aiSentenceGrade queries the AI, asking it whether a sentence makes
// contextual sense.
// See the AI integration guide for more info.
export const aiSentenceGrade = (term: string, sentence: string) => {
  return sentence.toLowerCase().includes(term.toLowerCase());
};
