export const recoveryTokenEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Recovery</title>
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
        .token-box {
            margin: 25px 0;
            padding: 15px 20px;
            background: #1e88e5;
            color: white;
            font-size: 28px;
            text-align: center;
            border-radius: 8px;
            letter-spacing: 6px;
            font-weight: bold;
        }
        a.button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            background: #1e88e5;
            color: #ffffff !important;
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

        <p>A request to reset your password has been received.</p>

        <p>Your 6-digit recovery code:</p>

        <div class="token-box">
            {{token}}
        </div>

        <p>You may also click the button below to reset your password:</p>

        <a href="{{recoveryLink}}" class="button">Reset Password</a>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>{{recoveryLink}}</p>

        <div class="footer">
            This message was sent to {{email}}.<br />
            If this wasn’t you, no changes have been made.
        </div>
    </div>
</body>
</html>
`;
