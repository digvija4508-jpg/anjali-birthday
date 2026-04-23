const fetch = require('node-fetch');

async function testKV() {
    const url = 'https://keyvalue.xyz/v1/test_anjali_123';
    const data = [{name: 'Test', message: 'Hello'}];
    
    console.log('Sending data...');
    const postRes = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    console.log('POST status:', postRes.status);
    
    console.log('Fetching data...');
    const getRes = await fetch(url);
    console.log('GET status:', getRes.status);
    const text = await getRes.text();
    console.log('GET body:', text);
}

testKV();
