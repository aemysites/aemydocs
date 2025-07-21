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

import core from '@actions/core';
import { spawn } from 'child_process';
import path from 'path';

async function runUpload(
  xwalkZipPath,
  assetMappingPath,
  target,
  accessToken,
  skipAssets = false,
) {
  return new Promise((resolve, reject) => {
    const args = [
      '@adobe/aem-import-helper',
      'aem',
      'upload',
      '--zip', xwalkZipPath,
      '--asset-mapping', assetMappingPath,
      '--target', target,
      '--token', accessToken,
    ];
    if (skipAssets) {
      args.push('--skip-assets');
    }

    // Try to make it easy to read in the logs.
    const suffixArray = ['', '', '\n>  ', '', '\n>  ', '', '\n>  ', '', '\n>  '];
    const maskedArgs = args.map((arg, index) => (arg === accessToken ? '***\n>  ' : `${arg}${suffixArray[index % suffixArray.length]}`));
    core.info('Running command:');
    core.info(`> npx ${maskedArgs.join(' ')}`);

    const child = spawn('npx', args, {
      stdio: ['inherit', 'inherit', 'pipe'], // Pipe stderr to capture errors
      shell: true, // Required for `npx` to work correctly in some environments
    });

    let errorOutput = '';
    child.stderr.on('data', (data) => {
      core.info(data.toString());
      errorOutput = data.toString(); // Only save the last line (real error)
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`aem-import-helper failed. Error: ${errorOutput}`));
      }
    });
  });
}

/**
 * Upload the import content for XWalk.
 * @returns {Promise<void>}
 */
export async function run() {
  const accessToken = core.getInput('access_token');
  const target = core.getInput('aem_author_url');
  const zipPath = core.getInput('zip_path');
  const zipName = core.getInput('zip_name');
  const skipAssets = core.getInput('skip_assets') === 'true';

  try {
    const url = new URL(target);
    const hostTarget = `${url.origin}/`;
    const assetMappingPath = `${zipPath}/asset-mapping.json`;
    const fullZipPath = path.join(zipPath, zipName || 'xwalk-index.zip');

    core.info(`✅ Uploading "${fullZipPath}" and "${assetMappingPath}" to ${hostTarget}. Assets will ${skipAssets ? 'not ' : ''}be uploaded.`);

    await runUpload(
      fullZipPath,
      assetMappingPath,
      hostTarget,
      accessToken,
      skipAssets,
    );
    core.info('✅ Upload completed successfully.');
  } catch (error) {
    core.warning(`Error: Failed to upload for XWalk to ${target}: ${error.message}`);
    core.setOutput('error_message', `Error: Failed to upload for XWalk to ${target}: ${error.message}`);
  }
}

await run();
