import { expect, test } from "vitest";
import { 
    formatLibraryCatalog, 
    summarizePurchases, 
    filterHighQualityArticles, 
    assessFinancialStanding, 
    craftGreetingMessage, 
    organizeCourses, 
    safelyAccessDeepProperty 
} from './main';

// Exercise 1 Tests
test('formatLibraryCatalog should handle empty array', () => {
 expect(formatLibraryCatalog([])).toEqual([]);
});

test('formatLibraryCatalog should transform and filter books', () => {
 expect(
   formatLibraryCatalog([
     { title: 'Book 1', author: 'Author A', genre: 'fiction' },
     { title: 'Book 2', author: 'Author B', genre: 'non-fiction' },
     { title: 'Book 3', author: 'Author C', genre: 'fiction' },
   ])
 ).toEqual([
   { title: '"Book 1"', author: 'author a', genre: 'fiction' },
   { title: '"Book 3"', author: 'author c', genre: 'fiction' },
 ]);
});

test('formatLibraryCatalog should handle books with all the same genre', () => {
 expect(
   formatLibraryCatalog([
     { title: 'Book 1', author: 'Author A', genre: 'fiction' },
     { title: 'Book 2', author: 'Author B', genre: 'fiction' },
   ])
 ).toEqual([
   { title: '"Book 1"', author: 'author a', genre: 'fiction' },
   { title: '"Book 2"', author: 'author b', genre: 'fiction' },
 ]);
});

// Exercise 2 Tests
test('summarizePurchases should handle empty array', () => {
 expect(summarizePurchases([])).toEqual({});
});

test('summarizePurchases should aggregate purchases by userId', () => {
 expect(
   summarizePurchases([
     { purchaseId: 1, userId: 123, total: 100 },
     { purchaseId: 2, userId: 123, total: 50 },
     { purchaseId: 3, userId: 456, total: 200 },
   ])
 ).toEqual({ '123': 150, '456': 200 });
});

test('summarizePurchases should handle purchases with all the same userId', () => {
 expect(
   summarizePurchases([
     { purchaseId: 1, userId: 123, total: 100 },
     { purchaseId: 2, userId: 123, total: 100 },
     { purchaseId: 3, userId: 123, total: 100 },
   ])
 ).toEqual({ '123': 300 });
});

// Exercise 3 Tests
test('filterHighQualityArticles should handle empty array', () => {
 expect(filterHighQualityArticles([])).toEqual([]);
});

test('filterHighQualityArticles should filter and format articles', () => {
 expect(
   filterHighQualityArticles([
     { title: 'Article 1', topic: 'Technology', score: 7 },
     { title: 'Article 2', topic: 'Science', score: 4 },
     { title: 'Article 3', topic: 'Politics', score: 6 },
   ])
 ).toEqual(['Article 1: Technology', 'Article 3: Politics']);
});

test('filterHighQualityArticles should handle articles with all low scores', () => {
 expect(
   filterHighQualityArticles([
     { title: 'Article 1', topic: 'Technology', score: 4 },
     { title: 'Article 2', topic: 'Science', score: 3 },
   ])
 ).toEqual([]);
});

// Exercise 4 Tests
test('assessFinancialStanding should handle wealthy case', () => {
 expect(assessFinancialStanding({ name: 'John', monthlyIncome: 10000, expenses: 2000 })).toEqual('wealthy');
});

test('assessFinancialStanding should handle stable case', () => {
 expect(assessFinancialStanding({ name: 'Jane', monthlyIncome: 4000, expenses: 2000 })).toEqual('stable');
});

test('assessFinancialStanding should handle struggling case', () => {
 expect(assessFinancialStanding({ name: 'Bob', monthlyIncome: 2000, expenses: 3000 })).toEqual('struggling');
});

// Exercise 5 Tests
test('craftGreetingMessage should construct the message correctly', () => {
 const currentYear = new Date().getFullYear();
 expect(craftGreetingMessage({ firstName: 'John', birthYear: 1990 })).toEqual(`Welcome, John! Your age is ${currentYear - 1990}.`);
});

test('craftGreetingMessage should handle edge case of current year', () => {
 const currentYear = new Date().getFullYear();
 expect(craftGreetingMessage({ firstName: 'Jane', birthYear: currentYear })).toEqual(`Welcome, Jane! Your age is 0.`);
});

// Exercise 6 Tests
test('organizeCourses should categorize courses correctly', () => {
 expect(
   organizeCourses([
     { courseName: 'Course 1', difficulty: 'easy' },
     { courseName: 'Course 2', difficulty: 'medium' },
     { courseName: 'Course 3', difficulty: 'hard' },
     { courseName: 'Course 4', difficulty: 'easy' },
   ])
 ).toEqual({
   easy: [
     { courseName: 'Course 1', difficulty: 'easy' },
     { courseName: 'Course 4', difficulty: 'easy' },
   ],
   medium: [{ courseName: 'Course 2', difficulty: 'medium' }],
   hard: [{ courseName: 'Course 3', difficulty: 'hard' }],
 });
});

test('organizeCourses should handle empty array', () => {
 expect(organizeCourses([])).toEqual({});
});

// Exercise 7 Tests
test('safelyAccessDeepProperty should return the nested value', () => {
 expect(
   safelyAccessDeepProperty({
     firstLevel: { secondLevel: { thirdLevel: { deepValue: 'Success' } } },
   })
 ).toEqual('Success');
});

test('safelyAccessDeepProperty should return "Unavailable" if value is missing', () => {
 expect(safelyAccessDeepProperty({ firstLevel: { secondLevel: { thirdLevel: {} } } })).toEqual('Unavailable');
});

test('safelyAccessDeepProperty should handle completely empty object', () => {
 expect(safelyAccessDeepProperty({})).toEqual('Unavailable');
});