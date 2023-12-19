# Trends Autograder

Trends-Autograder for A1-A4.

Some inspiration (not much) taken from the Sphinx autograder for CS 3110.

Original code by Daniel: 24-hour speed-run on 2023-12-17. Please report bugs and contribute!

## Initial Setup

Install [Bun](https://bun.sh/).

Then, run `bun install` to install dependencies.

Then, install [pnpm](https://pnpm.io/) if you don't already have it.

## Testing for Correctness

Run `make test` to run the autograder on the test cases.

Make sure tests are passing before using this program!

## How to Use

1. On CMS go to _Assignments > Groups > [Name of Assignment: either A1, A2, A3, or A4]_.

2. Sort by _Files Remaining_ and find the index of the last assignment with 0 remaining.

3. Type that index into the second box next to _Range_ and click _Range_. Only submissions with complete files will now be checked.

4. Under _Select Group Operations_ click _Files_.

5. Unzip `submissions.zip` and move the resulting `Submissions` directory into here.

6. Run `make`. If all goes well, Trends-Autograder will produce `cms.csv` in root.

7. To upload scores to CMS, go to the bottom of the CMS page next to _Upload Scores_ and choose file `cms.csv`. Note that this will potentially overwrite past uploads and should thus be done by DevLeads in the majority of cases.

8. Afterwards, please run `make clean` to clean up.

## Known Bugs

-   Somewhere, somehow, there is a race condition or something of that sort. Pain. As a result, there are two 'ADJUSTMENTS' in `index.ts`. If you find and fix it, I'll buy you a beer (not Modelo).

-   The process hangs even after finishing. As long as you see `Done!` as the last line on the console, it's safe to hit Ctrl+C or Cmd+C to kill the process.

## Future Work

-   Add more tests.
-   Fix the known bugs.
-   Migrate the whole thing to using Functional paradigms..
    -   Consider switching to [Rescript](https://rescript-lang.org/) or using [Effect](https://effect.website/).
    -   Why? Much cleaner concurrent programming; much easier to reason about errors in failures to regex match and stuff like that. Would've made my life a lot easier.
