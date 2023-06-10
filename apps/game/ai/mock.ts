const aiOptionResponses = {
    "Woody": ["Buzz Lightyear", "Jessie", "Andy"],
    "Beauty and the Beast": ["The Shape of Water", "King Kong", "Edward Scissorhands"],
    "Tinker Bell": ["Wendy Darling", "Fairy Godmother", "Peter Pan"],
    "Mushu": ["Mulan", "Li Shang", "Shan Yu"],
    "Snow White": ["The Seven Dwarfs", "Evil Queen", "Prince Charming"],
    "Walt Disney": ["Mickey Mouse", "Disneyland", "Animation"],
    "Rapunzel": ["Flynn Rider", "Tower", "Lanterns"],
    "Ariel": ["Under the Sea", "Flounder", "Ursula"],
    "Cinderella": ["Fairy Godmother", "Prince Charming", "Glass Slipper"],
    "Mr. Incredible": ["Elastigirl", "Dash", "Syndrome"],
    "Alice": ["Wonderland", "Mad Hatter", "Queen of Hearts"],
    "Belle": ["Beast", "Gaston", "Enchanted Rose"],
    "Nemo": ["Marlin", "Dory", "Finding Dory"],
    "Bambi": ["Thumper", "Flower", "Great Prince of the Forest"],
    "Simba": ["Mufasa", "Scar", "Pride Rock"],
    "Captain Hook": ["Tinker Bell", "Neverland", "Crocodile"],
    "Dumbo": ["Timothy Q. Mouse", "Circus", "Feather"],
    "Peter Pan": ["Wendy Darling", "Neverland", "Lost Boys"],
    "Pinocchio": ["Geppetto", "Jiminy Cricket", "Pleasure Island"],
    "Mike Wazowski": ["James P. Sullivan", "Boo", "Monsters, Inc."],
    "101 Dalmatians": ["Cruella de Vil", "Pongo", "Perdita"],
    "Mowgli": ["Baloo", "Bagheera", "Shere Khan"]
}

export const aiOptions = (term, definition) => {
    if (Object.keys(aiOptionResponses).includes(term)) {
        return aiOptionResponses[term]
    }

    return []
}

const aiClueResponses = [
    {
        "word": "Woody",
        "clues": [
            "He is a pull-string cowboy toy.",
            "He has a loyal companion named Buzz Lightyear.",
            "His catchphrase is 'There's a snake in my boot!'"
        ]
    },
    {
        "word": "Beauty and the Beast",
        "clues": [
            "It is a Disney animated film based on a French fairy tale.",
            "The main character, Belle, falls in love with a cursed prince.",
            "The enchanted objects in the castle include Lumière, Cogsworth, and Mrs. Potts."
        ]
    },
    {
        "word": "Tinker Bell",
        "clues": [
            "She is a fairy from Neverland.",
            "Her signature color is green.",
            "She sprinkles pixie dust to help others fly."
        ]
    },
    {
        "word": "Mushu",
        "clues": [
            "He is a small red dragon from Disney's Mulan.",
            "His goal is to restore honor to Mulan's family.",
            "He is voiced by Eddie Murphy."
        ]
    },
    {
        "word": "Snow White",
        "clues": [
            "She is the first Disney Princess.",
            "She befriends seven dwarfs.",
            "Her stepmother, the Evil Queen, is jealous of her beauty."
        ]
    },
    {
        "word": "Walt Disney",
        "clues": [
            "He is the founder of The Walt Disney Company.",
            "He created Mickey Mouse.",
            "He is known for his innovation in the field of animation."
        ]
    },
    {
        "word": "Rapunzel",
        "clues": [
            "She has long, magical hair.",
            "She is the main character in Disney's Tangled.",
            "She is locked in a tower by Mother Gothel."
        ]
    },
    {
        "word": "Ariel",
        "clues": [
            "She is a young mermaid who dreams of exploring the human world.",
            "She has a best friend named Flounder.",
            "Her father is King Triton."
        ]
    },
    {
        "word": "Cinderella",
        "clues": [
            "She loses her glass slipper at the royal ball.",
            "Her fairy godmother helps her attend the ball.",
            "She has wicked stepsisters named Anastasia and Drizella."
        ]
    },
    {
        "word": "Mr. Incredible",
        "clues": [
            "His real name is Bob Parr.",
            "He has superhuman strength.",
            "He is married to Elastigirl."
        ]
    },
    {
        "word": "Alice",
        "clues": [
            "She follows a white rabbit into Wonderland.",
            "She attends a tea party hosted by the Mad Hatter.",
            "She encounters characters like the Cheshire Cat and the Queen of Hearts."
        ]
    },
    {
        "word": "Belle",
        "clues": [
            "She is the main character in Disney's Beauty and the Beast.",
            "She loves reading books.",
            "She has a suitor named Gaston."
        ]
    },
    {
        "word": "Nemo",
        "clues": [
            "He is a clownfish.",
            "He gets lost in the ocean.",
            "His father's name is Marlin."
        ]
    },
    {
        "word": "Bambi",
        "clues": [
            "He is a young deer.",
            "His mother is killed by a hunter.",
            "He befriends Thumper and Flower."
        ]
    },
    {
        "word": "Simba",
        "clues": [
            "He is the lion prince of the Pride Lands.",
            "He is the main character in Disney's The Lion King.",
            "His uncle Scar plots to take over the kingdom."
        ]
    },
    {
        "word": "Captain Hook",
        "clues": [
            "He is a villainous pirate.",
            "He is the nemesis of Peter Pan.",
            "He has a hook for a hand."
        ]
    },
    {
        "word": "Dumbo",
        "clues": [
            "He is an elephant with big ears.",
            "He can fly with the help of a feather.",
            "His best friend is a mouse named Timothy Q. Mouse."
        ]
    },
    {
        "word": "Peter Pan",
        "clues": [
            "He is a boy who refuses to grow up.",
            "He lives in Neverland.",
            "He is the leader of the Lost Boys."
        ]
    },
    {
        "word": "Pinocchio",
        "clues": [
            "He is a wooden puppet brought to life.",
            "His nose grows when he tells a lie.",
            "He is guided by Jiminy Cricket."
        ]
    },
    {
        "word": "Mike Wazowski",
        "clues": [
            "He is a one-eyed green monster.",
            "He works as a scarer at Monsters, Inc.",
            "His best friend is Sulley."
        ]
    },
    {
        "word": "101 Dalmatians",
        "clues": [
            "The story revolves around a large family of spotted dogs.",
            "The main antagonist is Cruella de Vil.",
            "Pongo and Perdita are the parents of the puppies."
        ]
    },
    {
        "word": "Mowgli",
        "clues": [
            "He is a young boy raised by wolves.",
            "He is the main character in Disney's The Jungle Book.",
            "His friends include Baloo and Bagheera."
        ]
    }
]

export const aiClues = (term, definition) => {
    for (let clue in aiClueResponses) {
        if (clue["word"] == term) {
            return clue["clues"]
        }
    }

    return []
}

export const aiSentenceGrade = (term: string, sentence: string) => {
    return sentence.toLowerCase().includes(term.toLowerCase())
}