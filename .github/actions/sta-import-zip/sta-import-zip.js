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
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import unzipper from 'unzipper';

const CONTENT_DIR_NAME = 'contents';
const ZIP_NAME = 'import.zip';

/**
 * Create a temporary directory, with a 'contents' directory in it.
 * @returns {string} The path to the temporary directory.
 */
function createTempDirectory() {
  const tempDirPrefix = path.join(os.tmpdir(), 'sta-');
  const tempDir = fs.mkdtempSync(tempDirPrefix);

  const contentsDir = path.join(tempDir, CONTENT_DIR_NAME);
  fs.mkdirSync(contentsDir, { recursive: true });

  core.info(`✅ Import Zip directory created: ${tempDir}. Contents: ${contentsDir}`);

  return tempDir;
}

/**
 * Fetch a zip file from a URL and save it to a specified directory.
 * @param {string} downloadUrl - The URL of the zip file to download.
 * @param {string} zipDestination - The full file path where the zip file will be saved.
 * @returns {Promise<string>} - The path to the saved zip file.
 */
async function fetchZip(downloadUrl, zipDestination) {
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to download zip. Did the url expire? ${response.status} ${response.statusText}`);
  }

  try {
    const fileStream = fs.createWriteStream(zipDestination);
    const nodeStream = Readable.fromWeb(response.body);

    await pipeline(nodeStream, fileStream);

    // Validate zip file (will throw exception if invalid)
    const directory = await unzipper.Open.file(zipDestination);

    core.info(`✅ Downloaded Import zip to ${zipDestination} with ${directory.files.length} files.`);
  } catch (error) {
    throw new Error(`Failed to download zip: ${error.message || error}`);
  }
}

/**
 * Get the list of paths from a filter.xml file.
 * @param {string} xmlString
 * @returns {string[]}
 */
function getFilterPathsSimple(xmlString) {
  const lines = xmlString.split('\n');
  const paths = [];

  for (const line of lines) {
    const match = line.match(/^\s*<filter\s+root="([^"]+)"><\/filter>\s*$/);
    if (match) {
      paths.push(match[1]);
    }
  }

  return paths;
}

/**
 * Unzip one file at a time.
 * @param {string} zipPath
 * @param {string} contentsDir
 * @returns {Promise<void>}
 */
async function extractZip(zipPath, contentsDir) {
  let totalFiles = -1;
  try {
    const directory = await unzipper.Open.file(zipPath);
    totalFiles = directory.files.length;
    let extractedFiles = 0;
    let nextProgress = 20;
    let zipFilePath;
    for (const entry of directory.files) {
      const fullPath = path.join(contentsDir, entry.path);
      if (extractedFiles < 3 && entry.path.toLowerCase().endsWith('.zip')) {
        core.setOutput('xwalk_zip', entry.path);
        core.info(`✅ cp zip: ${entry.path}`);
        zipFilePath = entry.path;
      }

      if (entry.type === 'Directory') {
        fs.mkdirSync(fullPath, { recursive: true });
      } else {
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        const writable = fs.createWriteStream(fullPath);
        await new Promise((resolve, reject) => {
          entry.stream()
            .pipe(writable)
            .on('finish', resolve)
            .on('error', reject);
        });
      }

      extractedFiles += 1;
      const progress = Math.floor((extractedFiles / totalFiles) * 100);
      if (progress >= nextProgress) {
        core.info(`⏳ Extraction progress: ${progress}% (${extractedFiles}/${totalFiles} files)`);
        nextProgress += 20;
      }
    }

    if (zipFilePath) {
      const contentPackageZipPath = path.join(contentsDir, zipFilePath);
      core.info(`✅ Current Path: ${contentPackageZipPath}`);

      fs.createReadStream(contentPackageZipPath)
        .pipe(unzipper.ParseOne('META-INF/vault/filter.xml'))
        .pipe(fs.createWriteStream('filter.xml'))
        .on('finish', () => {
          // eslint-disable-next-line no-console
          console.log('filter.xml extracted successfully');

          // Read the extracted file
          fs.readFile('filter.xml', 'utf8', (err, data) => {
            if (err) {
              // eslint-disable-next-line no-console
              console.error('Error reading extracted file:', err);
            } else {
              // eslint-disable-next-line no-console
              console.log('Filter XML content:', data);
              const paths = getFilterPathsSimple(data);
              core.setOutput('content_paths', paths);
            }
          });
        })
        .on('error', (error) => {
          // eslint-disable-next-line no-console
          console.error('Error extracting filter.xml:', error);
        });
    }
  } catch (error) {
    throw new Error(`Failed to extract zip: ${error.message || error}`);
  }

  core.info(`✅ Import zip extracted to: ${contentsDir}`);

  return totalFiles;
}

/**
 * Create a temporary directory, download the Import zip to it and
 * extract it to a 'contents' folder in the temp directory.
 * @returns {Promise<void>}
 */
export async function run() {
  let zipDestination;
  try {
    const downloadUrl = core.getInput('download_url');
    if (!downloadUrl.includes('spacecat')) {
      throw new Error(`Invalid download url: ${downloadUrl}`);
    }
    // eslint-disable-next-line no-new
    new URL(downloadUrl);

    const tempDir = createTempDirectory();
    zipDestination = path.join(tempDir, ZIP_NAME);
    const contentsDir = path.join(tempDir, CONTENT_DIR_NAME);
    await fetchZip(downloadUrl, zipDestination);
    const fileCount = await extractZip(zipDestination, contentsDir);

    core.setOutput('temp_dir', tempDir);
    core.setOutput('file_count', fileCount);
  } catch (error) {
    core.warning(`❌ Error: ${error.message}`);
    core.setOutput('error_message', `❌ Error: ${error.message}`);
  } finally {
    try {
      // Done with the zip file, so delete it if possible.
      if (zipDestination) {
        fs.unlinkSync(zipDestination);
      }
    } catch (error) {
      core.info(`Could not delete ${zipDestination}. Let the OS handle the deletion.`);
    }
  }
}

await run();
