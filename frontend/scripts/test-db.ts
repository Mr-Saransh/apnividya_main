import { db } from '../src/lib/db';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Testing DB Access...');
    try {
        const userCount = await db.user.count();
        console.log(`DB Connection Successful! User count: ${userCount}`);
    } catch (error) {
        console.error('DB Connection Failed:', error);
    }

    console.log('\nTesting Bcrypt...');
    try {
        const hash = await bcrypt.hash('test', 10);
        console.log('Bcrypt Successful! Hash:', hash);
        const match = await bcrypt.compare('test', hash);
        console.log('Bcrypt Compare Successful:', match);
    } catch (error) {
        console.error('Bcrypt Failed:', error);
    }
}

main().catch(console.error);
