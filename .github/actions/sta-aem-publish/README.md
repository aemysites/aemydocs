# STA AEM Replicate Action

This GitHub Action replicates content to Adobe Experience Manager (AEM) using the `/bin/replicate` endpoint for both preview and publish environments.

## Features

- Replicates content using AEM's `/bin/replicate` endpoint
- Supports both preview and publish environments
- Supports multiple content paths in a single operation
- Uses JWT authentication with technical service account
- Supports different replication operations (activate, deactivate, delete)

## Usage

### In a Workflow

```yaml
- name: Replicate content to AEM
  uses: ./.github/actions/sta-aem-publish
  with:
    access_token: ${{ steps.get-token.outputs.access_token }}
    aem_url: 'https://author-p12345-e67890.adobeaemcloud.com'
    content_paths: '/content/dam/my-assets,/content/my-page'
    is_preview: 'false'
```

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `access_token` | JWT access token for AEM authentication | Yes | - |
| `aem_url` | The AEM instance URL (e.g., https://author-p12345-e6e12345.adobeaemcloud.com) | Yes | - |
| `content_paths` | Comma-separated list of content paths to replicate | Yes | - |
| `is_preview` | Whether to replicate to preview (true) or publish (false) | No | `false` |

### Outputs

| Output | Description |
|--------|-------------|
| `error_message` | Error message if replication failed |

## API Details

This action uses the AEM Replication API endpoint:
- **URL**: `{aem_url}/bin/replicate`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "cmd": "activate",
    "path": ["/content/path1", "/content/path2"],
    "synchronous": false,
    "ignoredeactivated": true,
    "onlymodified": false,
    "onlynewer": false,
    "target": "publish"
  }
  ```

## Environment Targeting

- **Preview**: `target: "preview"` - Replicates to preview environment
- **Publish**: `target: "publish"` - Replicates to live publish environment

## Authentication

This action requires a JWT access token generated from a technical service account. The token should be generated using the `@adobe/jwt-auth` package with appropriate AEM metascopes.

## Error Handling

The action will:
1. Validate all required inputs
2. Make the API call to AEM
3. Return detailed error messages if the operation fails
4. Exit with code 1 on failure

## Dependencies

- `@actions/core`: GitHub Actions core library
- Node.js 20+ runtime 