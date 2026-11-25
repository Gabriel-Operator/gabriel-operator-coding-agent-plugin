"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPROVAL_CHANNEL_LABELS = exports.APPROVAL_MESSAGING_CHANNELS = exports.MANUAL_APPROVAL_DELIVERY = void 0;
exports.resolveApprovalDelivery = resolveApprovalDelivery;
exports.validateApprovalDelivery = validateApprovalDelivery;
exports.validateApprovalGovernance = validateApprovalGovernance;
exports.resolveApprovalRule = resolveApprovalRule;
exports.MANUAL_APPROVAL_DELIVERY = { mode: 'manual', channels: [], reviewers: [], policy: 'any' };
/** A defined manual policy is an inheritance boundary; reviewer arrays replace, never merge. */
function resolveApprovalDelivery(...policies) {
    return policies.find(policy => policy !== undefined) || { ...exports.MANUAL_APPROVAL_DELIVERY, channels: [], reviewers: [] };
}
function validateApprovalDelivery(value) {
    const fail = (message) => { throw new Error(message); };
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return fail('Choose an approval delivery policy.');
    const p = value;
    const allowed = ['mode', 'channels', 'reviewers', 'policy', 'quorum', 'phoneConnectionRef', 'callingCoachPageId', 'maxCallMinutes', 'maxCostUsd'];
    if (Object.keys(p).some(key => !allowed.includes(key)))
        return fail('Approval delivery contains an unsupported setting.');
    if (!['manual', 'automatic'].includes(p.mode) || !['any', 'all', 'quorum'].includes(p.policy))
        return fail('Choose manual or automatic delivery and a reviewer policy.');
    if (!Array.isArray(p.channels) || p.channels.length > 2 || p.channels.some(c => !['email', 'phone'].includes(c)) || new Set(p.channels).size !== p.channels.length)
        return fail('Choose email and/or phone delivery.');
    if (!Array.isArray(p.reviewers) || p.reviewers.length > 50)
        return fail('Choose up to 50 reviewers.');
    const identities = new Set();
    for (const r of p.reviewers) {
        if (!r || Object.keys(r).some(key => !['userId', 'name', 'email', 'phone', 'verification'].includes(key)) || typeof r.name !== 'string' || !r.name.trim() || r.name.length > 160)
            return fail('Give each reviewer a name.');
        if (r.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email))
            return fail('Enter a valid reviewer email.');
        if (r.phone && !/^\+[1-9]\d{6,14}$/.test(r.phone))
            return fail('Enter reviewer phone numbers in international format, starting with +.');
        if (!['app', 'email'].includes(r.verification) || (r.verification === 'app' && !r.userId) || (r.verification === 'email' && !r.email))
            return fail('Choose an authenticated reviewer or an email for verification.');
        if (r.userId && (typeof r.userId !== 'string' || r.userId.length > 100))
            return fail('Choose a registered reviewer.');
        const identity = r.userId || r.email?.trim().toLowerCase() || r.phone;
        if (!identity || identities.has(identity))
            return fail('Each reviewer must appear only once.');
        identities.add(identity);
    }
    if (p.policy === 'quorum' && (!Number.isInteger(p.quorum) || p.quorum < 1 || p.quorum > p.reviewers.length))
        return fail('Quorum must fit the reviewer list.');
    for (const key of ['phoneConnectionRef', 'callingCoachPageId'])
        if (p[key] !== undefined && (typeof p[key] !== 'string' || !p[key].trim() || p[key].length > 160))
            return fail('Choose a valid connection and calling coach.');
    if (p.maxCallMinutes !== undefined && (!Number.isFinite(p.maxCallMinutes) || p.maxCallMinutes < 1 || p.maxCallMinutes > 10))
        return fail('Call limit must be 1–10 minutes.');
    if (p.maxCostUsd !== undefined && (!Number.isFinite(p.maxCostUsd) || p.maxCostUsd <= 0 || p.maxCostUsd > 100))
        return fail('Set a positive call spending limit (at most $100).');
    if (p.mode === 'automatic') {
        if (!p.reviewers.length || !p.channels.length)
            return fail('Automatic delivery requires reviewers and channels.');
        if (p.channels.includes('email') && p.reviewers.some(r => !r.email))
            return fail('Automatic email needs an email for every reviewer.');
        if (p.channels.includes('phone') && (!p.phoneConnectionRef || !p.maxCallMinutes || !p.maxCostUsd || p.reviewers.some(r => !r.phone)))
            return fail('Automatic calls need reviewer numbers, a phone connection, duration and spending limits.');
    }
    return JSON.parse(JSON.stringify(p));
}
exports.APPROVAL_MESSAGING_CHANNELS = ['whatsapp', 'telegram', 'slack', 'discord'];
exports.APPROVAL_CHANNEL_LABELS = { whatsapp: 'WhatsApp', telegram: 'Telegram', slack: 'Slack', discord: 'Discord', email: 'Email', phone: 'Phone' };
const approvalKey = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/;
function validateApprovalGovernance(value) {
    const settings = value;
    if (!settings || typeof settings !== 'object' || Object.keys(settings).some(key => key !== 'rules')
        || !Array.isArray(settings.rules) || settings.rules.length > 100)
        throw new Error('Use up to 100 approval rules.');
    const ids = new Set();
    for (const rule of settings.rules) {
        if (!rule || typeof rule !== 'object' || Object.keys(rule).some(key => ![
            'id', 'label', 'playbookId', 'stageId', 'operation', 'minimum', 'reviewerRoles', 'votes', 'quorum',
            'excludeRequester', 'emailReviewers', 'emailOutcome', 'reviewerChannels', 'dueMinutes',
        ].includes(key)) || typeof rule.id !== 'string' || !approvalKey.test(rule.id) || ids.has(rule.id)
            || typeof rule.label !== 'string' || !rule.label.trim() || rule.label.length > 160)
            throw new Error('Each approval rule needs a unique ID and a name.');
        ids.add(rule.id);
        for (const selector of [rule.playbookId, rule.stageId, rule.operation]) {
            if (selector !== undefined && (typeof selector !== 'string' || !approvalKey.test(selector)))
                throw new Error('Use stable playbook, stage and operation IDs.');
        }
        if (!Array.isArray(rule.reviewerRoles) || !rule.reviewerRoles.length || rule.reviewerRoles.length > 30
            || new Set(rule.reviewerRoles).size !== rule.reviewerRoles.length
            || rule.reviewerRoles.some(role => typeof role !== 'string' || !approvalKey.test(role)))
            throw new Error('Choose at least one reviewer role. Use owner for the playbook owner.');
        if (!['any', 'all', 'quorum'].includes(rule.votes) || (rule.votes === 'quorum'
            ? !Number.isInteger(rule.quorum) || rule.quorum < 1 || rule.quorum > 50 : rule.quorum !== undefined))
            throw new Error('Choose a valid vote requirement.');
        if (rule.minimum !== undefined && (!rule.operation || !rule.minimum || typeof rule.minimum !== 'object'
            || Object.keys(rule.minimum).some(key => !['amount', 'currency'].includes(key))
            || !Number.isFinite(rule.minimum.amount) || rule.minimum.amount < 0
            || typeof rule.minimum.currency !== 'string' || !/^[A-Z]{3}$/.test(rule.minimum.currency)))
            throw new Error('Amount thresholds need an operation, nonnegative amount and three-letter currency.');
        for (const option of [rule.excludeRequester, rule.emailReviewers, rule.emailOutcome]) {
            if (option !== undefined && typeof option !== 'boolean')
                throw new Error('Approval options must be on or off.');
        }
        if (rule.reviewerChannels !== undefined && (!Array.isArray(rule.reviewerChannels)
            || rule.reviewerChannels.length > exports.APPROVAL_MESSAGING_CHANNELS.length
            || new Set(rule.reviewerChannels).size !== rule.reviewerChannels.length
            || rule.reviewerChannels.some(channel => !exports.APPROVAL_MESSAGING_CHANNELS.includes(channel)))) {
            throw new Error('Choose supported team messaging channels once per approval rule.');
        }
        if (rule.dueMinutes !== undefined && (!Number.isInteger(rule.dueMinutes) || rule.dueMinutes < 1 || rule.dueMinutes > 43200))
            throw new Error('Use a review deadline between one minute and 30 days.');
    }
    return JSON.parse(JSON.stringify(settings));
}
function resolveApprovalRule(facts, ...policies) {
    let best;
    let specificity = -1;
    for (const rule of policies.flatMap(policy => policy?.rules || [])) {
        if ((rule.playbookId && rule.playbookId !== facts.playbookId) ||
            (rule.stageId && rule.stageId !== facts.stageId) ||
            (rule.operation && rule.operation !== facts.operation) ||
            (rule.minimum && (facts.amount === undefined || facts.currency !== rule.minimum.currency || facts.amount < rule.minimum.amount)))
            continue;
        const score = (rule.stageId ? 4 : 0) + (rule.playbookId ? 2 : 0) + (rule.operation ? 1 : 0);
        if (score > specificity) {
            specificity = score;
            best = rule;
        }
    }
    return best;
}
