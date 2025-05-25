export const verifyEmailHtml = (name,verifyToken) =>(`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - PKey</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f7fafc;
      color: #1a202c;
      /* Dark text for light mode */
      line-height: 1.6;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0f172a;
        color: #e2e8f0;/
      }
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .container {
        background-color: #1f2937;
        border: 1px solid #4a5568;
      }
    }

    .header {
      padding: 24px;
      text-align: center;
      background-color: #edf2f7;
      border-bottom: 1px solid #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .header {
        background-color: #2d3748;
        border-bottom: 1px solid #4a5568;
      }
    }

    .header h1 {
      font-size: 24px;
      color: #2b6cb0;
      margin: 0;
      font-weight: 700;
    }

    @media (prefers-color-scheme: dark) {
      .header h1 {
        color: #63b3ed;
      }
    }

    .content {
      padding: 30px 24px;
      text-align: left;
    }

    .content p {
      margin-bottom: 15px;
      font-size: 16px;
      color: #4a5568;
    }

    @media (prefers-color-scheme: dark) {
      .content p {
        color: #cbd5e0;
      }
    }

    .content b {
      color: #2b6cb0;
    }

    @media (prefers-color-scheme: dark) {
      .content b {
        color: #63b3ed;
      }
    }

    .button-wrapper {
      text-align: center;
      margin-top: 25px;
      margin-bottom: 25px;
    }

    .button {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 50px;
      background-image: linear-gradient(to right, #4299e1, #805ad5);
      color: #ffffff;
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      border: none;
    }

    .button:hover {
      background-image: linear-gradient(to right, #3182ce, #6b46c1);
      transform: translateY(-2px);
    }

    @media (prefers-color-scheme: dark) {
      .button {
        background-image: linear-gradient(to right, #63b3ed, #a78bfa);
      }

      .button:hover {
        background-image: linear-gradient(to right, #4299e1, #805ad5);
      }
    }

    .footer {
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
      background-color: #edf2f7;
    }

    @media (prefers-color-scheme: dark) {
      .footer {
        color: #a0aec0;
        border-top: 1px solid #4a5568;
        background-color: #2d3748;
      }
    }

    .footer a {
      color: #2b6cb0;
      text-decoration: none;
    }

    @media (prefers-color-scheme: dark) {
      .footer a {
        color: #63b3ed;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>PKey</h1>
      <p style="font-size: 16px; color: #4a5568; margin-top: 10px;">Secure your digital life.</p>
    </div>

    <div class="content">
      <p>Hello <b>${name}</b>,</p>
      <p>Thank you for registering with <strong>PKey</strong>! To complete your registration and secure your account, please verify
        your email address by clicking the button below:</p>

      <div class="button-wrapper">
        <a href="${
          process.env.NEXT_PUBLIC_BASE_URL
        }/auth/verifyemail/${verifyToken}" class="button">
          Verify Your Email
        </a>
      </div>

      <p>If the button above doesn't work, you can also copy and paste the following link into your web browser:</p>
      <p style="font-size: 14px; word-break: break-all; color: #4a5568; overflow-wrap: break-word;">
        <a href="${
          process.env.NEXT_PUBLIC_BASE_URL
        }/auth/verifyemail/${verifyToken}"
          style="color: #2b6cb0; text-decoration: underline; font-size: 14px;">${
            process.env.NEXT_PUBLIC_BASE_URL
          }/auth/verifyemail/${verifyToken}</a>
      </p>

      <p style="margin-top: 25px; color: #718096;">If you did not create an account with PKey, please ignore this email.
      </p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PKey. All rights reserved.</p>
      <p>Built for privacy, powered by trust.</p>
      <p><a href="${
        process.env.NEXT_PUBLIC_BASE_URL
      }/privacy-policy">Privacy Policy</a> | <a
          href="${
            process.env.NEXT_PUBLIC_BASE_URL
          }/terms&conditions">Terms & Conditions</a></p>
    </div>
  </div>
</body>
</html>
`);

