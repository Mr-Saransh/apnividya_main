async function main() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://127.0.0.1:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'hcverma@example.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.accessToken;
        console.log('Got token:', token ? 'YES' : 'NO');

        // 2. Ask RAG
        const lessonId = '06247e26-3411-4c98-978a-4676c49c8fc5'; // using the one found earlier
        console.log('Asking AI about lesson:', lessonId);

        const ragRes = await fetch('http://127.0.0.1:3001/api/rag/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                lessonId,
                question: 'Explain the first law briefly.'
            })
        });

        if (!ragRes.ok) {
            const errText = await ragRes.text();
            throw new Error(`RAG failed: ${ragRes.status} ${errText}`);
        }

        const ragData = await ragRes.json();
        console.log('AI Response:', ragData);

    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

main();
