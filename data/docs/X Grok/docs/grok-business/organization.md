#### Grok Business / Enterprise

# Organization Management

**Organizations provide a higher-level governance structure for enterprise customers, encompassing multiple console teams under unified IT controls.** Available only to Enterprise tier subscribers, organizations enable centralized management of users, teams, and security features like SSO.

Access the organization dashboard by visiting [console.x.ai/organization](https://console.x.ai/organization). This page is restricted to organization admins.

&#x20;Organizations are exclusive to the Enterprise tier. Contact xAI
sales to upgrade if needed.

## Understanding Organizations

An organization acts as an overarching entity that groups related console teams, ideal for large enterprises with multiple business units or departments.

Key features:

* **Domain Association:** Link your organization to a specific email domain (e.g., @yourcompany.com). Any user signing up or logging in with an email from this domain is automatically associated with the organization.
* **User Visibility:** Organization admins can view a comprehensive list of all associated users across teams on the `/organization` page.
* **Team Association:** Teams created by organization members are automatically linked to the organization and displayed in the dashboard for oversight.

This structure supports a multi-team architecture, allowing independent Grok Business or API teams while maintaining centralized governance, such as uniform access controls and auditing.

## Viewing Users and Teams

Monitor your enterprise's activity from a single pane of glass.

To view users:

1. Navigate to [console.x.ai/organization](https://console.x.ai/organization).
2. Scroll to the "Users" section for a list of all domain-associated users, including their team affiliations and access status.

To view teams:

1. In the same dashboard, access the "Teams" section.
2. Review associated console teams, their members, and high-level usage metrics.

Use these views to ensure compliance, spot inactive accounts, or identify growth needs.

## Setting Up SSO

Secure and streamline logins by integrating Single Sign-On (SSO) with your preferred Identity Provider (IdP).

To configure SSO:

1. On the `/organization` page, click "Configure SSO".
2. Choose your IdP from the supported list (e.g., Okta, Azure AD, Google Workspace).
3. Follow the self-guided, IdP-specific instructions provided—each includes step-by-step setup, metadata exchange, and attribute mapping details.
4. Save your configuration and test SSO to confirm the functionality.

SSO setup is straightforward and tailored to common providers, ensuring quick deployment.

## Activating SSO and User Impact

Once configured, SSO will be activated and enforced organization-wide.

Post-activation:

* Users must log in via SSO on their next access.
* If a user selects "Log in with email" and enters a domain-associated address, (e.g., @yourcompany.com) the system automatically detects it and redirects to your IdP for authentication.
* Non-domain emails (e.g., @differentcompany.com) fall back to standard login methods.

This ensures seamless, secure access without disrupting workflows.

&#x20;Notify your users in advance about the SSO rollout to minimize
support queries.

## Need Help?

For assistance with organization setup, SSO troubleshooting, or Enterprise features, contact xAI sales at [x.ai/grok/business/enquire](https://x.ai/grok/business/enquire).


