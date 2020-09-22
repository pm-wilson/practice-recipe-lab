const pool = require('../utils/pool');

module.exports = class Log {
  logId;
  recipeId;
  dateOfEvent;
  notes;
  rating

  constructor(row) {
    this.logId = row.log_id;
    this.recipeId = row.recipe_id;
    this.dateOfEvent = row.date_of_event;
    this.notes = row.notes;
    this.rating = row.rating;
  }

  static async insert(log) {
    const { rows } = await pool.query('INSERT into logs (recipe_id, date_of_event, notes, rating) VALUES ($1, $2, $3, $4) RETURNING *', [log.recipeId, log.dateOfEvent, log.notes, log.rating]
    );

    return new Log(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM logs'
    );

    return rows.map(row => new Log(row));
  }

  static async findById(logId) {
    const { rows } = await pool.query(
      'SELECT * FROM logs WHERE log_id=$1',
      [logId]
    );

    if(!rows[0]) return null;
    return new Log(rows[0]);
  }

  static async update(logId, log) {
    const { rows } = await pool.query(
      `UPDATE logs
       SET recipe_id=$1, 
          date_of_event=$2, 
          notes=$3, 
          rating=$4
       WHERE log_id=$5
       RETURNING *
       `,
      [log.recipeId, log.dateOfEvent, log.notes, log.rating, logId]
    );

    return new Log(rows[0]);
  }

  static async delete(logId) {
    const { rows } = await pool.query(
      'DELETE FROM recipes WHERE log_id=$1 RETURNING *',
      [logId]
    );

    return new Log(rows[0]);
  }
};
