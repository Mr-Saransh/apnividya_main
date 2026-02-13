
const axios = require('axios');

async function test() {
    const courseId = '919df4e6-d716-43c3-b097-401662d5f81e'; // I'll try to find a real course ID
    try {
        const res = await axios.get('http://localhost:3000/api/courses/' + courseId);
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.log('Error Status:', error.response?.status);
        console.log('Error Data:', error.response?.data);
    }
}

test();
