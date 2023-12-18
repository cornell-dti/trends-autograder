# Trends Autograder

Trends-Autograder for A1-A4.

Some inspiration (not much) taken from the Sphinx autograder for CS 3110.

## Initial Setup

Run `make setup` to install the necessary dependencies.

You will not have to run this again.

## Testing for Correctness

Run `make test` to run the autograder on the test cases.

## How to Use

1. On CMS go to _Assignments > Groups > [Name of Assignment]_.

2. Sort by _Files Remaining_ and find the index of the last assignment with 0 remaining.

3. Type that index into the second box next to _Range_ and click _Range_. Only the complete files will now be checked.

4. Under _Select Group Operations_ click _Files_.

5. Unzip `submissions.zip` and move the resulting `Submissions` directory into here.

6. Run `make`. If all goes well, Trends-Autograder will produce `cms.csv` in root.

7. To upload scores to CMS, go to the bottom of the CMS page next to _Upload Scores_ and choose file `cms.csv`. Note that this will potentially overwrite past uploads and should thus be done by DevLeads in the majority of cases.

8. Afterwards, please run `make clean` to clean up.

## Known Bugs

Somewhere, somehow, there is a race condition. Pain.

If the console doesn't read `Done!` at the end, and there is no `cms.csv`, try running `make clean` and then `make` again. Sorry :/

## Roadmap

-   [ ] Add more tests.
-   [ ] Fix the godforsaken race condition.
