# Trends Autograder

Trends-Autograder for A1-A4.

Written in a functional style, using [Effect](https://effect.website/), to handle concurrency and resource safety in a tidy manner. Refer to the Effect docs and the 3110 textbook as needed. Some inspiration (not much) taken from the Sphinx autograder for CS 3110.

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

    - If the system had trouble automatically grading any student, it will produce an "ERROR" in the `cms.csv` file next to their name. You will need to manually grade these students.

    - If the system hangs after printing `Done!`, it's safe to hit Ctrl+C to kill the process.

7. Upload score in `cms.csv` to corresponding student. If student does not achieve full points, refer to `tmp/netid/logs.json` to investigate all test cases having `"status": "failed"` and provide constructive feedback in the comment section.

8. Afterwards, please run `make clean` to clean up.

[Dev Lead Only] To upload scores to CMS, go to the bottom of the CMS page next to _Upload Scores_ and choose file `cms.csv`. Note that this will potentially overwrite past uploads and should thus be done by DevLeads in the majority of cases.