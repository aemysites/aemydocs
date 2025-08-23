# DA Projects: IMS Token Setup

## Permissions to your site
Your **email ID** has been granted write access to the site folder and children in the org's access config.

## IMS Token Requirements
To enable upload and preview/publish functionality, you need an IMS token with the appropriate scopes. Your IMS token needs:

- **`aem.frontend.all`** scope: Required for Helix Admin API access
- **`openid`** scope: Returns basic profile information (such as email) for user identification and additional business logic

This document provides two approaches to obtain the required IMS token.

## Option 1: Extract Token from DA.live (Recommended)

This is the **quickest approach** if you already have access to DA.live and the token includes the required scopes.

### Step 1: Access DA.live
1. Navigate to your DA project on [da.live](https://da.live)
2. Make sure you're logged in and can access your project content

### Step 2: Extract the IMS Token
1. Open **Developer Console** in your browser (F12 or right-click → Inspect)
2. Go to the **Application** tab
3. In the left sidebar, expand **Session Storage**
4. Click on the da.live domain
5. Look for a key that contains `adobeid_ims_access_token`
6. Confirm that the `scope` field contains both `aem.frontend.all` and `openid`
7. Copy the **tokenValue** of this token

### Step 4: Add Token to GitHub Repository
- Go to your GitHub repository
- Navigate to `Settings` > `Secrets and variables` > `Actions`
- Click `New repository secret` with the following:
    - Name: `IMS_TOKEN`
    - Value: The token you copied from Step 2

## Option 2: Generate IMS Token

This approach uses an existing IMS org/client that already has the required scopes, or involves requesting the scopes to be added to an existing client.

### Step 1: Check Existing IMS Org/Client Access

**If you already have an IMS org with Edge Delivery permissions:**
- You can likely use your existing setup to generate tokens
- Verify your org/client has both `aem.frontend.all` and `openid` scopes
- No new client creation needed

**If your existing IMS org/client lacks the required scopes:**
- Request that `aem.frontend.all` and `openid` scopes be added to your existing client
- The `aem.frontend.all` scope requires manual approval from Adobe (DA admins)

### Step 2: Generate Access Token
- Follow the [IMS API reference](https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/ims#fetching-access-tokens) to generate an Access Token
- Use your IMS org that has permission to preview/publish to Edge Delivery Services
- Ensure your token includes both required scopes

### Step 3: Configure User Access
Based on the Slack discussions, you need to ensure:
- Your user email/ID is configured in the project's access configuration with appropriate permissions
- You have write access to the site folder and children in the org's access config

### Step 4: Add Token to GitHub Repository
- Go to your GitHub repository
- Navigate to `Settings` > `Secrets and variables` > `Actions`
- Click `New repository secret` with the following:
    - Name: `IMS_TOKEN`
    - Value: Your generated IMS token

## Authentication & Authorization Flow

Here's how the authentication works:

1. **Authentication Check**: Helix Admin verifies your token has the required scope (`aem.frontend.all`).
2. **Authorization Check**: Helix Admin checks if your user (from the token) is configured in the project's access settings. This should already be satisfied since your email id has been granted write access to the site content.
3. **Content Operations**: If both checks pass, you can upload/preview/publish content.


## Troubleshooting

### Token Rejected by Helix Admin
- Verify your token includes the `aem.frontend.all` scope

## Verification

After setting up your token:
1. Retry any failed `AEMY Setup Content` issues (previous runs would have failed due to missing token)
2. Test upload and preview functionality through Experience Catalyst workflows
3. Monitor for any authentication errors in the GitHub Actions logs

## Support

For additional help with IMS token setup, please reach out in the [#experience-catalyst-users](https://adobe.enterprise.slack.com/archives/experience-catalyst-users) Slack channel.
