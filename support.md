# Internal Resources

Access to Experience Catalyst is currently limited to Adobe internal users.

## Access Request Process

1. New users, join the [#experience-catalyst-users](https://adobe.enterprise.slack.com/archives/experience-catalyst-users) Slack channel.
2. Send a Slack message to request access to Experience Catalyst, **providing your personal GitHub username**. That would **not** be your enterprise GitHub ID with "_adobe" in the name.
3. A team member will respond to your Slack message and provision you with a **GitHub code repository** and a **SharePoint folder**. You'll get the link to those in their reply. If you're requesting crosswalk access, mention your AEM URL and you will be pointed to a GitHub repo with an updated fstab.yaml and paths.json pointing to your AEM URL.
4. You'll also receive a **GitHub invitation email** from the team member doing your provisioning. You'll get that email on the email address associated with the GitHub username you provided, and its subject should be something like "USER invited you to aemysites/YOUR_GIT_REPO".
5. It's important that in that email, you click the **View invitation** link and then click **Accept invitation** on the page that opens. This step is required to actually activate your access (until you accept, you won't be able to contribute to the GtiHub repository).
6. For DA project, you'll need an IMS token configured in your GitHub repository secrets for upload and preview functionality to work properly. See [DA Projects: IMS Token Setup](support.md#da-projects-ims-token-setup) on how to generate an IMS token and configure it as a repository secret.

## DA Projects: IMS Token Setup

### Step 1: Generate IMS Token
- Follow the [IMS API reference](https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/ims#fetching-access-tokens) to generate an Access Token.

### Step 2: Add Token to GitHub Repository
- Go to your GitHub repository
- Navigate to `Settings` > `Secrets and variables` > `Actions`
- Click `New repository secret` with the following:
    - Name: `IMS_TOKEN`
    - Value: Your IMS token from Step 1

### Step 3: Verify Setup
- After setting the token, retry the failed `AEMY Setup Content` issue (the previous run would have failed due to the missing token).

It's time now for you to try out the [Experience Catalyst tutorial](tutorial.md).

## Technical Support

**Slack Channel**: If you need assistance or have feedback about Experience Catalyst, feel free to post in the [#experience-catalyst-users](https://adobe.enterprise.slack.com/archives/experience-catalyst-users) Slack channel. We're here to help!

---

*Experience Catalyst is available as Early Access Technology. Contact your Adobe representative for access.*
