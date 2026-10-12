#!/usr/bin/env node
'use strict';

const fs = require('fs');

function fail(message) {
  throw new Error(message);
}

const ALLOWED_SCHEDULE_TYPES = new Set(['manual', 'one_time', 'recurring']);

function assertUniqueIds(items, label) {
  if (!Array.isArray(items)) {
    fail(`${label} must be an array`);
  }
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item !== 'object') {
      fail(`${label} entries must be objects`);
    }
    const id = String(item.id || '').trim();
    if (!id) {
      fail(`${label} entry missing required "id"`);
    }
    if (seen.has(id)) {
      fail(`duplicate ${label} id: ${id}`);
    }
    seen.add(id);
  }
}

function validateTodo(todo, index) {
  const label = `todos[${index}]`;
  if (!String(todo.title || '').trim()) {
    fail(`${label} missing required "title"`);
  }
  if (!String(todo.promptText || '').trim()) {
    fail(`${label} missing required "promptText"`);
  }
  const scheduleType = String(todo.scheduleType || '').trim();
  if (!ALLOWED_SCHEDULE_TYPES.has(scheduleType)) {
    fail(`${label} has invalid scheduleType: ${todo.scheduleType}`);
  }
  if (typeof todo.enabled !== 'boolean') {
    fail(`${label} enabled must be a boolean`);
  }
  if (todo.executionTarget != null) {
    if (typeof todo.executionTarget !== 'object' || Array.isArray(todo.executionTarget)) {
      fail(`${label} executionTarget must be an object`);
    }
    const type = String(todo.executionTarget.type || '').trim();
    if (type !== 'canvas_playbook' && type !== 'checkin_call' && type !== 'workflow' && type !== 'command_routine' && type !== 'playbook_automation') {
      fail(`${label} executionTarget.type must be canvas_playbook, workflow, command_routine, playbook_automation, or checkin_call`);
    }
    if (type === 'canvas_playbook' && !String(todo.executionTarget.playbookId || '').trim()) {
      fail(`${label} canvas_playbook executionTarget requires playbookId`);
    }
    if (type === 'workflow') {
      if (!String(todo.executionTarget.appId || '').trim()) {
        fail(`${label} workflow executionTarget requires appId`);
      }
      if (!String(todo.executionTarget.endpointSlug || '').trim()) {
        fail(`${label} workflow executionTarget requires endpointSlug`);
      }
    }
    if (type === 'command_routine') {
      if (!String(todo.executionTarget.appRevision || '').trim() || !Array.isArray(todo.executionTarget.steps) || todo.executionTarget.steps.length === 0) {
        fail(`${label} command_routine requires appRevision and steps`);
      }
    }
    if (type === 'playbook_automation') {
      const definition = todo.executionTarget.definition;
      if (!definition || typeof definition !== 'object' || definition.schemaVersion !== 1 || !['signal', 'schedule'].includes(definition.kind)) {
        fail(`${label} playbook_automation requires a version 1 signal or schedule definition`);
      }
    }
  }
}

function validateTodosPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    fail('payload must be an object');
  }
  if (payload.schemaVersion !== 1) {
    fail(`unsupported schemaVersion: ${payload.schemaVersion}`);
  }
  if (!String(payload.workspaceId || '').trim()) {
    fail('payload missing required "workspaceId"');
  }
  const workspace = payload.workspace;
  if (!workspace || typeof workspace !== 'object') {
    fail('payload missing required "workspace" object');
  }
  if (!String(workspace.id || '').trim()) {
    fail('workspace.id is required');
  }
  if (workspace.id !== payload.workspaceId) {
    fail(`workspace.id (${workspace.id}) must match payload.workspaceId (${payload.workspaceId})`);
  }
  if (!String(workspace.name || '').trim()) {
    fail('workspace.name is required');
  }
  assertUniqueIds(workspace.goals || [], 'goals');
  assertUniqueIds(workspace.boards || [], 'boards');
  assertUniqueIds(workspace.todos || [], 'todos');
  for (let index = 0; index < (workspace.todos || []).length; index += 1) {
    validateTodo(workspace.todos[index], index);
  }
  if (workspace.checkInSchedule != null) {
    if (typeof workspace.checkInSchedule !== 'object' || Array.isArray(workspace.checkInSchedule)) {
      fail('workspace.checkInSchedule must be an object or null');
    }
    validateTodo(workspace.checkInSchedule, 'checkInSchedule');
  }
}

function main() {
  const target = process.argv[2];
  if (!target) {
    fail('Usage: node scripts/validate-todos.js <path-to-todos.json>');
  }
  const raw = fs.readFileSync(target, 'utf8');
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    fail(`Invalid JSON in ${target}: ${error.message}`);
  }
  validateTodosPayload(payload);
  console.log(`OK: ${target}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
