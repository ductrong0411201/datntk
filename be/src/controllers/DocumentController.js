const BaseController = require("./BaseController");
const { Document, User, Lesson, DocumentType } = require("../models");
const { sendSuccess, sendCreated, sendBadRequest, sendServerError, sendNotFound } = require("../utils/response");
const decodeFileName = require("../utils/decodeFileName");
const path = require("path");
const fs = require("fs");

class DocumentController extends BaseController {
  constructor() {
    super("Document", {
      allowFilter: ["id", "user_id", "lessonn_id", "document_type_id", "target_user_id"],
      allowSort: ["id", "name", "createdAt", "updatedAt"]
    });
  }

  _getListOptions(req) {
    const { User, Lesson, DocumentType } = require("../models");
    return {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "userName", "email"]
        },
        {
          model: User,
          as: "targetUser",
          attributes: ["id", "name", "userName", "email"],
          required: false
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
    };
  }

  async upload(req, res) {
    try {
      if (!req.file) {
        return sendBadRequest(res, "Không có file được upload");
      }

      const user_id = req.user?.id;
      if (!user_id) {
        if (req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return sendBadRequest(res, "Không thể xác định người dùng");
      }

      const { lesson_id, document_type_code, target_user_id } = req.body;
      
      // Mặc định là "Tài liệu lớp học" nếu không có document_type_code
      const finalDocumentTypeCode = document_type_code || "tai-lieu-lop-hoc";
      
      const documentType = await DocumentType.findOne({
        where: { code: finalDocumentTypeCode }
      });
      if (!documentType) {
        if (req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return sendBadRequest(res, "Không tìm thấy loại tài liệu");
      }

      // Decode tên file để hỗ trợ tiếng Việt
      const originalName = decodeFileName(req.file.originalname);

      const documentData = {
        name: originalName,
        file_path: `/uploads/${req.file.filename}`,
        file_name: req.file.filename,
        file_size: req.file.size,
        file_mimetype: req.file.mimetype,
        user_id: parseInt(user_id),
        lessonn_id: parseInt(lesson_id),
        document_type_id: documentType.id
      };

      if (target_user_id) {
        documentData.target_user_id = parseInt(target_user_id);
      }

      const document = await Document.create(documentData);

      const createdDocument = await Document.findByPk(document.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "userName", "email"]
          },
          {
            model: User,
            as: "targetUser",
            attributes: ["id", "name", "userName", "email"],
            required: false
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

  async remove(req, res) {
    try {
      const document = await Document.findByPk(req.params.id);
      if (!document) {
        return sendNotFound(res, "Không tìm thấy tài liệu");
      }

      const filePath = path.join(__dirname, "../../", document.file_path);
      
      await document.destroy();

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error("Lỗi khi xóa file:", unlinkErr);
        }
      }

      return sendSuccess(res, null, "Xóa tài liệu thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, err.message || "Xóa tài liệu thất bại");
    }
  }
}

module.exports = new DocumentController();

