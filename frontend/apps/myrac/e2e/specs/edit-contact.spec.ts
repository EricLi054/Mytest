import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';

test.describe('Member edit contact details successfully', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const landingPage = new LandingPage(page);

    await loginPage.goto();
    await loginPage.verifyLoginPageElements();
    await loginPage.loginForDigitalCard();

    await landingPage.verifyLandingPage();
  });
  test.afterEach(async ({ page }) => {
    // await page.close();
  });

  test('verify edit contact details', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const profilePage = new ProfilePage(page);
    const contactDetailsPage = new ContactDetailsPage(page);
    await landingPage.openProfilePage();
    await profilePage.verifyProfilePage();
    await profilePage.openContactDetailsPage();
    await contactDetailsPage.verifyContactDetailsPage();
  });

  test('edit contact details', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const profilePage = new ProfilePage(page);
    const contactDetailsPage = new ContactDetailsPage(page);
    await landingPage.openProfilePage();
    await profilePage.verifyProfilePage();
    await profilePage.openContactDetailsPage();
    await contactDetailsPage.verifyContactDetailsPage();
    await contactDetailsPage.editContactDetails();
  });

  test('address lookup and update', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const profilePage = new ProfilePage(page);
    const contactDetailsPage = new ContactDetailsPage(page);

    await landingPage.openProfilePage();
    await profilePage.openContactDetailsPage();
    await contactDetailsPage.updateAddress('832 Wellington Street, WEST PERTH  WA  6005');
    await contactDetailsPage.verifyAddressUpdate('832 Wellington St WEST PERTH, WA 6005');
  });
});
