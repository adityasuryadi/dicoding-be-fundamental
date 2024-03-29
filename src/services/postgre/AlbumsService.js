/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbumDBToModel } = require('../../utils/index');

/* eslint-disable no-underscore-dangle */
class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums(id,name,year,created_at,updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(albumId) {
    const query = {
      text: 'SELECT albums.* FROM albums WHERE albums.id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows.map(mapAlbumDBToModel)[0];
  }
}
module.exports = AlbumService;
