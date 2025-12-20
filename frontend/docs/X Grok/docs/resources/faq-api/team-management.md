#### Resources / FAQ - xAI Console

# Team Management

## What are teams?

Teams are the level at which xAI tracks API usage, processes billing, and issues invoices.

* If you’re the team creator and don’t need a new team, you can rename your Personal Team and add members instead of creating a new one.
* Each team has **roles**:
  * **Admin**: Can modify team name, billing details, and manage members.
  * **Member**: Cannot make these changes.
  * The team creator is automatically an Admin.

## Which team am I on?

When you sign up for xAI, you’re automatically assigned to a **Personal Team**, which you can view the top bar of [xAI Console](https://console.x.ai).

## How can I manage teams and team members?

### Create a Team

1. Click the dropdown menu in the xAI Console.
2. Select **+ Create Team**.
3. Follow the on-screen instructions. You can edit these details later.

### Rename or Describe a Team

Admins can update the team name and description on the [Settings page](https://console.x.ai/team/default/settings).

### Manage Team Members

Admins can add or remove members by email on the [Users page](https://console.x.ai/team/default/users).

* Assign members as **Admin** or **Member**.
* If a user is removed, their API keys remain with the team.

### Delete a Team

Deleting a team removes its prepaid credits.

To permanently delete a team:

1. Go to the [Settings page](https://console.x.ai/team/default/settings).
2. Follow the instructions under **Delete Team**.

## How to automatically add users to team with my organization's email domain?

Admins can enable automatic team joining for users with a shared email domain:

1. Go to the [Settings page](https://console.x.ai/team/default/settings).
2. Add the domain under **Verified Domains**.
3. Add a `domain-verification` key to your domain’s DNS TXT record to verify ownership.

Users signing up with a verified domain email will automatically join the team.


