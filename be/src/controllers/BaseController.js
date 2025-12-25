const models = require("../models");
const { Op } = require("sequelize");
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest, sendServerError } = require("../utils/response");

class BaseController {
  constructor(modelName, options = {}) {
    const Model = models[modelName];
    if (!Model) {
      throw new Error(`Model ${modelName} not found`);
    }
    this.Model = Model;
    this.allowSearch = options.allowSearch || [];
    this.allowFilter = options.allowFilter || [];
    this.allowSort = options.allowSort || [];

    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.filter = false;
  }

  _buildFilterClause(req) {
    const where = {};
    
    if (this.allowFilter && this.allowFilter.length > 0) {
      this.allowFilter.forEach(field => {
        if (req.query[field] !== undefined && req.query[field] !== null && req.query[field] !== '') {
          where[field] = req.query[field];
        }
      });
    }
    
    // Set flag if there are filter conditions
    this.filter = Object.keys(where).length > 0;
    return where;
  }

  _buildSearchClause(req, where) {
    if (req.query.search && this.allowSearch && this.allowSearch.length > 0) {
      const searchValue = req.query.search.trim();
      if (searchValue) {
        const searchConditions = this.allowSearch.map(field => ({
          [field]: {
            [Op.iLike]: `%${searchValue}%`
          }
        }));
        
        const filterKeys = Object.keys(where).filter(key => key !== Op.or && key !== Op.and);
        const hasFilters = filterKeys.length > 0;
        
        if (hasFilters) {
          const filterConditions = filterKeys.map(key => ({
            [key]: where[key]
          }));
          
          // Clear original filter keys from where
          filterKeys.forEach(key => delete where[key]);
          
          where[Op.and] = [
            ...filterConditions,
            { [Op.or]: searchConditions }
          ];
        } else {
          where = {
            [Op.or]: searchConditions
          };
        }
      }
    }

    return where;
  }

  _buildWhereClause(req) {
    let where = this._buildFilterClause(req);
    where = this._buildSearchClause(req, where);
    
    // Check if where has Op.or or Op.and (Symbol keys)
    if (where[Op.or]) {
      const conditions = where[Op.or];
      if (Array.isArray(conditions) && conditions.length > 0) {
        return where;
      }
      return undefined;
    }
    
    if (where[Op.and]) {
      const conditions = where[Op.and];
      if (Array.isArray(conditions) && conditions.length > 0) {
        return where;
      }
      return undefined;
    }
    
    // Check if has regular string keys (filter conditions)
    const keys = Object.keys(where);
    if (keys.length === 0) {
      return undefined;
    }
    
    return where;
  }

  _buildOrderClause(req) {
    if (req.query.sortBy && this.allowSort.length > 0 && this.allowSort.includes(req.query.sortBy)) {
      const sortOrder = req.query.sortOrder && req.query.sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      return [[req.query.sortBy, sortOrder]];
    }
    return undefined;
  }

  _getListOptions(req) {
    return {};
  }

  async list(req, res) {
    try {
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limitInput = parseInt(req.query.limit, 10);
      const limit = limitInput && limitInput > 0 ? Math.min(limitInput, 100) : 10;
      const offset = (page - 1) * limit;

      const where = this._buildWhereClause(req);
      const order = this._buildOrderClause(req);
      const options = this._getListOptions(req);
      
      console.log('Final where clause:', JSON.stringify(where, null, 2));
      console.log('Order:', order);
      console.log('Options:', JSON.stringify(options, null, 2));
      
      const { rows, count } = await this.Model.findAndCountAll({
        where,
        offset,
        limit,
        order,
        ...options
      });

      return sendSuccess(res, {
        items: rows,
        meta: {
          page,
          limit,
          total: count,
          totalPages: Math.max(Math.ceil(count / limit), 1),
        },
      }, "Lấy danh sách thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async getById(req, res) {
    try {
      const item = await this.Model.findByPk(req.params.id);
      if (!item) {
        return sendNotFound(res, "Không tìm thấy");
      }
      return sendSuccess(res, item, "Lấy thông tin thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async create(req, res) {
    try {
      const item = await this.Model.create(req.body);
      return sendCreated(res, item, "Tạo thành công");
    } catch (err) {
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }

  async update(req, res) {
    try {
      const item = await this.Model.findByPk(req.params.id);
      if (!item) {
        return sendNotFound(res, "Không tìm thấy");
      }
      await item.update(req.body);
      return sendSuccess(res, item, "Cập nhật thành công");
    } catch (err) {
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }

  async remove(req, res) {
    try {
      const item = await this.Model.findByPk(req.params.id);
      if (!item) {
        return sendNotFound(res, "Không tìm thấy");
      }
      await item.destroy();
      return sendSuccess(res, null, "Xóa thành công");
    } catch (err) {
      return sendServerError(res, "Lỗi máy chủ");
    }
  }
}

module.exports = BaseController;

