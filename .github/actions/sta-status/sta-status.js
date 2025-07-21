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

function getStatusCallParameters(
  context,
  apiKey,
  statusType,
  message,
) {
  // TODO Find magic encoding for \\\\\\n instead of JS_LF.
  const messageLF = message.replaceAll('JS_LF', '\n');
  const headers = new Headers();
  headers.set('x-api-key', apiKey);
  let body;

  if (statusType === 'ok') {
    const formData = new FormData();
    // add context to form data
    const contextBlob = new Blob([JSON.stringify(context)], { type: 'application/json' });
    formData.append('context', contextBlob, 'context.json');

    // Add message as "file" information to have the coordinator/Upload handle it.
    const fileBlob = new Blob([JSON.stringify({ message: messageLF })], { type: 'application/json' });
    formData.append('file', fileBlob, 'message.json');

    body = formData;
  } else {
    body = JSON.stringify({
      context,
      response: {
        message: messageLF,
      },
    });
    headers.set('Content-Type', 'application/json');
  }

  return { body, headers };
}

/**
 * Send a status, given the correct action parameters.
 * If statusType === 'error', the process (Workflow) will exit
 * regardless of success or failure of the POST.
 * All "JS_LF" tags are replaced with "\n" in the message.
 * @returns {Promise<void>}
 */
export async function run() {
  const context = core.getInput('context');
  const callbackUrls = core.getInput('callback_urls');
  const message = core.getInput('message');
  const statusType = core.getInput('status_type');
  const agentName = core.getInput('agent_name');

  const name = `${agentName || 'sta'}-status`;

  core.info(`"${statusType}" status message: "${message}" for ${name}.`);

  if (!['ok', 'error', 'progress'].includes(statusType)) {
    core.error(`Invalid status type "${statusType}" in ${name}.`);
    return;
  }

  const apiKey = process.env.AEMY_API_KEY;

  try {
    const coordinatorCallbacks = JSON.parse(callbackUrls);
    if (!context || !coordinatorCallbacks[statusType] || !message || !apiKey) {
      core.info(`Missing or misconfigured parameters in ${name} call. Skipping status call: "${message}".`);
      return;
    }

    const url = coordinatorCallbacks[statusType];
    const { body, headers } = getStatusCallParameters(
      JSON.parse(context),
      apiKey,
      statusType,
      message,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      core.warning(`Failed to send status: ${response.statusText}`);
    } else {
      core.info(`Status ${statusType}:${message} sent successfully in ${name} call.`);
    }
  } catch (error) {
    core.warning(`Error: Failed to send status of type ${statusType} in ${name}: ${error.message}`);
  } finally {
    if (statusType === 'error') {
      process.exit(1);
    }
  }
}

await run();
