// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'dltdv24vg'
