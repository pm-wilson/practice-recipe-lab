const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');

describe('log routes', () => {
  beforeEach(async() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a log', async() => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: '1',
        dateOfEvent: '2020-09-23T00:39:17.071Z',
        notes: 'these are notes',
        rating: 5
      })
      .then(res => {
        expect(res.body).toEqual({
          logId: expect.any(String),
          recipeId: '1',
          dateOfEvent: '2020-09-23T00:39:17.071Z',
          notes: 'these are notes',
          rating: 5
        });
      });
  });

  it('gets all logs', async() => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    const logs = await Promise.all([
      { recipeId: '1', dateOfEvent: '2020-09-23T00:39:17.071Z' },
      { recipeId: '1', dateOfEvent: '2020-07-23T00:39:17.071Z' },
      { recipeId: '2', dateOfEvent: '2020-01-23T00:39:17.071Z' }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('gets a log by id', async() => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    const log = await Log.insert({
      recipeId: '1',
      dateOfEvent: '2020-09-23T00:39:17.071Z',
    });

    return request(app)
      .get(`/api/v1/logs/${log.logId}`)
      .then(res => {
        expect(res.body).toEqual({
          logId: expect.any(String),
          recipeId: '1',
          dateOfEvent: '2020-09-23T00:39:17.071Z',
          notes: null,
          rating: null,
        });
      });
  });

  it('updates a log by id', async() => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    const log = await Log.insert({
      recipeId: '1',
      dateOfEvent: '2020-09-23T00:39:17.071Z',
    });

    return request(app)
      .put(`/api/v1/logs/${log.logId}`)
      .send({
        recipeId: '1',
        dateOfEvent: '2020-08-23T00:39:17.071Z',
        notes: 'this is a note',
        rating: 5,
      })
      .then(res => {
        expect(res.body).toEqual({
          logId: expect.any(String),
          recipeId: '1',
          dateOfEvent: '2020-08-23T00:39:17.071Z',
          notes: 'this is a note',
          rating: 5,
        });
      });
  });

  it('deletes a log', async () => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    const log = await Log.insert({
      recipeId: '1',
      dateOfEvent: '2020-09-23T00:39:17.071Z',
    });

    return request(app)
      .delete(`/api/v1/logs/${log.logId}`)
      .then(res => {
        expect(res.body).toEqual({
          logId: expect.any(String),
          recipeId: '1',
          dateOfEvent: '2020-09-23T00:39:17.071Z',
          notes: null,
          rating: null,
        });
      });
  });
});