export const VaultResetHtml = (name)=>`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PKey Vault Has Been Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f7fafc;
      color: #1a202c;
      line-height: 1.6;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0f172a;
        color: #e2e8f0;
      }
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .container {
        background-color: #1f2937;
        border: 1px solid #4a5568;
      }
    }

    .header {
      padding: 24px;
      text-align: center;
      background-color: #edf2f7;
      border-bottom: 1px solid #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .header {
        background-color: #2d3748;
        border-bottom: 1px solid #4a5568;
      }
    }

    .header h1 {
      font-size: 24px;
      color: #d97706;
      /* Orange for alert/warning */
      margin: 0;
      font-weight: 700;
    }

    @media (prefers-color-scheme: dark) {
      .header h1 {
        color: #fbbf24;
        /* Lighter orange for dark mode */
      }
    }

    .header p {
      font-size: 16px;
      color: #4a5568;
      margin-top: 10px;
    }

    .content {
      padding: 30px 24px;
      text-align: left;
    }

    .content p {
      margin-bottom: 15px;
      font-size: 16px;
      color: #4a5568;
    }

    @media (prefers-color-scheme: dark) {
      .content p {
        color: #cbd5e0;
      }
    }

    .content b {
      color: #2b6cb0;
    }

    @media (prefers-color-scheme: dark) {
      .content b {
        color: #63b3ed;
      }
    }

    .content .alert {
      background-color: #fef2f2;
      /* Light red background */
      border-left: 4px solid #ef4444;
      /* Red border */
      padding: 15px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #b91c1c;
      /* Dark red text */
      border-radius: 4px;
    }

    @media (prefers-color-scheme: dark) {
      .content .alert {
        background-color: #450a0a;
        border-left: 4px solid #ef4444;
        color: #fca5a5;
      }
    }

    .button-wrapper {
      text-align: center;
      margin-top: 25px;
      margin-bottom: 25px;
    }

    .button {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 50px;
      background-image: linear-gradient(to right, #4299e1, #805ad5);
      color: #ffffff;
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      border: none;
    }

    .button:hover {
      background-image: linear-gradient(to right, #3182ce, #6b46c1);
      transform: translateY(-2px);
    }

    @media (prefers-color-scheme: dark) {
      .button {
        background-image: linear-gradient(to right, #63b3ed, #a78bfa);
      }

      .button:hover {
        background-image: linear-gradient(to right, #4299e1, #805ad5);
      }
    }

    .footer {
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
      background-color: #edf2f7;
    }

    @media (prefers-color-scheme: dark) {
      .footer {
        color: #a0aec0;
        border-top: 1px solid #4a5568;
        background-color: #2d3748;
      }
    }

    .footer a {
      color: #2b6cb0;
      text-decoration: none;
    }

    @media (prefers-color-scheme: dark) {
      .footer a {
        color: #63b3ed;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Vault Reset Confirmed</h1>
      <p>Your PKey vault has been successfully reset.</p>
    </div>

    <div class="content">
      <p>Hello <b>${name}</b>,</p>
      <div class="alert">
        <p style="margin: 0; color: inherit;">
          <strong>Important:</strong> Your PKey vault has been <strong>successfully reset</strong> as per your request. All
          previously stored passwords and data have been permanently deleted from your account.
        </p>
      </div>
      <p>You can now log in with your new master password and start adding your passwords again. We recommend setting a
        strong, unique master password to ensure maximum security.</p>

      <div class="button-wrapper">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/sign-in" class="button">
          Log In to Your Account
        </a>
      </div>

    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PKey. All rights reserved.</p>
      <p>Built for privacy, powered by trust.</p>
      <p><a href="${
        process.env.NEXT_PUBLIC_BASE_URL
      }/privacy-policy">Privacy Policy</a> | <a
          href="${
            process.env.NEXT_PUBLIC_BASE_URL
          }/terms&conditions">Terms & Conditions</a></p>
    </div>
  </div>
</body>

</html>
`;

