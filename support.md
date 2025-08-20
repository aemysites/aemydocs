# Internal Resources

Access to Experience Catalyst is currently limited to Adobe internal users.

## Access Request Process

1. New users, join the [#experience-catalyst-users](https://adobe.enterprise.slack.com/archives/experience-catalyst-users) Slack channel.
2. Send a Slack message to request access to Experience Catalyst, **providing your personal GitHub username** (not your enterprise GitHub ID with "_adobe" in the name) and **mentioning the type of project** (SharePoint or DA).
3. A team member will respond to your Slack message and provision you with a **GitHub code repository** and either a **SharePoint folder** or **DA folder** (depending on your project type). You'll get the link to those in their reply.
4. You'll also receive a **GitHub invitation email** from the team member doing your provisioning. You'll get that email on the email address associated with the GitHub username you provided, and its subject should be something like "USER invited you to aemysites/YOUR_GIT_REPO".
5. It's important that in that email, you click the **View invitation** link and then click **Accept invitation** on the page that opens. This step is required to actually activate your access (until you accept, you won't be able to contribute to the GtiHub repository).

> **Note (For DA projects)**:
> * Add your IMS token as a repository secret for GitHub Actions: `Settings` > `Secrets and variables` > `Actions` > `New repository secret` → name `IMS_TOKEN`, value = your IMS token (`IMS_TOKEN=...`).
> * This token is required to preview and publish content to Edge Delivery Service.
> * After setting the token, retry the AEMY Setup Content issue (the previous run would have failed due to the missing token).

It's time now for you to try out the [Experience Catalyst tutorial](tutorial.md).

## Technical Support

**Slack Channel**: If you need assistance or have feedback about Experience Catalyst, feel free to post in the [#experience-catalyst-users](https://adobe.enterprise.slack.com/archives/experience-catalyst-users) Slack channel. We're here to help!

---

*Experience Catalyst is available as Early Access Technology. Contact your Adobe representative for access.*
