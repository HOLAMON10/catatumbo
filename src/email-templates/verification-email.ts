export const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f7f7f7;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        a.button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            background: #1e88e5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
        }
        .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello {{firstName}},</h2>

        <p>Your account is almost ready — just one final breath of confirmation remains.</p>

        <p>Please verify your email by clicking the link below:</p>

        <a href="{{verificationLink}}" class="button">Verify Email</a>

        <p>If the button above does not open, you may also copy this link into your browser:</p>

        <p>{{verificationLink}}</p>

        <div class="footer">
            This message was sent to {{email}}.<br />
            If you did not request this, you may safely ignore the message.
        </div>
    </div>
</body>
</html>
`;
