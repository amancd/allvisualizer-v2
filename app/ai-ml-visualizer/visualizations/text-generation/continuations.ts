/**
 * Hand-crafted next-token logits, arranged as a small tree of continuations.
 *
 * A real language model scores all ~50,000 to 200,000 tokens in its vocabulary
 * at every step. Here each node lists a handful of plausible next tokens with
 * made-up logits chosen to look realistic: some prompts are confident (one
 * clear winner), others are open-ended (many similar options). A token with
 * `next` can be continued; a token without it ends the illustrative tree.
 * Tokens carry their leading space, as GPT-style tokenizers do.
 */

export interface Candidate {
  token: string;
  logit: number;
  next?: Candidate[];
}

export interface PromptPreset {
  id: string;
  label: string;
  prompt: string;
  root: Candidate[];
}

const t = (token: string, logit: number, next?: Candidate[]): Candidate => ({ token, logit, next });

/** Common sentence endings, reused so branches can finish gracefully. */
const end = (bias = 0): Candidate[] => [t('.', 3 + bias), t('!', 0.6 + bias), t('...', -0.6 + bias)];

export const presets: PromptPreset[] = [
  {
    id: 'cat',
    label: 'The cat sat on the',
    prompt: 'The cat sat on the',
    root: [
      t(' mat', 3.4, [
        t('.', 2.8),
        t(' and', 2.1, [
          t(' purred', 2.4, end()),
          t(' fell', 1.6, [t(' asleep', 3.2, end(0.3)), t(' over', 0.6, end())]),
          t(' looked', 1.5, [t(' at', 2.2, [t(' me', 2.5, end()), t(' the', 1.6, [t(' door', 2, end()), t(' window', 1.8, end())])]), t(' around', 1.4, end())]),
          t(' watched', 1.1, [t(' the', 2.6, [t(' birds', 2.2, end()), t(' rain', 1.4, end())])]),
          t(' licked', 0.6, [t(' its', 2.8, [t(' paws', 3, end())])]),
        ]),
        t(',', 1.6, [t(' waiting', 1.8, [t(' for', 3, [t(' dinner', 2.4, end()), t(' its', 1.2, [t(' owner', 2.5, end())])])]), t(' purring', 1.7, end()), t(' staring', 1.2, [t(' at', 3, [t(' me', 2, end())])])]),
        t(' by', 0.9, [t(' the', 3, [t(' door', 2.6, end()), t(' fire', 2.2, end()), t(' window', 1.8, end())])]),
      ]),
      t(' floor', 2.6, [t('.', 2.5), t(' and', 1.7, [t(' stared', 1.8, [t(' at', 3, [t(' me', 2.2, end()), t(' the', 1.5, [t(' wall', 2, end())])])]), t(' yawned', 1.6, end())]), t(',', 1.2, [t(' ignoring', 1.6, [t(' everyone', 2, end())])])]),
      t(' couch', 2.3, [t('.', 2.4), t(' and', 1.8, [t(' fell', 1.8, [t(' asleep', 3, end())]), t(' refused', 1.2, [t(' to', 3.4, [t(' move', 3, end())])])])]),
      t(' windowsill', 2.1, [t(' and', 2.2, [t(' watched', 2.6, [t(' the', 2.8, [t(' birds', 2.5, end()), t(' street', 1.7, end()), t(' rain', 1.6, end())])])]), t('.', 2)]),
      t(' bed', 1.8, [t('.', 2.4), t(' and', 1.5, [t(' purred', 2, end())])]),
      t(' keyboard', 1.5, [t('.', 1.8), t(',', 1.7, [t(' typing', 1.9, [t(' gibberish', 2.6, end())])]), t(' again', 1.4, end(0.2))]),
      t(' roof', 1.1, [t('.', 2.2), t(' of', 1.9, [t(' the', 3, [t(' house', 2.4, end()), t(' car', 1.8, end()), t(' shed', 1.5, end())])])]),
      t(' table', 1.0, [t('.', 2.2), t(' and', 1.4, [t(' knocked', 2.2, [t(' over', 2.6, [t(' a', 2.4, [t(' glass', 2.5, end()), t(' vase', 2, end())])])])])]),
      t(' fence', 0.7, end()),
      t(' grass', 0.3, end()),
      t(' laptop', 0.2, end()),
      t(' moon', -1.2, end()),
      t(' piano', -1.0, end()),
      t(' banana', -2.4, end()),
    ],
  },
  {
    id: 'story',
    label: 'Once upon a time, there was a',
    prompt: 'Once upon a time, there was a',
    root: [
      t(' little', 2.8, [
        t(' girl', 2.7, [t(' who', 3.1, [t(' lived', 2.6, [t(' in', 3, [t(' a', 2.4, [t(' small', 2.4, [t(' village', 3, end())]), t(' forest', 1.8, end())]), t(' the', 2, [t(' woods', 2.4, end()), t(' city', 1.6, end())])])]), t(' loved', 2.3, [t(' to', 3, [t(' dance', 2.2, end()), t(' read', 2.1, end()), t(' paint', 1.5, end())])]), t(' wanted', 1.8, [t(' to', 3.2, [t(' fly', 2.4, end()), t(' see', 1.8, [t(' the', 3, [t(' sea', 2.5, end())])])])])]), t(' named', 2.6, [t(' Lily', 2.4, end()), t(' Rose', 1.9, end()), t(' Mia', 1.6, end())])]),
        t(' boy', 2.5, [t(' who', 3, [t(' lived', 2.5, [t(' by', 2.4, [t(' the', 3, [t(' sea', 2.5, end()), t(' river', 2, end())])])]), t(' dreamed', 2, [t(' of', 3.2, [t(' flying', 2.2, end()), t(' dragons', 1.8, end())])])]), t(' named', 2.4, [t(' Jack', 2.6, end()), t(' Tom', 2, end())])]),
        t(' mouse', 1.6, [t(' who', 3, [t(' lived', 2.6, [t(' in', 3, [t(' a', 2.6, [t(' hole', 2.4, end()), t(' teapot', 1.4, end())])])])])]),
        t(' house', 1.2, [t(' in', 2.8, [t(' the', 3, [t(' woods', 2.6, end()), t(' hills', 2, end())])])]),
      ]),
      t(' young', 2.2, [t(' prince', 2.6, [t(' who', 3, [t(' was', 2.2, [t(' very', 2, [t(' lonely', 2.4, end()), t(' brave', 2.2, end())])]), t(' loved', 2, [t(' adventure', 2.4, end())])])]), t(' girl', 2.3, [t(' named', 2.6, [t(' Alice', 2.4, end()), t(' Clara', 1.8, end())])])]),
      t(' king', 2.0, [t(' who', 3, [t(' had', 2.6, [t(' three', 2.4, [t(' daughters', 2.8, end()), t(' sons', 2.4, end())]), t(' everything', 1.6, end())]), t(' ruled', 2, [t(' a', 2.6, [t(' great', 2, [t(' kingdom', 3, end())])])])])]),
      t(' princess', 1.9, [t(' who', 3, [t(' lived', 2.6, [t(' in', 3, [t(' a', 2.8, [t(' tall', 2.4, [t(' tower', 3, end())]), t(' castle', 2.4, end())])])]), t(' could', 2, [t(' talk', 2.2, [t(' to', 3, [t(' animals', 3, end())])])])])]),
      t(' poor', 1.7, [t(' farmer', 2.8, [t(' who', 3, [t(' had', 2.8, [t(' a', 2.4, [t(' magic', 1.8, [t(' cow', 2.2, end()), t(' goose', 2.1, end())])]), t(' nothing', 1.6, end())])])]), t(' woodcutter', 2.4, [t(' and', 2.4, [t(' his', 3, [t(' wife', 3, end())])])])]),
      t(' dragon', 1.5, [t(' who', 3, [t(' was', 2.4, [t(' afraid', 2.4, [t(' of', 3, [t(' fire', 2.4, end()), t(' the', 1.8, [t(' dark', 3, end())])])])]), t(' guarded', 2, [t(' a', 2.6, [t(' treasure', 2.8, end())])])])]),
      t(' beautiful', 1.4, [t(' princess', 3, [t(' who', 3, [t(' lived', 2.6, [t(' in', 3, [t(' a', 3, [t(' castle', 3, end())])])])])])]),
      t(' wise', 1.1, [t(' old', 3, [t(' owl', 2.8, end()), t(' man', 2.6, end())])]),
      t(' small', 1.0, [t(' village', 2.6, end()), t(' town', 2.2, end())]),
      t(' giant', 0.6, end()),
      t(' robot', -0.2, end()),
      t(' spreadsheet', -2.0, end()),
    ],
  },
  {
    id: 'capital',
    label: 'The capital of France is',
    prompt: 'The capital of France is',
    root: [
      t(' Paris', 7.2, [
        t('.', 3.4),
        t(',', 2.4, [t(' which', 2.6, [t(' is', 3, [t(' also', 2.2, [t(' its', 2.6, [t(' largest', 3.2, [t(' city', 4, end())])])]), t(' known', 2.2, [t(' for', 3.6, [t(' the', 3, [t(' Eiffel', 3.4, [t(' Tower', 5, end())])]), t(' its', 2.4, [t(' art', 2, end()), t(' food', 1.8, end())])])])])]), t(' a', 2, [t(' city', 3, [t(' of', 2.4, [t(' about', 2.6, [t(' two', 2.8, [t(' million', 4, [t(' people', 3.5, end())])])])])])])]),
        t(' and', 1.2, [t(' its', 2.6, [t(' largest', 3, [t(' city', 4, end())])])]),
        t(' (', 0.4, end()),
      ]),
      t(' a', 2.2, [t(' city', 3, [t(' called', 3, [t(' Paris', 5, end())])])]),
      t(' the', 1.6, [t(' city', 3.4, [t(' of', 3.2, [t(' Paris', 5, end())])])]),
      t(' located', 1.3, [t(' in', 3, [t(' the', 3, [t(' north', 2.6, end())])])]),
      t(' Lyon', 0.6, end()),
      t(' Marseille', 0.2, end()),
      t(' not', -0.3, end()),
      t(' London', -1.4, end()),
      t(' Berlin', -1.8, end()),
    ],
  },
  {
    id: 'colour',
    label: 'My favourite colour is',
    prompt: 'My favourite colour is',
    root: [
      t(' blue', 2.3, [t('.', 3), t(',', 1.8, [t(' like', 2.4, [t(' the', 3, [t(' sky', 2.8, end()), t(' ocean', 2.4, end())])]), t(' because', 2, [t(' it', 2.6, [t(' reminds', 2.4, [t(' me', 3.4, [t(' of', 3.6, [t(' the', 3, [t(' sea', 2.6, end())])])])])])])]), t(' because', 1.6, [t(' it', 2.8, [t(' is', 2.4, [t(' calm', 2.2, end()), t(' calming', 2, end())])])])]),
      t(' green', 2.1, [t('.', 3), t(',', 1.6, [t(' like', 2.6, [t(' grass', 2.4, end()), t(' leaves', 2, end())])]), t(' because', 1.6, [t(' it', 2.8, [t(' reminds', 2.4, [t(' me', 3.4, [t(' of', 3.6, [t(' nature', 2.6, end())])])])])])]),
      t(' red', 2.0, [t('.', 3), t(',', 1.6, [t(' like', 2.6, [t(' a', 2.2, [t(' rose', 2.4, end())])])]), t(' because', 1.6, [t(' it', 2.8, [t(' is', 2.4, [t(' bold', 2.4, end())])])])]),
      t(' purple', 1.8, [t('.', 3), t(' because', 1.6, [t(' it', 2.8, [t(' is', 2.4, [t(' royal', 1.8, end()), t(' unusual', 1.6, end())])])])]),
      t(' yellow', 1.6, [t('.', 3), t(',', 1.6, [t(' like', 2.6, [t(' sunshine', 2.4, end())])])]),
      t(' black', 1.5, end()),
      t(' orange', 1.3, end()),
      t(' pink', 1.3, end()),
      t(' white', 1.0, end()),
      t(' teal', 0.6, end()),
      t(' grey', 0.5, end()),
      t(' turquoise', 0.3, end()),
    ],
  },
];
