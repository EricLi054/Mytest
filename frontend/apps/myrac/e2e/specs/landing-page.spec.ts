import { expect, test, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';

test.describe('Landing Page and Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const landingPage = new LandingPage(page);

    await loginPage.goto();
    await loginPage.verifyLoginPageElements();
    await loginPage.login();

    await landingPage.verifyLandingPage();
  });
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Member navigate to landing page and other product page after login successfully', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.verifyManagePolicy();
    await landingPage.verifyOtherProduct();
  });

  test('verify update how you pay', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.verifyUpdateHowYouPay();
  });
});

const members = [
  {
    username: process.env.PLAYWRIGHT_BLUE_MEMBER,
    password: process.env.PLAYWRIGHT_BLUE_PASSWORD,
    expectedTier: 'Blue member',
    expectedCard: 'myRAC/card-Blue'
  },
  {
    username: process.env.PLAYWRIGHT_BRONZE_MEMBER,
    password: process.env.PLAYWRIGHT_BRONZE_PASSWORD,
    expectedTier: 'Bronze member',
    expectedCard: 'myRAC/card-Bronze'
  },
  {
    username: process.env.PLAYWRIGHT_RED_MEMBER,
    password: process.env.PLAYWRIGHT_RED_PASSWORD,
    expectedTier: 'Red member',
    expectedCard: 'myRAC/card-Red'
  },
  {
    username: process.env.PLAYWRIGHT_Silver_MEMBER,
    password: process.env.PLAYWRIGHT_Silver_PASSWORD,
    expectedTier: 'Silver member',
    expectedCard: 'myRAC/card-Silver'
  },
  {
    username: process.env.PLAYWRIGHT_Gold_MEMBER,
    password: process.env.PLAYWRIGHT_Gold_PASSWORD,
    expectedTier: 'Gold member',
    expectedCard: 'myRAC/card-Gold'
  },
  {
    username: process.env.PLAYWRIGHT_GoldLife_MEMBER,
    password: process.env.PLAYWRIGHT_GoldLife_PASSWORD,
    expectedTier: 'Gold Life member',
    expectedCard: 'myRAC/card-Gold Life'
  },
  {
    username: process.env.PLAYWRIGHT_Free2Go_MEMBER,
    password: process.env.PLAYWRIGHT_Free2Go_PASSWORD,
    expectedTier: 'Free2Go member',
    expectedCard: 'myRAC/card-Free2Go'
  },
  // Staff member will be covered in the Digital Card path
  // {
  //   username: process.env.PLAYWRIGHT_STAFF_MEMBER,
  //   password: process.env.PLAYWRIGHT_STAFF_PASSWORD,
  //   expectedTier: 'Staff member',
  // expectedCard: 'myRAC/card-Gold'
  // },
  {
    username: process.env.PLAYWRIGHT_IGNITE_MEMBER,
    password: process.env.PLAYWRIGHT_IGNITE_PASSWORD,
    expectedTier: 'RAC Ignite member',
    expectedCard: 'myRAC/card-RAC Ignite'
  }
];

test.describe('Member Tier Validation', () => {
  test.afterEach(async ({ page }) => {
    // await page.close();
  });
  for (const member of members) {
    test(`Member login as ${member.expectedTier} and verify tier and card`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const landingPage = new LandingPage(page);

      await loginPage.goto();
      await loginPage.verifyLoginPageElements();
      await loginPage.loginEach(member.username || '', member.password || '');

      await landingPage.validateMemberTier(member.expectedTier, member.expectedCard);
    });
  }
});
