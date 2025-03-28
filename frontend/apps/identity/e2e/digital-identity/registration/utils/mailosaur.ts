import { expect } from "@playwright/test";
import MailosaurClient from "mailosaur";

/**
 * Retrieve the registration OTP from Mailosaur
 * @param email the Mailosaur email address
 * @param receivedAfter the time after which the email is expected to have been sent
 * @returns the OTP code
 */
export async function retrieveRegistrationCodeFromMailosaur(email: string, receivedAfter: Date): Promise<string> {
  const mailosaur = new MailosaurClient(`${process.env.MAILOSAUR_API_AUTH ?? ""}`);
  const serverId = process.env.MAILOSAUR_SERVER ?? "";
  const bufferTimeInMs = 3000;

  const emailData = await mailosaur.messages.get(
    serverId,
    {
      sentTo: email,
    },
    {
      receivedAfter: new Date(receivedAfter.getTime() - bufferTimeInMs),
    },
  );

  const emailBody = emailData.text?.body ?? "";
  const code = /\d{6}/.exec(emailBody)?.[0];

  expect(emailBody).toContain("Here is your verification code for MyRAC");
  expect(emailBody).toContain(
    "Please copy and paste the code into your online form to complete the verification process.",
  );
  expect(code).toBeTruthy();

  return code ?? "";
}
