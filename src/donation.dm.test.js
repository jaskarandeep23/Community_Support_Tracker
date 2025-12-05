const { JSDOM } = require('jsdom');
const {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  calculateTotal
} = require('./donation.js'); 

// Helper to render the table and summary
function renderTableAndSummary(document) {
  const tbody = document.querySelector('#donationsTable tbody');
  tbody.innerHTML = ''; 
  const donations = loadFromLocalStorage('csr_donations') || [];
  donations.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.charity}</td>
      <td>$${Number(d.amount).toFixed(2)}</td>
      <td>${d.date}</td>
      <td>${d.comment || ''}</td>
      <td><button data-id="${d.id}" class="delete-btn">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  const summaryEl = document.getElementById('summary');
  summaryEl.textContent = `Total donated: $${calculateTotal(donations).toFixed(2)}`;
}

describe('Donation DOM integration (JSDOM)', () => {
  let dom;
  let document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <form id="donationForm">
            <input id="charity" name="charity" />
            <input id="amount" name="amount" />
            <input id="donationDate" name="donationDate" />
            <input id="comment" name="comment" />
            <button type="submit">Add Donation</button>
          </form>

          <div id="errors"></div>

          <table id="donationsTable">
            <thead><tr><th>Charity</th><th>Amount</th><th>Date</th><th>Comment</th><th>Action</th></tr></thead>
            <tbody></tbody>
          </table>

          <div id="summary">Total donated: $0.00</div>
        </body>
      </html>
    `;
    dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
    document = dom.window.document;

    // Mock globals
    global.document = document;
    global.window = dom.window;
    global.localStorage = dom.window.localStorage; 
    dom.window.localStorage.clear();
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
    delete global.localStorage;
  });

  test('submit form: validate -> create object -> persist -> render table and summary', () => {
    document.getElementById('charity').value = 'Good Charity';
    document.getElementById('amount').value = '20';
    document.getElementById('donationDate').value = '2025-10-01';
    document.getElementById('comment').value = 'Helping out';

    const errors = validateDonation({
      charity: document.getElementById('charity').value,
      amount: document.getElementById('amount').value,
      date: document.getElementById('donationDate').value
    });
    expect(errors.length).toBe(0);

    const donation = makeDonationObject({
      charity: document.getElementById('charity').value,
      amount: document.getElementById('amount').value,
      date: document.getElementById('donationDate').value,
      comment: document.getElementById('comment').value
    });

    saveToLocalStorage('csr_donations', [donation]);
    renderTableAndSummary(document);

    const tbody = document.querySelector('#donationsTable tbody');
    expect(tbody.children.length).toBe(1);
    const firstRowCells = tbody.querySelector('tr').querySelectorAll('td');
    expect(firstRowCells[0].textContent).toBe('Good Charity');
    expect(firstRowCells[1].textContent).toContain('20.00');

    const summaryText = document.getElementById('summary').textContent;
    expect(summaryText).toBe('Total donated: $20.00');

    const stored = loadFromLocalStorage('csr_donations');
    expect(Array.isArray(stored)).toBe(true);
    expect(stored.length).toBe(1);
    expect(stored[0].charity).toBe('Good Charity');
  });
});
