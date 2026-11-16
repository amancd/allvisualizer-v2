import {
  Dices, BarChart3, Sigma, FlaskRound,
  Brain, Briefcase, ShieldCheck, Search, Gamepad2, LineChart, Calculator,
} from 'lucide-react';
import type { Subject } from './types';

const viz = '/statistics-visualizer/visualizations';

export const statistics: Subject = {
  id: 'statistics',
  title: 'Statistics & Probability',
  shortTitle: 'Statistics',
  href: '/statistics-visualizer',
  accent: 'amber',
  intro:
    'Build intuition for chance and data. Run thousands of random trials, reshape distributions, summarize datasets and see what a p-value really means.',
  itemNoun: 'visualizations',
  topics: [
    {
      slug: 'probability',
      title: 'Probability',
      icon: Dices,
      summary: 'Chance, conditioning and updating beliefs',
      intro:
        'Learn how to reason about uncertainty. Watch frequencies settle as trials pile up, condition on new information and update beliefs with Bayes\' theorem.',
      itemBasePath: viz,
      highlights: ['Law of Large Numbers', 'Conditional Probability', 'Bayes\' Theorem', 'Independence'],
      concepts: [
        { title: 'Sample Space', description: 'The set of every possible outcome of a random experiment' },
        { title: 'Conditional Probability', description: 'P(A | B): the chance of A once you know B happened' },
        { title: 'Independence', description: 'Events are independent when knowing one tells you nothing about the other' },
        { title: 'Bayes\' Theorem', description: 'Turn P(evidence | cause) into P(cause | evidence)' },
      ],
      items: [
        { slug: 'law-of-large-numbers', title: 'Law of Large Numbers', description: 'Flip coins and roll dice thousands of times and watch the running frequency settle on the true probability', difficulty: 'Beginner', tags: ['Relative Frequency', 'Coin Flips', 'Dice', 'Convergence'] },
        { slug: 'conditional-probability', title: 'Conditional Probability', description: 'Explore P(A | B) with an interactive Venn diagram and a probability tree', difficulty: 'Beginner', tags: ['Venn Diagram', 'Probability Tree', 'Independence', 'Multiplication Rule'] },
        { slug: 'bayes-theorem', title: 'Bayes\' Theorem', description: 'See why a positive result from an accurate test can still be unlikely to be right', difficulty: 'Intermediate', tags: ['Prior', 'Posterior', 'False Positives', 'Base Rate'] },
      ],
    },
    {
      slug: 'distributions',
      title: 'Probability Distributions',
      icon: BarChart3,
      summary: 'Discrete and continuous random variables',
      intro:
        'Meet the distributions that model counts, waiting times and measurements. Change parameters and watch the shape, mean and variance respond.',
      itemBasePath: viz,
      highlights: ['Binomial', 'Poisson', 'PDF and CDF', 'Expected Value'],
      concepts: [
        { title: 'Random Variable', description: 'A number whose value depends on the outcome of a random experiment' },
        { title: 'PMF and PDF', description: 'Probabilities of exact values (discrete) or densities over a range (continuous)' },
        { title: 'CDF', description: 'P(X ≤ x), the running total of probability' },
        { title: 'Mean and Variance', description: 'Where a distribution is centered and how spread out it is' },
      ],
      items: [
        { slug: 'binomial-distribution', title: 'Binomial Distribution', description: 'Count successes in n independent trials and watch a Galton board build the distribution', difficulty: 'Beginner', tags: ['Bernoulli Trials', 'Galton Board', 'n Choose k', 'Expected Value'] },
        { slug: 'poisson-distribution', title: 'Poisson Distribution', description: 'Model random events in time and compare the Poisson with a binomial that has many trials', difficulty: 'Intermediate', tags: ['Rate λ', 'Rare Events', 'Arrivals', 'Poisson Approximation'] },
        { slug: 'pdf-and-cdf', title: 'PDF and CDF', description: 'Compare density and cumulative curves for uniform, exponential, normal and beta distributions', difficulty: 'Intermediate', tags: ['Density', 'Cumulative', 'Area Under Curve', 'Quantiles'] },
      ],
    },
    {
      slug: 'descriptive-statistics',
      title: 'Descriptive Statistics',
      icon: Sigma,
      summary: 'Summarize data with center, spread and shape',
      intro:
        'Describe a dataset with a handful of numbers and pictures. Drag data points and watch the mean, median, quartiles and correlation respond.',
      itemBasePath: viz,
      highlights: ['Mean and Median', 'Box Plots', 'Outliers', 'Correlation'],
      concepts: [
        { title: 'Center', description: 'Mean, median and mode each describe a typical value in a different way' },
        { title: 'Spread', description: 'Range, interquartile range and standard deviation measure variability' },
        { title: 'Shape', description: 'Skew and outliers pull the mean away from the median' },
        { title: 'Association', description: 'Correlation measures how tightly two variables follow a straight line' },
      ],
      items: [
        { slug: 'mean-median-mode', title: 'Mean, Median & Mode', description: 'Drag data points on a number line and see how outliers pull the mean but not the median', difficulty: 'Beginner', tags: ['Mean', 'Median', 'Mode', 'Skewness', 'Outliers'] },
        { slug: 'box-plots', title: 'Box Plots & Quartiles', description: 'Build a box plot from quartiles, flag outliers with the 1.5 × IQR rule and compare it with a histogram', difficulty: 'Beginner', tags: ['Quartiles', 'IQR', 'Five-Number Summary', 'Outliers'] },
        { slug: 'correlation', title: 'Correlation', description: 'Generate scatter plots with a chosen correlation and see what r does and does not tell you', difficulty: 'Intermediate', tags: ['Pearson r', 'Scatter Plot', 'Covariance', 'Anscombe'] },
      ],
    },
    {
      slug: 'inference',
      title: 'Statistical Inference',
      icon: FlaskRound,
      summary: 'Draw conclusions from samples',
      intro:
        'Go from a sample to a claim about the population. Build confidence intervals, run hypothesis tests and see the trade-off between the two kinds of error.',
      itemBasePath: viz,
      highlights: ['Confidence Intervals', 'Hypothesis Testing', 'p-Values', 'Statistical Power'],
      concepts: [
        { title: 'Estimation', description: 'Use a sample statistic to estimate an unknown population parameter' },
        { title: 'Confidence Level', description: 'How often the interval-building method captures the true value' },
        { title: 'p-Value', description: 'How surprising the data would be if the null hypothesis were true' },
        { title: 'Errors and Power', description: 'False alarms, missed effects and the chance of detecting a real effect' },
      ],
      items: [
        { slug: 'confidence-intervals', title: 'Confidence Intervals', description: 'Draw 100 samples, build an interval from each and count how many capture the true mean', difficulty: 'Intermediate', tags: ['Margin of Error', 'Confidence Level', 'Standard Error', 't Interval'] },
        { slug: 'hypothesis-testing', title: 'Hypothesis Testing', description: 'Run a z-test step by step and see the test statistic, rejection region and p-value', difficulty: 'Intermediate', tags: ['Null Hypothesis', 'p-Value', 'Significance Level', 'z-Test'] },
        { slug: 'type-i-ii-errors', title: 'Type I & II Errors and Power', description: 'Slide the effect size, sample size and α and watch the error rates and power trade off', difficulty: 'Advanced', tags: ['False Positive', 'False Negative', 'Power', 'Effect Size'] },
      ],
    },
  ],
  whyLearn: {
    title: 'Why study statistics?',
    description: 'Data is everywhere, and statistics is how you make sense of it.',
    items: [
      { icon: Brain, title: 'Better decisions', description: 'Reason clearly when outcomes are uncertain.' },
      { icon: Search, title: 'Spot bad claims', description: 'Recognise misleading charts, tiny samples and base-rate errors.' },
      { icon: Briefcase, title: 'Careers', description: 'The core of data science, finance, research and machine learning.' },
      { icon: ShieldCheck, title: 'Science', description: 'Every experiment and clinical trial is judged with statistics.' },
    ],
  },
  features: {
    title: 'Learning features',
    description: 'Everything you need to build statistical intuition.',
    items: [
      { icon: Gamepad2, title: 'Run the experiment', description: 'Simulate thousands of random trials in a second.' },
      { icon: LineChart, title: 'Live charts', description: 'Distributions and summaries update as you change the inputs.' },
      { icon: Calculator, title: 'Worked calculations', description: 'See every formula evaluated with the current numbers.' },
    ],
  },
};
