/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumId = await this._service.addAlbums({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Sukses menambahkan album',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    console.log(album);
    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
