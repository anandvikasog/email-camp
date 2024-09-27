export const updatePasswordTemplate = () => `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Update Confirmation</title>
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
            <td bgcolor="#ffffff" style="padding: 40px 30px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="text-align: center; margin-bottom: 20px;">
                      <h2 style="color: #001044; font-size: 24px; font-weight: 700; margin: 0;">
                        Your password has been updated successfully
                      </h2>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 40px;">
                    <hr style="border: none; border-top: 1px solid #ccc; width: 100%; margin: 0 auto;">
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <p style="color: #297afc; font-size: 12px; font-weight: 400; margin: 0;">
                      If you did not request this change or have any questions, please contact our support team.
                    </p>
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
