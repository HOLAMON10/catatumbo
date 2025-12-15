export const meetingReservationConfirmationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meeting Reservation Confirmed</title>
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
        .details-box {
            margin: 25px 0;
            padding: 20px;
            background: #f1f5f9;
            border-radius: 8px;
            font-size: 15px;
            line-height: 1.6;
        }
        .details-box strong {
            color: #1e88e5;
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

        <p>Your meeting has been successfully reserved.  
        The moment is set, the space prepared.</p>

        <div class="details-box">
            <p><strong>Meeting Title:</strong> {{meetingTitle}}</p>
            <p><strong>Date:</strong> {{meetingDate}}</p>
            <p><strong>Time:</strong> {{meetingTime}}</p>
            <p><strong>Location:</strong> {{meetingLocation}}</p>
        </div>

        <p>You can view or manage your reservation at any time:</p>

        <a href="{{meetingLink}}" class="button">View Meeting Details</a>

        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p>{{meetingLink}}</p>

        <div class="footer">
            This message was sent to {{email}}.<br />
            If you have questions or need to make changes, we’re here to help.
        </div>
    </div>
</body>
</html>
`;
