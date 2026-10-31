/** Example training corpora for the BPE visualizer. Edit freely in the page. */
export interface CorpusPreset {
  label: string;
  text: string;
  /** A suggested sentence to encode after training on this corpus. */
  sample: string;
}

export const corpusPresets: CorpusPreset[] = [
  {
    label: 'Runners and walkers',
    text:
      'the runner was running and the walker was walking. the faster runner runs faster than the slower walker. ' +
      'a newer runner is running the newest race. the slowest walker walks slower, but walking is still fun. ' +
      'runners and walkers were running and walking all day.',
    sample: 'the fastest walkers were jogging',
  },
  {
    label: 'Classic (low, newest, widest)',
    text:
      'low low low low low lower lower newest newest newest newest newest newest widest widest widest',
    sample: 'lowest newer wide',
  },
  {
    label: 'Code-like text',
    text:
      'for item in items: print(item). for index in indexes: print(index). ' +
      'def print_items(items): for item in items: print(item)',
    sample: 'for idx in index_items: print(idx)',
  },
];
