const BaseController = require("./BaseController");
const { Document, User, Lesson, DocumentType } = require("../models");
const { sendSuccess, sendCreated, sendBadRequest, sendServerError } = require("../utils/response");
const path = require("path");
const fs = require("fs");

class DocumentController extends BaseController {
  constructor() {
    super("Document", {});
  }

  async upload(req, res) {
    try {
      if (!req.file) {
        return sendBadRequest(res, "Không có file được upload");
      }

      const { user_id, lesson_id, document_type_id } = req.body;

      if (!user_id || !lesson_id || !document_type_id) {
        if (req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return sendBadRequest(res, "Thiếu thông tin: user_id, lesson_id, document_type_id là bắt buộc");
      }

      const document = await Document.create({
        name: req.file.originalname,
        file_path: `/uploads/${req.file.filename}`,
        file_name: req.file.filename,
        file_size: req.file.size,
        file_mimetype: req.file.mimetype,
        user_id: parseInt(user_id),
        lessonn_id: parseInt(lesson_id),
        document_type_id: parseInt(document_type_id)
      });

      const createdDocument = await Document.findByPk(document.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "userName", "email"]
          },
          {
            model: Lesson,
            as: "lesson",
            attributes: ["id", "name", "start", "end"]
          },
          {
            model: DocumentType,
            as: "documentType",
            attributes: ["id", "name", "code"]
          }
        ]
      });

      return sendCreated(res, createdDocument, "Upload file thành công");
    } catch (err) {
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.error("Lỗi khi xóa file:", unlinkErr);
        }
      }
      console.error(err.message);
      return sendServerError(res, err.message || "Upload file thất bại");
    }
  }
}

module.exports = new DocumentController();

