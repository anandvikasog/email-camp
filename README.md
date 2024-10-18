# environment variables
MONGODB_URI=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
JWT_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
ADMIN_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
OFFICIAL_FROM_MAIL=

# setting up microsoft account for connecting outlook for email campaign

login to Azure Entra ID account https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview

To allow users to connect their Microsoft accounts to your application and send emails on their behalf, you'll need to configure an app in **Microsoft Azure**. Here's a step-by-step guide on what resources to create and how to configure them.

### 1. **Register an Application in Azure Active Directory (Azure AD)**:

This is the essential resource that allows your app to authenticate users and request permissions to access Microsoft services on their behalf.

**Steps**:

-   Go to the [Azure portal](https://portal.azure.com/).
-   Navigate to **Azure Active Directory** → **App registrations**.
-   Click on **New registration**.

Fill in the following details:

-   **Name**: Choose a name for your app (e.g., "My Email Marketing App").
-   **Supported account types**: Select the appropriate option based on who can log in to your app.
    -   For your case, it could be "Accounts in any organizational directory and personal Microsoft accounts" if you want both work/school and personal accounts to use your app.
-   **Redirect URI**: Set the URI where Microsoft will redirect after users authenticate (e.g., `https://yourapp.com/connect-email/microsoft`). This is the URI that users will return to after logging in.

Once the app is registered, you'll get:

-   **Application (client) ID**: This is your app's client ID, used in your OAuth flow.
-   **Directory (tenant) ID**: This is the tenant ID, relevant if you’re working with specific organizational tenants.
-   **Client Secret**: You’ll need to generate a **client secret** if you’re doing server-side authentication (such as the authorization code flow). In your case, for implicit flow, it’s not required, but you may want to have it for future use.

### 2. **Configure API Permissions**:

After registering your app, you'll need to specify which Microsoft services (APIs) your app can access on behalf of the user.

**Steps**:

-   In your app's **App registration** page, go to **API permissions**.
-   Click **Add a permission**.
-   Select **Microsoft Graph**.
-   Under **Delegated permissions**, select the scopes you need:
    -   **`Mail.Send`**: Allows the app to send mail as the user.
    -   **`Mail.Read`**: Allows the app to read the user's mail.
    -   **`User.Read`**: Allows access to the signed-in user’s profile.
    -   Optionally, you can also add other permissions if needed, such as `offline_access` for long-term access (refresh tokens).

After adding these permissions, **Grant admin consent** to these permissions if needed (for organizational accounts). This step might not be required for personal accounts but is crucial for work/school accounts.

### 3. **Redirect URI Configuration**:

In the app registration portal, ensure you configure the redirect URI to match your app’s flow. For example:

-   **For implicit flow**: Add the URI where the user will be redirected after they authenticate, e.g., `https://yourapp.com/connect-email/microsoft`.
-   Make sure you select the "Web" type for redirect URIs.

### 4. **Authentication Settings**:

-   Go to the **Authentication** tab of your app.
-   Ensure that **Access tokens** (used for `response_type=token`) are enabled under the **Implicit grant and hybrid flows** section.

### 5. **Certificates & Secrets** (Optional):

If you're using the **Authorization Code Flow** or accessing APIs server-side, you'll need to create a **Client Secret**:

-   Go to **Certificates & Secrets**.
-   Click **New client secret** and create a new secret.
-   Save the generated secret as it won’t be displayed again.

This secret will be needed in your server-side code when exchanging authorization codes for access tokens.

### 6. **Set Up Microsoft Graph API**:

Since your app will likely be sending emails and tracking email status (like bounce, delivery, read), you’ll be using the **Microsoft Graph API**. The API permissions you set earlier (`Mail.Send`, `Mail.Read`) give your app the necessary access.

You can use these permissions with Microsoft Graph API endpoints to:

-   **Send an email**: Use `POST /me/sendMail` or `POST /users/{id}/sendMail`.
-   **Check email status** (such as read, delivery, bounce): You can track these via the `Mail.Read` permission by accessing the user's inbox and checking the message metadata.

### 7. **Optional - Multi-tenant Applications**:

If you want to allow both personal and work/school Microsoft accounts to sign in, ensure your app is configured as **multi-tenant**. This is done in the **App registrations** → **Supported account types** settings.

### Summary of Required Azure Resources:

1.  **App registration** in **Azure Active Directory**.
2.  **API Permissions**:
    -   `Mail.Send`
    -   `Mail.Read`
    -   `User.Read`
3.  **Client ID** (and optionally a **Client Secret** if you want to use server-side OAuth flows).
4.  **Redirect URI** set up correctly in the Azure portal.
5.  **Microsoft Graph API** to interact with emails (send, read, etc.).

### Example OAuth 2.0 URL for Implicit Flow:

Here’s the final URL for the Microsoft login popup (as shown in your earlier question):

    https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&redirect_uri=${redirectUri}&response_type=token&scope=Mail.Send Mail.Read User.Read&response_mode=fragment&prompt=select_account



# setting up google account for connecting gmail for email campaign

1. Create a new project
2. Go to **API and Services**
3. To setup API and Services, you need to first setup consent screen.
4. Choose **OAuth consent screen** from sidebar
5. Choose User Type as **External**
6. Fill step 1 data and continue
7. In step 2 (scope) add `/auth/gmail.send` and `/auth/gmail.modify`.
8. Add test users and continue
9. Now, Choose **Credentials** from side bar
10. Create new credential (OAuth client ID) and choose application type as web application.
11. Add authorised origins and redirect URIs.
12. Save **client_id** and **client_secret**
13. Now, go to **Enable API and services** from sidebar 
14. Enable **Gmail API** and **People API** api.directly)
