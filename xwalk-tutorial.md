# Crosswalk Tutorial: Bring Your Own AEM

This tutorial will guide you through the process of setting up a crosswalk integration between your existing AEM instance and a new GitHub repository for AEM Edge Delivery Services.

## Prerequisites

- Access to an AEM Cloud Service instance
- GitHub account
- AEM Developer Console access for your organization

## GitHub Setup

### 1. Create a Repository Request

This guide assumes that the following have been already setup for you as per the instructions [here](support.md#access-request-process).

**Required Information:**
- Provide your AEM URL (e.g., `https://author-p141866-e1455422.adobeaemcloud.com`)
- Specify "Project type: XWalk"

### 2. Repository Creation

Once approved, a new GitHub repository will be created automatically for your project based on your username and the current date. This repository will contain:
- AEM Edge Delivery Services boilerplate code
- Updated fstab and paths.json files
- Automated workflows for deployment

### 3. Initial AEM Content

Before proceeding with authentication setup, you need to create your AEM site using the crosswalk template. This will establish the initial content structure that will be synchronized with your GitHub repository.

#### Creating Your AEM Site:

1. **Navigate to AEM Sites Console:**
   - Log into your AEM author instance
   - Go to **Sites** from the main navigation

2. **Start Site Creation:**
   - Click **Create** button
   - Select **Site from template**
   - Choose the **latest crosswalk site template**
   - If you don't see the template, download the latest version from the [AEM Boilerplate Crosswalk Releases](https://github.com/adobe-rnd/aem-boilerplate-xwalk/releases) and import it first
   - Click **Next**

3. **Configure Site Details:**
   - **Site Title:** Enter your GitHub repository name that was provisioned for you (e.g., `sta-xwalk-e2e`)
   - **Site Name:** Enter the same repository name (e.g., `sta-xwalk-e2e`)
   - **GitHub Repository URL:** Provide the full URL of your GitHub repository (e.g., `https://github.com/aemdemos/sta-xwalk-e2e`)
   
   > **Important:** The Site Title and Site Name must exactly match your GitHub repository name for proper synchronization.
   <img width="505" height="708" alt="Screenshot 2025-08-14 at 11 28 23 AM" src="https://github.com/user-attachments/assets/d93adba6-128d-4fd7-a32c-dd7da6598231" />


4. **Complete Site Creation:**
   - Click **Create**
   - Wait for the site creation process to complete
   - This will automatically generate your initial content structure with the necessary configuration for crosswalk integration

5. **Clean Up Sample Content:**
   - Navigate to your new site in the AEM Sites console
   - Delete any sample or placeholder pages that came with the template
   - Keep only the essential structure (home page, etc.)
   - Go to the Assets console and navigate to the folder corresponding to your site
   - Delete sample images, documents, and other assets
   - Maintain the folder structure for future content organization
   - Ensure your site has a clean starting point ready for your actual content

### 4. AEM User Credentials and GitHub Secrets

To enable automated content synchronization, you need to set up authentication between GitHub and your AEM instance.

#### Steps:

1. **Access AEM Developer Console:**
   - Navigate to your AEM Developer Console
   - Go to the Integrations section
   - Create or access your technical account details
<img width="955" height="569" alt="Screenshot 2025-08-14 at 10 50 32 AM" src="https://github.com/user-attachments/assets/143a1b48-e9b1-4720-9a0b-ec3d5826d140" />
     
2. **Obtain Technical Account Details:**
   - Download the service account JSON credentials
   - This file contains the private key and certificate information needed for authentication

3. **Create GitHub Secret:**
   - Base64 encode your credentials using one of these methods:
     ```bash
     echo -n "your-json-credentials" | base64
     ```
     - Alternatively, you can use an online tool like [base64encode.org](https://www.base64encode.org/) to encode your Service Credentials JSON
      
   - In your GitHub repository, go to Settings > Secrets and variables > Actions
   - Create a new repository secret with the encoded credentials
   - Name it appropriately (i.e., `AEM_SERVICE_CREDENTIALS`)

   <img width="1150" height="540" alt="Screenshot 2025-08-14 at 11 34 06 AM" src="https://github.com/user-attachments/assets/0261908d-30f3-4e77-8ae3-9324967260a8" />

### 5. Configure Technical Account Permissions in AEM

After setting up the service credentials, you need to grant the technical account proper permissions in AEM to enable uploads using AEMY.

#### Steps:

1. **Locate the Technical Account Email:**
   - Open the Service Credentials JSON file you downloaded from the AEM Developer Console
   - Find the `integration.email` value (e.g., `12345678-abcd-9000-efgh-0987654321c@techacct.adobe.com`)
   - This is the login name for the technical account AEM user

2. **Access the Admin Console:**
   - Go to the [Adobe Admin Console](https://adminconsole.adobe.com/)
   - Navigate to your organization and select Adobe Experience Manager as a Cloud Service
   - Select your AEM author instance
     <img width="1039" height="463" alt="Screenshot 2025-09-14 at 9 20 28 PM" src="https://github.com/user-attachments/assets/9daa0341-9de6-4e71-adce-2f5fcdd80cad" />


3. **Add Technical Account to AEM Administrators:**
   - Find the **AEM Administrators - author - Program xxxxxx - Environment xxxxxxx** product profile
   - Add the technical account email from step 1 to this product profile
   - This will grant the necessary permissions for AEMY uploads
   - Validate that the technical account is added by navigating to the `API Credentials` tab
     <img width="1507" height="518" alt="Screenshot 2025-09-14 at 9 21 54 PM" src="https://github.com/user-attachments/assets/e67baf96-4104-4884-af7c-1c8b06ae3602" />

     <img width="1105" height="694" alt="Screenshot 2025-09-14 at 9 23 28 PM" src="https://github.com/user-attachments/assets/cc5ee670-8b63-457c-ad90-ab040e16d9d9" />
     
     <img width="1544" height="271" alt="Screenshot 2025-09-14 at 9 24 46 PM" src="https://github.com/user-attachments/assets/8deaa47a-ae62-4e11-840e-73b0defb3ef6" />


4. **Re-run AEMY Setup:**
   - Navigate to your provisioned GitHub repository's **Issues** tab
   - Look for an open/closed issue titled `AEMY Setup Content` with an `aemy-failed` label
   - This issue was automatically created during initial repository provisioning but failed because the AEM_SERVICE_CREDENTIALS secret wasn't configured at that time
   - To retry the setup process:
     1. **Re-open the issue** if it's currently closed
     2. **Add the following labels**: `aemy-go`, `aemy-help`, and `aemy-merge`
     3. **Comment** with the text: `Try again`
   - This will trigger the GitHub Actions workflow to automatically retry uploading the custom block library to your AEM instance
   - **Validate the upload**: Navigate to your AEM instance → Sites → your content tree → it should have `tools` and `block-collection` present and previewed and published as shown in the image below

5. **Next Steps - Content Analysis:**
   - Once permissions are configured, follow the [main tutorial](tutorial.md) to begin analyzing your content, generating inventory, and starting the migration process
   - The tutorial will guide you through the content analysis workflow and help you understand your existing AEM content structure

## Troubleshooting

### Common Issues:

- **Authentication Problems:** Verify that your GitHub secrets are correctly configured and that the technical account has appropriate permissions
- **Site Template Problems:** Ensure you're using the latest version of the crosswalk template

### Support Resources:

- [AEM Live Documentation](https://www.aem.live/)
- [Edge Delivery Services Documentation](https://www.aem.live/developer/)

