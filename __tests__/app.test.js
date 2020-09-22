const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  // it('creates a log', () => {

  // });

  // it('gets all log', () => {

  // });

  // it('gets a log by id', () => {

  // });

  // it('updates a log', () => {

  // });

  // it('deletes a log', () => {

  // });
});

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: {
          flour: {
            amount: 4,
            measurement: 'cup',
          },
          sugar: {
            amount: 2,
            measurement: 'cup',
          },
          'chocolate chips': {
            amount: 1,
            measurement: 'bag',
          }
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: {
            flour: {
              amount: 4,
              measurement: 'cup',
            }, 
            sugar: {
              amount: 2,
              measurement: 'cup',
            }, 
            'chocolate chips': {
              amount: 1,
              measurement: 'bag',
            }
          }
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('finds a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: null
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: {
          flour: {
            amount: 4,
            measurement: 'cup',
          },
          sugar: {
            amount: 4,
            measurement: 'cup',
          },
          'chocolate chips': {
            amount: 2,
            measurement: 'bag',
          },
          butter: {
            amount: 12,
            measurement: 'tablespoon'
          }
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: {
            flour: {
              amount: 4,
              measurement: 'cup',
            },
            sugar: {
              amount: 4,
              measurement: 'cup',
            },
            'chocolate chips': {
              amount: 2,
              measurement: 'bag',
            },
            butter: {
              amount: 12,
              measurement: 'tablespoon',
            }
          }
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .delete(`/api/v1/recipes/${recipes[1].id}`)
      .then(res => {
        expect(res.body).toEqual({ 
          id: recipes[1].id,
          name: 'cake', 
          directions: [],
          ingredients: null
        });
      });
  });
});
