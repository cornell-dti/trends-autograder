# Trends Autograder

Trends Autograder for A1-A4.

Some inspiration taken from the Sphinx autograder for CS 3110. Credit to the CS 3110 staff for the ideas!

## How to Use

1. On CMS go to _Assignments > Groups > [Name of Assignment]_.

2. Sort by _Files Remaining_ and find the index of the last assignment with 0 remaining.

3. Type that index into the second box next to _Range_ and click _Range_. Only the complete files will now be checked.

4. Under _Select Group Operations_ click _Files_.

5. Unzip `submissions.zip` and move the resulting `Submissions` directory to the [Name of Assignment] subfolder in this `autograder` directory.

6. Run `make`. If all goes well, Sphinx will produce some new directories and files:

```
ROOT
  Results/
    cms.csv
  Build/
    netid1/
    netid2/
    etc.
```

8. If you are trying to upload scores to CMS, go to the bottom of the CMS page next to _Upload Scores_ and choose file `Results/cms.csv`. Note that this will potentially overwrite past uploads and should thus be done by head TAs in the majority of cases.

9. Afterwards, you can run `make clean` to clean up. It will remove the `Results/` and
   `Build/` directories while leaving the `Submissions/` directory untouched.