export const accountDeleteHtml = (name)=>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PKey Account Has Been Deleted</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f7fafc;
            color: #1a202c;
            line-height: 1.6;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #0f172a;
                color: #e2e8f0;
            }
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            .container {
                background-color: #1f2937;
                border: 1px solid #4a5568;
            }
        }

        .header {
            padding: 24px;
            text-align: center;
            background-color: #edf2f7;
            border-bottom: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            .header {
                background-color: #2d3748;
                border-bottom: 1px solid #4a5568;
            }
        }
        .header h1 {
            font-size: 24px;
            color: #dc2626; /* Red for deletion */
            margin: 0;
            font-weight: 700;
        }
        @media (prefers-color-scheme: dark) {
            .header h1 {
                color: #f87171; /* Lighter red for dark mode */
            }
        }
        .header p {
            font-size: 16px;
            color: #4a5568;
            margin-top: 10px;
        }

        .content {
            padding: 30px 24px;
            text-align: left;
        }
        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            color: #4a5568;
        }
        @media (prefers-color-scheme: dark) {
            .content p {
                color: #cbd5e0;
            }
        }
        .content b {
            color: #2b6cb0;
        }
        @media (prefers-color-scheme: dark) {
            .content b {
                color: #63b3ed;
            }
        }
        .content .alert {
            background-color: #fef2f2; /* Light red background */
            border-left: 4px solid #ef4444; /* Red border */
            padding: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #b91c1c; /* Dark red text */
            border-radius: 4px;
        }
        @media (prefers-color-scheme: dark) {
            .content .alert {
                background-color: #450a0a;
                border-left: 4px solid #ef4444;
                color: #fca5a5;
            }
        }

        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
            background-color: #edf2f7;
        }
        @media (prefers-color-scheme: dark) {
            .footer {
                color: #a0aec0;
                border-top: 1px solid #4a5568;
                background-color: #2d3748;
            }
        }
        .footer a {
            color: #2b6cb0;
            text-decoration: none;
        }
        @media (prefers-color-scheme: dark) {
            .footer a {
                color: #63b3ed;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Deleted</h1>
            <p>Your PKey account has been successfully deleted.</p>
        </div>

        <div class="content">
            <p>Hello <b>${name}</b>,</p>
            <div class="alert">
                <p style="margin: 0; color: inherit;">
                    <strong>Confirmation:</strong> Your PKey account has been <strong>permanently deleted</strong> as per your request. All associated data, including your saved passwords, secure notes, and account information, has been removed from our systems.
                </p>
            </div>
            <p>Please note that this action is irreversible, and your account cannot be recovered. If you wish to use PKey again in the future, you will need to create a new account.</p>

            <p style="margin-top: 25px; color: #718096;">We understand you've chosen to leave PKey. If you ever change your mind or have any feedback, please don't hesitate to contact us.</p>
        </div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PKey. All rights reserved.</p>
            <p>Built for privacy, powered by trust.</p>
            <p><a href="${
              process.env.NEXT_PUBLIC_BASE_URL
            }/privacy-policy">Privacy Policy</a> | <a href="${
  process.env.NEXT_PUBLIC_BASE_URL
}/terms&conditions">Terms & Conditions</a></p>
        </div>
    </div>
</body>
</html>
`;

export const forgotPasswordHtml =  (name, verifyToken) =>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PKey Password Reset Request</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f7fafc;
            color: #1a202c;
            line-height: 1.6;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #0f172a;
                color: #e2e8f0;
            }
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            .container {
                background-color: #1f2937;
                border: 1px solid #4a5568;
            }
        }

        .header {
            padding: 24px;
            text-align: center;
            background-color: #edf2f7;
            border-bottom: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            .header {
                background-color: #2d3748;
                border-bottom: 1px solid #4a5568;
            }
        }
        .header h1 {
            font-size: 24px;
            color: #2b6cb0;
            margin: 0;
            font-weight: 700;
        }
        @media (prefers-color-scheme: dark) {
            .header h1 {
                color: #63b3ed;
            }
        }
        .header p {
            font-size: 16px;
            color: #4a5568;
            margin-top: 10px;
        }

        .content {
            padding: 30px 24px;
            text-align: left;
        }
        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            color: #4a5568;
        }
        @media (prefers-color-scheme: dark) {
            .content p {
                color: #cbd5e0;
            }
        }
        .content b {
            color: #2b6cb0;
        }
        @media (prefers-color-scheme: dark) {
            .content b {
                color: #63b3ed;
            }
        }

        .button-wrapper {
            text-align: center;
            margin-top: 25px;
            margin-bottom: 25px;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            border-radius: 50px;
            background-image: linear-gradient(to right, #4299e1, #805ad5);
            color: #ffffff;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            border: none;
        }
        .button:hover {
            background-image: linear-gradient(to right, #3182ce, #6b46c1);
            transform: translateY(-2px);
        }
        @media (prefers-color-scheme: dark) {
            .button {
                background-image: linear-gradient(to right, #63b3ed, #a78bfa);
            }
            .button:hover {
                background-image: linear-gradient(to right, #4299e1, #805ad5);
            }
        }

        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
            background-color: #edf2f7;
        }
        @media (prefers-color-scheme: dark) {
            .footer {
                color: #a0aec0;
                border-top: 1px solid #4a5568;
                background-color: #2d3748;
            }
        }
        .footer a {
            color: #2b6cb0;
            text-decoration: none;
        }
        @media (prefers-color-scheme: dark) {
            .footer a {
                color: #63b3ed;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
            <p>Securely reset your PKey password.</p>
        </div>

        <div class="content">
            <p>Hello <b>${name || "User"}</b>,</p>
            <p>You recently requested to reset your password for your PKey account. Click the button below to proceed:</p>

            <div class="button-wrapper">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword/${verifyToken}" class="button">
                    Reset Password
                </a>
            </div>

            <p>This link will expire in <strong>10 minutes</strong> for security reasons. If the button above doesn't work, you can also copy and paste the following link into your web browser:</p>
            <p style="font-size: 14px; word-break: break-all; color: #4a5568; overflow-wrap: break-word;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword/${verifyToken}" style="color: #2b6cb0; text-decoration: underline; font-size: 14px;">${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword/${verifyToken}</a>
            </p>

            <p style="margin-top: 25px; color: #718096;">If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
        </div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PKey. All rights reserved.</p>
            <p>Built for privacy, powered by trust.</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy">Privacy Policy</a> | <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms&conditions">Terms & Conditions</a></p>
        </div>
    </div>
</body>
</html>`

export const passwordResetHtml = (name)=> `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PKey Password Has Been Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f7fafc;
      color: #1a202c;
      line-height: 1.6;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0f172a;
        color: #e2e8f0;
      }
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .container {
        background-color: #1f2937;
        border: 1px solid #4a5568;
      }
    }

    .header {
      padding: 24px;
      text-align: center;
      background-color: #edf2f7;
      border-bottom: 1px solid #e2e8f0;
    }

    @media (prefers-color-scheme: dark) {
      .header {
        background-color: #2d3748;
        border-bottom: 1px solid #4a5568;
      }
    }

    .header h1 {
      font-size: 24px;
      color: #059669;
      /* Green for success */
      margin: 0;
      font-weight: 700;
    }

    @media (prefers-color-scheme: dark) {
      .header h1 {
        color: #34d399;
        /* Lighter green for dark mode */
      }
    }

    .header p {
      font-size: 16px;
      color: #4a5568;
      margin-top: 10px;
    }

    .content {
      padding: 30px 24px;
      text-align: left;
    }

    .content p {
      margin-bottom: 15px;
      font-size: 16px;
      color: #4a5568;
    }

    @media (prefers-color-scheme: dark) {
      .content p {
        color: #cbd5e0;
      }
    }

    .content b {
      color: #2b6cb0;
    }

    @media (prefers-color-scheme: dark) {
      .content b {
        color: #63b3ed;
      }
    }

    .content .alert {
      background-color: #ecfdf5;
      /* Light green background */
      border-left: 4px solid #10b981;
      /* Green border */
      padding: 15px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #065f46;
      /* Dark green text */
      border-radius: 4px;
    }

    @media (prefers-color-scheme: dark) {
      .content .alert {
        background-color: #064e3b;
        border-left: 4px solid #10b981;
        color: #a7f3d0;
      }
    }

    .button-wrapper {
      text-align: center;
      margin-top: 25px;
      margin-bottom: 25px;
    }

    .button {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 50px;
      background-image: linear-gradient(to right, #4299e1, #805ad5);
      color: #ffffff;
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      border: none;
    }

    .button:hover {
      background-image: linear-gradient(to right, #3182ce, #6b46c1);
      transform: translateY(-2px);
    }

    @media (prefers-color-scheme: dark) {
      .button {
        background-image: linear-gradient(to right, #63b3ed, #a78bfa);
      }

      .button:hover {
        background-image: linear-gradient(to right, #4299e1, #805ad5);
      }
    }

    .footer {
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
      background-color: #edf2f7;
    }

    @media (prefers-color-scheme: dark) {
      .footer {
        color: #a0aec0;
        border-top: 1px solid #4a5568;
        background-color: #2d3748;
      }
    }

    .footer a {
      color: #2b6cb0;
      text-decoration: none;
    }

    @media (prefers-color-scheme: dark) {
      .footer a {
        color: #63b3ed;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Password Successfully Reset!</h1>
      <p>Your PKey account password has been updated.</p>
    </div>

    <div class="content">
      <p>Hello <b>${name}</b>,</p>
      <div class="alert">
        <p style="margin: 0; color: inherit;">
          <strong>Success!</strong> Your password for your PKey account has been <strong>successfully reset</strong> as per your
          recent request.
        </p>
      </div>
      <p>You can now log in to your PKey account using your new password. We recommend choosing a strong, unique
        password and storing it securely.</p>

      <div class="button-wrapper">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/sign-in" class="button">
          Log In Now
        </a>
      </div>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PKey. All rights reserved.</p>
      <p>Built for privacy, powered by trust.</p>
      <p><a href="${
        process.env.NEXT_PUBLIC_BASE_URL
      }/privacy-policy">Privacy Policy</a> | <a
          href="${
            process.env.NEXT_PUBLIC_BASE_URL
          }/terms&conditions">Terms & Conditions</a></p>
    </div>
  </div>
</body>

</html>
`;
export const accountBlocked = (name) =>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PKey Account Has Been Temporarily Blocked</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f7fafc;
            color: #1a202c;
            line-height: 1.6;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #0f172a;
                color: #e2e8f0;
            }
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            .container {
                background-color: #1f2937;
                border: 1px solid #4a5568;
            }
        }

        .header {
            padding: 24px;
            text-align: center;
            background-color: #edf2f7;
            border-bottom: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            .header {
                background-color: #2d3748;
                border-bottom: 1px solid #4a5568;
            }
        }
        .header h1 {
            font-size: 24px;
            color: #d97706; /* Orange for warning */
            margin: 0;
            font-weight: 700;
        }
        @media (prefers-color-scheme: dark) {
            .header h1 {
                color: #fbbf24; /* Lighter orange for dark mode */
            }
        }
        .header p {
            font-size: 16px;
            color: #4a5568;
            margin-top: 10px;
        }

        .content {
            padding: 30px 24px;
            text-align: left;
        }
        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            color: #4a5568;
        }
        @media (prefers-color-scheme: dark) {
            .content p {
                color: #cbd5e0;
            }
        }
        .content b {
            color: #2b6cb0;
        }
        @media (prefers-color-scheme: dark) {
            .content b {
                color: #63b3ed;
            }
        }
        .content .security-alert {
            background-color: #fffbeb; /* Light yellow/orange background */
            border-left: 4px solid #f97316; /* Orange border */
            padding: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #ea580c; /* Dark orange text */
            border-radius: 4px;
        }
        @media (prefers-color-scheme: dark) {
            .content .security-alert {
                background-color: #7c2d12;
                border-left: 4px solid #f97316;
                color: #fed7aa;
            }
        }

        .button-wrapper {
            text-align: center;
            margin-top: 25px;
            margin-bottom: 25px;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            border-radius: 50px;
            background-image: linear-gradient(to right, #4299e1, #805ad5);
            color: #ffffff;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            border: none;
        }
        .button:hover {
            background-image: linear-gradient(to right, #3182ce, #6b46c1);
            transform: translateY(-2px);
        }
        @media (prefers-color-scheme: dark) {
            .button {
                background-image: linear-gradient(to right, #63b3ed, #a78bfa);
            }
            .button:hover {
                background-image: linear-gradient(to right, #4299e1, #805ad5);
            }
        }

        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
            background-color: #edf2f7;
        }
        @media (prefers-color-scheme: dark) {
            .footer {
                color: #a0aec0;
                border-top: 1px solid #4a5568;
                background-color: #2d3748;
            }
        }
        .footer a {
            color: #2b6cb0;
            text-decoration: none;
        }
        @media (prefers-color-scheme: dark) {
            .footer a {
                color: #63b3ed;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Permanently Blocked</h1>
            <p>A security measure for your protection.</p>
        </div>

        <div class="content">
            <p>Hello <b>${name}</b>,</p>
            <div class="security-alert">
                <p style="margin: 0; color: inherit;">
                    <strong>Security Alert:</strong> Your PKey account has been <strong>permanently blocked</strong> due to multiple incorrect master password attempts. This is a crucial security measure to protect your sensitive data from unauthorized access.
                </p>
            </div>
            <p>To regain access to your account and vault, you will need to reset your vault. Please remember that resetting your vault will <strong>permanently delete</strong> all your saved passwords and data, and this action cannot be undone.</p>

            <div class="button-wrapper">
                <a href="${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/blocked-accounts-help" class="button">
                    Learn How to Regain Access
                </a>
            </div>

</div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PKey. All rights reserved.</p>
            <p>Built for privacy, powered by trust.</p>
            <p><a href="${
              process.env.NEXT_PUBLIC_BASE_URL
            }/privacy-policy">Privacy Policy</a> | <a href="${
  process.env.NEXT_PUBLIC_BASE_URL
}/terms&conditions">Terms & Conditions</a></p>
        </div>
    </div>
</body>
</html>
`;
