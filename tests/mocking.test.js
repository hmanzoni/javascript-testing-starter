import { describe, expect, vi, it } from "vitest";
import { getPriceInCurrency, getShippingInfo } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";

// Hoisting
vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');

describe('getPriceInCurrency', () => {
    it('should return price in target currency', () => {
        vi.mocked(getExchangeRate).mockReturnValue(1.5);
        const price = getPriceInCurrency(10, 'AUD');
        expect(price).toBe(15);
    });
});

describe('getShippingInfo', () => {
    it('should return shipping unavailable if quote cannot be fetched', () => {
        vi.mocked(getShippingQuote).mockReturnValue(null);
        const result = getShippingInfo('Argentina');
        expect(result).toMatch(/unavailable/i);
    });
    it('should return shipping info if quote can be fetched', () => {
        vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });
        const result = getShippingInfo('Argentina');
        expect(result).toMatch('$10');
        expect(result).toMatch(/2 days/i);
    });
});