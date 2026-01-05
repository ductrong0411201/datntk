const BaseController = require("./BaseController");
const { Question, User, Course, Answer } = require("../models");
const { sendSuccess, sendNotFound, sendServerError, sendCreated, sendBadRequest } = require("../utils/response");

class QuestionController extends BaseController {
  constructor() {
    super("Question", {
      allowSearch: ["content"],
      allowFilter: ["id", "course_id", "user_id"],
      allowSort: ["id", "createdAt", "updatedAt"]
    });
  }

  _getListOptions(req) {
    return {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "userName", "email"]
        },
        {
          model: Course,
          as: "course",
          attributes: ["id", "name"]
        },
        {
          model: Answer,
          as: "answers",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "userName", "email"]
            }
          ],
          order: [["createdAt", "ASC"]]
        }
      ],
      order: [["createdAt", "DESC"]]
    };
  }

  async getByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      
      const questions = await Question.findAll({
        where: { course_id: courseId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "userName", "email"]
          },
          {
            model: Answer,
            as: "answers",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "userName", "email"]
              }
            ],
            order: [["createdAt", "ASC"]]
          }
        ],
        order: [["createdAt", "DESC"]]
      });

      return sendSuccess(res, questions, "Lấy danh sách câu hỏi thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async create(req, res) {
    try {
      const { course_id, content } = req.body;
      const user_id = req.user.id;

      if (!course_id || !content) {
        return sendBadRequest(res, "course_id và content là bắt buộc");
      }

      const course = await Course.findByPk(course_id);
      if (!course) {
        return sendNotFound(res, "Không tìm thấy khóa học");
      }

      const question = await Question.create({
        course_id,
        user_id,
        content
      });

      const createdQuestion = await Question.findByPk(question.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "userName", "email"]
          },
          {
            model: Answer,
            as: "answers",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "userName", "email"]
              }
            ]
          }
        ]
      });

      return sendCreated(res, createdQuestion, "Tạo câu hỏi thành công");
    } catch (err) {
      console.error(err.message);
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }
}

module.exports = new QuestionController();

