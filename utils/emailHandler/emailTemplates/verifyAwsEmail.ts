export const awsEmailVerificationTemplate = () => `
<html>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #e8f1fc;">
    <table width="100%" style="min-width: 100%; background-color: #e8f1fc;">
      <tr>
        <td style="text-align: center;">
          <table width="600" style="background-color: #ffffff; padding: 40px 30px;">
            <tr>
              <td>
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #001044; font-size: 24px; font-weight: 700; margin: 0;">Please verify your Email</h2>
                </div>
                <div style="text-align: center; margin-bottom: 20px;">
                  <p style="color: #001044; font-size: 14px; font-weight: 400; margin: 0;">Verify now to get started by using the link below.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; margin-top: 20px;">
                <p style="font-size: 16px; font-weight: bold;">{{VerificationLink}}</p>
                <p style="font-size: 14px;">Click the link above or copy-paste it into your browser to verify your email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 40px; text-align: center;">
                <hr style="border: none; border-top: 1px solid #ccc; width: 100%; margin: 0 auto;">
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px; text-align: center;">
                <p style="color: #297afc; font-size: 12px;">Some footer text.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
