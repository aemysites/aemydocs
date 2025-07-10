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

const GRAPH_API = 'https://graph.microsoft.com/v1.0';

async function graphFetch(token, endpoint) {
  core.info(`Fetching Graph API endpoint: ${GRAPH_API}${endpoint}`);
  const res = await fetch(`${GRAPH_API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    core.warning(`Graph API error ${res.status}: ${errorText}`);
    throw new Error(`Graph API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

/**
 * Step through the folder, one by one, skipping the root 'documents' folder and
 * extract information about the folder.  This allows more precise error handling
 * to indicate which segment of the path was not found.
 * @param {string} token
 * @param {string} driveId id for the root document drive
 * @param {string} folderPath
 * @returns {Promise<{driveId: string, folderId: string}>}
 */
async function getFolderByPath(token, driveId, folderPath) {
  const segments = folderPath.split('/'); // break the path into parts
  if (segments[0] === 'Documents' || segments[0] === 'Shared%20Documents') {
    segments.shift();
  }
  let currentId = 'root'; // start at root
  let segmentDriveId;
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;
    try {
      const result = await graphFetch(token, `/drives/${driveId}/root:${currentPath}`);
      currentId = result.id;
      segmentDriveId = result.parentReference.driveId;
      core.debug(`✔️ Found data for ${currentPath} (id: ${currentId} with drive id ${driveId})`);
    } catch (err) {
      throw new Error(`Segment not found: ${currentPath}`);
    }
  }

  return {
    folderId: currentId,
    driveId: segmentDriveId,
  };
}

/**
 * Get the site and drive ID for a SharePoint site.
 * @returns {Promise<void>}
 */
export async function run() {
  const token = core.getInput('token');
  const spHost = core.getInput('sp_host'); // i.e. adobe.sharepoint.com
  const spSitePath = core.getInput('sp_site_path'); // i.e. AEMDemos
  const spFolderPath = core.getInput('sp_folder_path'); // i.e. Shared%20Documents/sites/my-site/...
  const decodedFolderPath = decodeURIComponent(spFolderPath); // decode the spaces, etc.

  core.info(`Getting data for "${spHost} : ${spSitePath} : ${decodedFolderPath}".`);

  let siteId;
  try {
    // Step 1: Get Site ID
    const site = await graphFetch(token, `/sites/${spHost}:/sites/${spSitePath}`);
    siteId = site.id;
    core.info(`✔️ Site ID: ${siteId}`);
  } catch (siteError) {
    core.warning(`Failed to get Site Id: ${siteError.message}`);
    core.setOutput('error_message', `❌ Error: Failed to get Site Id: ${siteError.message}`);
    return;
  }

  // Now find the (root) drive id.
  const rootDrive = decodedFolderPath.split('/').shift();
  let driveId;
  try {
    const driveResponse = await graphFetch(token, `/sites/${siteId}/drives`);
    core.debug(`✔️ Found ${driveResponse.value.length} drives in site ${siteId}.`);
    const sharedDocumentsDrive = driveResponse.value.find((dr) => dr.name === rootDrive);
    if (sharedDocumentsDrive) {
      driveId = sharedDocumentsDrive.id;
      core.debug(`✔️ Found ${rootDrive} with a drive id of ${driveId}`);
    }
    if (!driveId && driveResponse?.value.length === 1 && driveResponse.value[0].name === 'Documents') {
      driveId = driveResponse.value[0].id;
      core.debug(`✔️ Found default drive 'Documents' with a drive id of ${driveId}`);
    }
  } catch (driveError) {
    core.warning(`Failed to get Drive Id: ${driveError.message}`);
    core.setOutput('error_message', '❌ Error: Failed to get Site Id.');
    return;
  }

  // Now get the folder id.
  let folder;
  if (siteId && driveId) {
    try {
      folder = await getFolderByPath(token, driveId, spFolderPath);
    } catch (folderError) {
      core.warning(`Failed to get folder info for ${siteId} / ${decodedFolderPath}: ${folderError.message}`);
    }

    if (folder) {
      core.info(`✅ Drive ID: ${folder.driveId}`);
      core.info(`✅ Folder ID: ${folder.folderId}`);
      core.setOutput('drive_id', folder.driveId);
      core.setOutput('folder_id', folder.folderId);
    } else {
      core.setOutput('error_message', '❌ Error: Failed to get drive and folder id of the mountpoint.');
    }
  }
}

await run();
