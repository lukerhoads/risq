# AI Integration Guide

The following is a brief guide on how to approach creating an AI that supports Risq.

When I created the mock responses, these are the formats I used:

- Sentence - Given the word "{word}" and its definition "{definition}" Can you tell me whether this sentence "{sentence}" makes contextual sense?
- Options - Given the word "{word}" and its definition "{definition}" can you give me three convincing multiple choice options that would occur alongside the word when the definition is provided as a question?

The sentence question should produce a yes or no answer. The options question should produce three words that provide alternative options.

These questions do not always work, though. Instruction fine-tuning will eventually be required to make the AI more reliable.

This means training a model on sample queries and responses. This will enable consistent responses while keeping the sophistication of the answers.
