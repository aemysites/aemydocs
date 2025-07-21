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

/**
 * Extracts the mountpoint data from the given mountpoint value.
 * @param {string} rootMountpoint
 * @param {string} type
 * @returns {{}}
 */
function getMountpointData(rootMountpoint, type) {
  const url = new URL(rootMountpoint);
  const mountpointData = {
    host: `${url.host}`,
  };

  if (type === 'sharepoint') {
    let pathParts;
    const sitesParts = url.pathname.split('/sites/');
    [mountpointData.site, ...pathParts] = sitesParts[1].split('/');
    mountpointData.path = pathParts.join('/');
    if (sitesParts.length === 3) {
      mountpointData.path = `${mountpointData.path}/sites/${sitesParts[2]}`;
    }
    if (!mountpointData.host || !mountpointData.site || !mountpointData.path) {
      throw new Error('Mountpoint is not in the expected format.');
    }
  } else if (type === 'crosswalk') {
    mountpointData.path = url.pathname.substring(1);
  }

  core.info(`✅ Mountpoint Data: ${JSON.stringify(mountpointData, undefined, 2)}`);

  return JSON.stringify(mountpointData);
}

/**
 * Reads the fstab.yaml file and determines the mountpoint type.
 * If successful, ensures the type matches the provided desired type.
 * @returns {Promise<void>}
 */
export async function run() {
  try {
    const desiredMountpointType = core.getInput('mountpoint_type');
    if (!['sharepoint', 'crosswalk'].includes(desiredMountpointType)) {
      throw new Error(`Invalid requested mountpoint type: ${desiredMountpointType}`);
    }

    const rootEntry = core.getInput('mountpoint');
    core.info(`✅ Mountpoint provided: ${rootEntry}`);

    // Determine the type
    let type = 'unknown';
    if (/sharepoint/i.test(rootEntry)) {
      type = 'sharepoint';
    } else if (/adobeaemcloud/i.test(rootEntry)) {
      type = 'crosswalk';
    } else if (/drive\.google\.com/i.test(rootEntry)) {
      throw new Error('Google is not supported for upload yet.');
    } else if (/dropbox/i.test(rootEntry)) {
      throw new Error('Dropbox is not supported for upload.');
    } else if (/github\.com/i.test(rootEntry)) {
      throw new Error('GitHub is not supported for upload.');
    } else {
      throw new Error(`This mountpoint is not supported for upload: ${rootEntry}`);
    }

    if (type !== desiredMountpointType) {
      throw new Error(`Requested mountpoint type ${desiredMountpointType} does not match found mountpoint type found: ${type}`);
    }

    core.setOutput('mountpoint', rootEntry);
    core.setOutput('type', type);
    core.info(`✅ Type: ${type}`);
    core.setOutput('data', getMountpointData(rootEntry, type));
  } catch (error) {
    core.warning(`❌ Error: ${error.message}`);
    core.setOutput('error_message', `❌ Error: ${error.message}`);
  }
}

await run();
