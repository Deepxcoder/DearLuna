# Email Notification Script

Use this script to send a notification email.

## 1) Set environment variables

PowerShell example:

```powershell
$env:SMTP_HOST='smtp.gmail.com'
$env:SMTP_PORT='587'
$env:SMTP_USER='your-smtp-user'
$env:SMTP_PASS='your-smtp-pass'
$env:SMTP_SECURE='false'
$env:EMAIL_FROM='DearLuna <you@example.com>'
$env:EMAIL_TO='user@example.com'
```

## 2) Run

```powershell
npm run notify:email -- --subject "Hydration Reminder" --text "Please log your water intake for today."
```

You can also pass recipient with `--to "person@example.com"`.
