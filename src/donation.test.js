const {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  calculateTotal
} = require('./donation.js'); 

describe('Donation unit tests', () => {
  beforeEach(() => {
    // Mock localStorage for Node/Jest
    global.localStorage = {
      store: {},
      getItem(key) { return this.store[key] || null; },
      setItem(key, value) { this.store[key] = String(value); },
      removeItem(key) { delete this.store[key]; },
      clear() { this.store = {}; }
    };
    localStorage.clear();
  });

  afterEach(() => {
    delete global.localStorage;
  });

  test('validateDonation rejects empty or invalid fields', () => {
    const errors = validateDonation({ charity: '', amount: '', date: '' });
    expect(errors.length).toBeGreaterThan(0);

    const valid = validateDonation({ charity: 'Charity', amount: '10', date: '2025-10-01' });
    expect(valid.length).toBe(0);
  });

  test('makeDonationObject shapes data correctly', () => {
    const input = { charity: 'Test Charity', amount: '5.5', date: '2025-10-01', comment: 'For project' };
    const obj = makeDonationObject(input);

    expect(obj).toHaveProperty('id'); 
    expect(typeof obj.id).toBe('string');
    expect(obj.charity).toBe('Test Charity');
    expect(typeof obj.amount).toBe('number');
    expect(obj.amount).toBeCloseTo(5.5);
    expect(obj.date).toBe('2025-10-01');
    expect(obj.comment).toBe('For project');
  });

  test('saveToLocalStorage and loadFromLocalStorage work', () => {
    const donation = makeDonationObject({
      charity: 'Save Earth',
      amount: '15',
      date: '2025-10-02',
      comment: 'Eco project'
    });

    saveToLocalStorage('csr_donations', [donation]);
    const loaded = loadFromLocalStorage('csr_donations');

    expect(Array.isArray(loaded)).toBe(true);
    expect(loaded.length).toBe(1);
    expect(loaded[0].charity).toBe('Save Earth');
  });

  test('calculateTotal sums donations correctly', () => {
    const donations = [
      { amount: 10 },
      { amount: 20.5 },
      { amount: 5 }
    ];
    const total = calculateTotal(donations);
    expect(total).toBeCloseTo(35.5);
  });
});
