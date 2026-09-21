const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';
  let token = '';

  console.log('1. Testing POST /api/register...');
  const regRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { name: 'Showcase User', email, password });

  console.log('Register status:', regRes.status, regRes.data?.message);
  if (regRes.status !== 201) throw new Error('Register failed');

  console.log('2. Testing POST /api/login...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email, password });

  console.log('Login status:', loginRes.status, loginRes.data?.message);
  token = loginRes.data?.data?.token;
  if (!token) throw new Error('Token not found in login');

  console.log('3. Testing GET /api/me...');
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Me status:', meRes.status, meRes.data?.data?.name);

  console.log('4. Testing POST /api/transactions (Income)...');
  const incRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: 'Gaji Pokok',
    amount: 10000000,
    type: 'INCOME',
    category: 'Gaji & Upah',
    date: new Date().toISOString(),
    description: 'Gaji bulan ini'
  });
  console.log('Income status:', incRes.status, incRes.data?.message);

  console.log('5. Testing POST /api/transactions (Expense)...');
  const expRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: 'Belanja Bulanan',
    amount: 1500000,
    type: 'EXPENSE',
    category: 'Belanja Kebutuhan',
    date: new Date().toISOString(),
    description: 'Supermarket'
  });
  console.log('Expense status:', expRes.status, expRes.data?.message);
  const expenseId = expRes.data?.data?.id;

  console.log('6. Testing GET /api/transactions/summary...');
  const sumRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions/summary',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Summary:', {
    balance: sumRes.data?.data?.totalBalance,
    income: sumRes.data?.data?.totalIncome,
    expense: sumRes.data?.data?.totalExpense,
    totalCount: sumRes.data?.data?.totalCount
  });

  if (sumRes.data?.data?.totalBalance !== 8500000) {
    throw new Error('Balance calculation mismatch');
  }

  console.log('7. Testing PUT /api/transactions/:id...');
  const putRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/transactions/${expenseId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: 'Belanja Bulanan & Buah',
    amount: 2000000,
    type: 'EXPENSE',
    category: 'Belanja Kebutuhan',
    date: new Date().toISOString(),
    description: 'Supermarket + pasar'
  });
  console.log('Update status:', putRes.status, putRes.data?.data?.title);

  console.log('8. Testing DELETE /api/transactions/:id...');
  const delRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/transactions/${expenseId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Delete status:', delRes.status, delRes.data?.message);

  console.log('\n--- ALL API TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
