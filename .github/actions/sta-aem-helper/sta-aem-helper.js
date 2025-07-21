/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const fs = require('fs');
// eslint-disable-next-line import/no-unresolved
const jwtAuth = require('@adobe/jwt-auth');
const core = require('@actions/core');

async function fetchAccessToken(credentialsPath) {
  // Read and parse the credentials
  const fileContent = fs.readFileSync(credentialsPath, 'utf8');
  const credsRaw = JSON.parse(fileContent);
  const integration = credsRaw.integration || {};
  const technicalAccount = integration.technicalAccount || {};

  const config = {
    clientId: technicalAccount.clientId,
    clientSecret: technicalAccount.clientSecret,
    technicalAccountId: integration.id,
    orgId: integration.org,
    privateKey: integration.privateKey,
    metaScopes: [integration.metascopes], // wrap as array if it's a string
    ims: `https://${integration.imsEndpoint}`,
  };

  return jwtAuth(config)
    .then((response) => response.access_token)
    .catch(() => {
      core.error('Failed to fetch access token');
      process.exit(1);
    });
}

/**
 * Main function for the GitHub Action
 * @returns {Promise<void>}
 */
async function run() {
  try {
    const credentialsPath = core.getInput('credentials_path');
    const operation = core.getInput('operation');

    if (operation === 'fetch-access-token') {
      const accessToken = await fetchAccessToken(credentialsPath);
      if (accessToken) {
        core.setOutput('access_token', accessToken);
        core.info(`Access token fetched successfully: ${accessToken?.substring(0, 10)}...`);
      } else {
        core.error('Failed to fetch access token');
        process.exit(1);
      }
    } else {
      throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    process.exit(1);
  }
}

module.exports = { run };

// Run if this file is executed directly
if (require.main === module) {
  run();
}
