# Backup and Reset Guide for Sharepoint based repos

This guide provides instructions for using the automated backup and reset functionality through GitHub workflows.

## Prerequisites

- GitHub repository access with admin permissions
- Access to your GitHub developer settings
- Ability to create repository secrets

## Setup Process

### 1. Create Personal Access Token

1. **Navigate to GitHub Developer Settings:**
   - Go to GitHub.com and click on your profile picture
   - Select **Settings** from the dropdown
   - In the left sidebar, click **Developer settings**
   - Click **Personal access tokens** > **Tokens (classic)**

2. **Generate New Token:**
   - Click **Generate new token (classic)**
   - Provide a descriptive name (e.g., "AEMY Workflow Token")
   - Set expiration as needed
   - **Select the following scopes:**
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)
   - Click **Generate token**

     <img width="499" height="261" alt="Screenshot 2025-08-21 at 3 07 36 PM" src="https://github.com/user-attachments/assets/560f49bc-acc8-40f8-a682-c12e34f1b330" />

     <img width="1068" height="351" alt="Screenshot 2025-08-21 at 3 08 48 PM" src="https://github.com/user-attachments/assets/9e997459-8295-4a50-8bb2-fe1706f8e776" />

3. **Copy Token:**
   - **Important:** Copy the token immediately as it won't be shown again
   - Store it securely for the next step

### 2. Set Repository Secret

1. **Navigate to Repository Settings:**
   - Go to your GitHub repository
   - Click on **Settings** tab
   - In the left sidebar, click **Secrets and variables** > **Actions**

2. **Add New Secret:**
   - Click **New repository secret**
   - **Name:** `WORKFLOW_PAT`
   - **Secret:** Paste the personal access token you created
   - Click **Add secret**

### 3. Request the latest workflows

1. **Create Installation Issue:**
   - In your repository, go to the **Issues** tab
   - Click **New issue**
   - **Title:** `AEMY Installation`
   - **Description:** Setup the workflows
   - Add `aemy-help`, `aemy-go`, and `aemy-merge` as labels
   - Click **Submit new issue**

2. **Wait for Installation:**
   - Wait for the PR to be merged in and the issue to be closed

## Using Backup and Reset

### 1. Access the Workflow

1. **Navigate to Actions:**
   - Go to your GitHub repository
   - Click on the **Actions** tab
   - Look for the workflow named **"STA - Backup and Reset"**

2. **Run the Workflow:**
   - Click on **"STA - Backup and Reset"**
   - Click **"Run workflow"** button
   - The root mountpoint should be the link to your sharepoint folder from fstab.yaml
   - Click **"Run workflow"** to start

### 3. Monitor Workflow Execution

1. **View Progress:**
   - Click on the running workflow to see detailed progress

2. **Review Results:**
   - Once complete, review the workflow summary
   - Verify the operation completed successfully

## Troubleshooting

### Common Issues

1. **Workflow Not Visible:**
   - Ensure WORKFLOW_PAT secret is set correctly
   - Verify the AEMY Setup Installation was completed
   - Check that you have the necessary repository permissions

2. **Authentication Errors:**
   - Verify your personal access token has the correct scopes (`repo` and `workflow`)
   - Check that the token hasn't expired
   - Ensure the WORKFLOW_PAT secret is properly configured
