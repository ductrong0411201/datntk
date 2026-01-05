const BaseController = require("./BaseController");
const { Answer, User, Question } = require("../models");
const { sendSuccess, sendNotFound, sendServerError, sendCreated, sendBadRequest } = require("../utils/response");

class AnswerController extends BaseController {
  constructor() {
    super("Answer", {
      allowSearch: ["content"],
      allowFilter: ["id", "question_id", "user_id"],
      allowSort: ["id", "createdAt", "updatedAt"]
    });
  }

  _buildFilterClause(req) {
    const where = {};
    if (req.params.questionId) {
      where.question_id = req.params.questionId;
    }
    if (this.allowFilter && this.allowFilter.length > 0) {
      this.allowFilter.forEach(field => {
        if (req.query[field] !== undefined && req.query[field] !== null && req.query[field] !== '') {
          where[field] = req.query[field];
        }
      });
    }
    this.filter = Object.keys(where).length > 0;
    return where;
  }

  _getListOptions(req) {
    const where = {};
    if (req.params.questionId) {
      where.question_id = req.params.questionId;
    }
    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "userName", "email"]
        },
        {
          model: Question,
          as: "question",
          attributes: ["id", "content"]
        }
      ],
      order: [["createdAt", "ASC"]]
    };
  }

  async create(req, res) {
    try {
      const { question_id, content } = req.body;
      const user_id = req.user.id;

      if (!question_id || !content) {
        return sendBadRequest(res, "question_id và content là bắt buộc");
      }

      const question = await Question.findByPk(question_id);
      if (!question) {
        return sendNotFound(res, "Không tìm thấy câu hỏi");
      }

      const answer = await Answer.create({
        question_id,
        user_id,
        content
      });

      const createdAnswer = await Answer.findByPk(answer.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "userName", "email"]
          }
        ]
      });

      return sendCreated(res, createdAnswer, "Tạo câu trả lời thành công");
    } catch (err) {
      console.error(err.message);
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }
}

module.exports = new AnswerController();

