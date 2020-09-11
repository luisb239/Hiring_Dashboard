'use strict'
const assert = require('assert');
const db = require('../dals')
const service = require('../services/request-props-service.js')
(db.language, db.months, db.profile, db.project, db.skill, db.state, db.stateCsl, db.workflow, db.phase)
const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

describe('Testing request-props-service', () => {
    describe('Testing getLanguages', () => {
        it('should return an object containing an array of languages', async () => {
            const res = await service.getLanguages();
            assert.ok(Array.isArray(res.languages))
        });
    });
    describe('Testing getMonths', () => {
        it('should return an object containing an array of months', async () => {
            const res = await service.getMonths();
            assert.ok(Array.isArray(res.months))
        });
    });
    describe('Testing getProfiles', () => {
        it('should return an object containing an array of profiles', async () => {
            const res = await service.getProfiles();
            assert.ok(Array.isArray(res.profiles))
        });
    });
    describe('Testing getProjects', () => {
        it('should return an object containing an array of projects', async () => {
            const res = await service.getProjects();
            assert.ok(Array.isArray(res.projects))
        });
    });
    describe('Testing getSkills', () => {
        it('should return an object containing an array of skills', async () => {
            const res = await service.getSkills();
            assert.ok(Array.isArray(res.skills))
        });
    });
    describe('Testing getStates', () => {
        it('should return an object containing an array of states', async () => {
            const res = await service.getStates();
            assert.ok(Array.isArray(res.states))
        });
    });
    describe('Testing getStatesCsl', () => {
        it('should return an object containing an array of CSL states', async () => {
            const res = await service.getStatesCsl();
            assert.ok(Array.isArray(res.statesCsl))
        });
    });
    describe('Testing getWorkflows', () => {
        it('should return an object containing an array of workflows', async () => {
            const res = await service.getWorkflows();
            assert.ok(Array.isArray(res.workflows))
        });
    });

    describe('Testing getWorkflow', () => {
        it("should return an object containing an array of the workflow's phases", async () => {
            const res = await service.getWorkflow({workflow: "Software Development"});
            assert.ok(Array.isArray(res.phases))
        });
        it("should throw a 'Not Found' exception if the workflow passed on does not exist", async () => {
            try {
                await service.getWorkflow({workflow: "NOT EXISTENT WORKFLOW"});
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
    });
});
