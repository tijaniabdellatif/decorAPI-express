import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test',
});

console.log('🔧 Test setup initialized');

// Set test environment
process.env.NODE_ENV = 'test';
