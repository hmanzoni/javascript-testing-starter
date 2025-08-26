import { it, expect, describe } from "vitest";
import {
  calculateDiscount,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
  canDrive,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array coupons", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });
  it("should return an array with valid coupon codes", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });
  it("should return an array with valid discounts", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });
  it("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });
  it("should handle negative price", () => {
    expect(calculateDiscount(-5, "SAVE10")).toMatch(/invalid/i);
  });
  it("should handle non-string discount code", () => {
    expect(calculateDiscount(5, 10)).toMatch(/invalid/i);
  });
  it("should handle invalid discount code", () => {
    expect(calculateDiscount(5, "INVALID")).toBe(5);
  });
});

describe("validateUserInput", () => {
  it("should return success if given a valid input", () => {
    expect(validateUserInput("hugo", 36)).toMatch(/success/i);
  });
  it("should return an error if username is not string or less than 3 chars or is longer than 255", () => {
    expect(validateUserInput(122345, 36)).toMatch(/invalid/i);
    expect(validateUserInput("as", 36)).toMatch(/invalid/i);
    expect(validateUserInput("A".repeat(256), 36)).toMatch(/invalid/i);
  });
  it("should return an error if age is less than 18 or is a string", () => {
    expect(validateUserInput("saul", 17)).toMatch(/invalid/i);
    expect(validateUserInput("saul", "20")).toMatch(/invalid/i);
  });
  it("should return an error if both username and age are invalid", () => {
    expect(validateUserInput("", 15)).toMatch(/invalid username/i);
    expect(validateUserInput("", 15)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it("should return false when the price is outside the range", () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
    expect(isPriceInRange(210, 0, 100)).toBe(false);
  });
  it("should return true when the price is equal to the min or to the max", () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  it("should return false when the username is too short or too long", () => {
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
  });
  it("should return false for invalid input types", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1333)).toBe(false);
  });
  it("should return true when the username is at the min or max length", () => {
    expect(isValidUsername("a".repeat(minLength))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength))).toBe(true);
  });
  it("should return true when the username is within the length constraint", () => {
    expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength - 1))).toBe(true);
  });
});

describe("canDrive", () => {
  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },
    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },
  ])(
    "should return $result for $age in $country",
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    }
  );
});
