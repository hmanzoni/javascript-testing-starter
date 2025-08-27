import { describe, expect, vi, it } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  login,
  renderPage,
  submitOrder,
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import security from '../src/libs/security';
import { sendEmail } from '../src/libs/email';

// Hoisting
vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/email');

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

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });
  it('should call analytics', async () => {
    await renderPage();
    expect(trackPageView).toBeCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: '1234' };
  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    await submitOrder(order, creditCard);
    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });
  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    const result = await submitOrder(order, creditCard);
    expect(result).toEqual({ success: true });
  });
  it('should return failed when payment is not successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });
    const result = await submitOrder(order, creditCard);
    expect(result).toEqual({ success: false, error: 'payment_error' });
  });
});

describe('login', () => {
  it('should email the one-time login code', async () => {
    const email = 'test@domain.com';
    const spy = vi.spyOn(security, 'generateCode');
    await login(email);
    const securityCode = spy.mock.results[0].value;
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode.toString());
  });
});
