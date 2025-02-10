import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate numbers for different bet types
export function generateNumbers(betType: string): string[] {
  switch (betType) {
    case 'single_digit':
      return Array.from({ length: 10 }, (_, i) => i.toString());
    case 'jodi':
      return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
    case 'single_panna':
      return generateSinglePanna();
    case 'double_panna':
      return generateDoublePanna();
    case 'triple_panna':
      return generateTriplePanna();
    default:
      return [];
  }
}

// Helper functions to generate different types of numbers
function generateSinglePanna(): string[] {
  const numbers: string[] = [];
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      for (let k = 0; k <= 9; k++) {
        if (i !== j && j !== k && i !== k) {
          numbers.push(`${i}${j}${k}`);
        }
      }
    }
  }
  return numbers;
}

function generateDoublePanna(): string[] {
  const numbers: string[] = [];
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      if (i !== j) {
        numbers.push(`${i}${i}${j}`);
        numbers.push(`${i}${j}${i}`);
        numbers.push(`${j}${i}${i}`);
      }
    }
  }
  return numbers;
}

function generateTriplePanna(): string[] {
  return Array.from({ length: 10 }, (_, i) => `${i}${i}${i}`);
}

// Filter numbers based on search input
export function filterNumbers(numbers: string[], search: string): string[] {
  if (!search) return numbers;
  return numbers.filter(num => num.includes(search));
}

// Calculate sum of digits in a number recursively until single digit
export function calculateDigitSum(num: number): number {
  const sum = num.toString()
    .split('')
    .map(Number)
    .reduce((sum, digit) => sum + digit, 0);

  // If sum is still more than one digit, recursively sum until single digit
  return sum > 9 ? calculateDigitSum(sum) : sum;
}

// Get reversed format number for close
export function getCloseNumber(sum: number): number {
  // Generate a 3-digit number that adds up to the sum
  let digits: number[] = [];
  let remainingSum = sum;

  // First digit
  const firstDigit = Math.min(9, remainingSum - 2); // Leave at least 1 for each remaining digit
  digits.push(firstDigit);
  remainingSum -= firstDigit;

  // Second digit
  const secondDigit = Math.min(9, remainingSum - 1); // Leave at least 1 for last digit
  digits.push(secondDigit);
  remainingSum -= secondDigit;

  // Last digit is whatever remains
  digits.push(remainingSum);

  // Convert to number
  return parseInt(digits.join(''));
}