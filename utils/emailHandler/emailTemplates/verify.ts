export const emailVerificationTemplate = (verificationLink: string) => `<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    @media screen and (max-width: 600px) {
      .primary-button {
        font-size: 16px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #e8f1fc;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width: 100%; background-color: #e8f1fc;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0">
          <tr>            
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>      
                    <div style="text-align: center; margin-bottom: 20px;">
                      <h2 style="color: #001044; font-size: 24px; font-weight: 700; margin: 0;">Please verify your Email</h2>
                    </div>
                    <div style="text-align: center; margin-bottom: 20px;">
                      <p style="color: #001044; font-size: 14px; font-weight: 400; margin: 0;">Verify now to get started by clicking below.</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                      <tr>
                        <td align="center" bgcolor="#297afc" style="border-radius: 20px;">
                          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 700;">Verify Now</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 40px;">
                    <hr style="border: none; border-top: 1px solid #ccc; width: 100%; margin: 0 auto;">
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <p style="color: #297afc; font-size: 12px; font-weight: 400; margin: 0;">Some footer text.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
