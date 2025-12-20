#### Resources / FAQ - xAI API

# Security

## Does xAI train on customers' API requests?

xAI never trains on your API inputs or outputs without your explicit permission.

API requests and responses are temporarily stored on our servers for 30 days in case they need to be audited for potential abuse or misuse. This data is automatically deleted after 30 days.

## Is the xAI API HIPAA compliant?

To inquire about a Business Associate Agreement (BAA), please complete our [BAA Questionnaire](https://forms.gle/YAEdX3XUp6MvdEXW9). A member of our team will review your responses and reach out with next steps.

## Is xAI GDPR and SOC II compliant?

We are SOC 2 Type 2 compliant. Customers with a signed NDA can refer to our [Trust Center](https://trust.x.ai/) for up-to-date information on our certifications and data governance.

## Do you have Audit Logs?

Team admins are able to view an audit log of user interactions. This lists all of the user interactions with our API server. You can view it at [xAI Console -> Audit Log](https://console.x.ai/team/default/audit).

The admin can also search by Event ID, Description or User to filter the results shown. For example, this is to filter by description matching `ListApiKeys`:

You can also view the audit log across a range of dates with the time filter:

## How can I securely manage my API keys?

Treat your xAI API keys as sensitive information, like passwords or credit card details. Do not share keys between teammates to avoid unauthorized access. Store keys securely using environment variables or secret management tools. Avoid committing keys to public repositories or source code.

Rotate keys regularly for added security. If you suspect a compromise, log into the xAI console first. Ensure you are viewing the correct team, as API keys are tied to specific teams. Navigate to the "API Keys" section via the sidebar. In the API Keys table, click the vertical ellipsis (three dots) next to the key. Select "Disable key" to deactivate it temporarily or "Delete key" to remove it permanently. Then, click the "Create API Key" button to generate a new one and update your applications.

xAI partners with GitHub's Secret Scanning program to detect leaked keys. If a leak is found, we disable the key and notify you via email. Monitor your account for unusual activity to stay protected.


