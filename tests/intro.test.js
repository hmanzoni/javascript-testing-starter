import { describe, test, it, expect } from 'vitest';
import { max, fizzBuzz, calculateAvg, factorial } from '../src/intro';

describe('max', () => {
  it('should return the first arg if it is greater', () => {
    // AAA:
    // Arrange
    const a = 2;
    const b = 1;

    // Act
    const result = max(a, b);

    // Assert
    expect(result).toBe(2);
  });
  it('should return the second arg if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });
  it('should return the first arg if it is equal', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzBuzz', () => {
  it('should return the FizzBuzz arg if can be divide by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });
  it('should return the Fizz arg if can be divide by 3', () => {
    expect(fizzBuzz(6)).toBe('Fizz');
  });
  it('should return the Buzz arg if can be divide by 5', () => {
    expect(fizzBuzz(10)).toBe('Buzz');
  });
  it('should return the number arg if can not be divide by 5 and/or 3', () => {
    expect(fizzBuzz(7)).toBe('7');
  });
});

describe('calculateAvg', () => {
  it('should return Nan if given an empty array', () => {
    expect(calculateAvg([])).toBe(NaN);
  });
  it('should calculate the average of an array with a single element', () => {
    expect(calculateAvg([1])).toBe(1);
  });
  it('should calculate the average of an array with a two element', () => {
    expect(calculateAvg([1, 2])).toBe(1.5);
  });
  it('should calculate the average of an array with a 3 element', () => {
    expect(calculateAvg([1, 2, 3])).toBe(2);
  });
});

describe('factorial', () => {
  it('should return 1 if given 0', () => {
    expect(factorial(0)).toBe(1);
  });
  it('should return 1 if given 1', () => {
    expect(factorial(1)).toBe(1);
  });
  it('should return 2 if given 2', () => {
    expect(factorial(2)).toBe(2);
  });
  it('should return 6 if given 3', () => {
    expect(factorial(3)).toBe(6);
  });
  it('should return 24 if given 4', () => {
    expect(factorial(4)).toBe(24);
  });
  it('should return undefined 4 if given a negative number', () => {
    expect(factorial(-4)).toBeUndefined();
  });
});
