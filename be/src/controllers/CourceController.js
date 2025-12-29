const BaseController = require("./BaseController");
const { Lesson } = require("../models");

class CourceController extends BaseController {
  constructor() {
    super("Cource", {
      allowSearch: ["name", "description"],
      allowFilter: ["id", "subject_id", "teacher_id", "grade"],
      allowSort: ["id", "name", "start_date", "end_date", "price", "createdAt", "updatedAt"]
    });
  }

  _getListOptions(req) {
    const { Subject, User } = require("../models");
    return {
      include: [
        {
          model: Subject,
          as: "subject",
          attributes: ["id", "name"]
        },
        {
          model: User,
          as: "teacher",
          attributes: ["id", "name", "userName", "email"]
        }
      ]
    };
  }

  async getById(req, res) {
    try {
      const { Subject, User } = require("../models");
      const { sendSuccess, sendNotFound, sendServerError } = require("../utils/response");
      
      const cource = await this.Model.findByPk(req.params.id, {
        include: [
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name"]
          },
          {
            model: User,
            as: "teacher",
            attributes: ["id", "name", "userName", "email"]
          },
          {
            model: Lesson,
            as: "lessons",
            attributes: ["id", "name", "start", "end"],
            order: [["start", "ASC"]]
          }
        ]
      });

      if (!cource) {
        return sendNotFound(res, "Không tìm thấy");
      }

      return sendSuccess(res, cource, "Lấy thông tin thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async create(req, res) {
    try {
      const { sendCreated, sendBadRequest } = require("../utils/response");
      const { Cource } = require("../models");
      const { 
        name, 
        subject_id, 
        grade, 
        start_date, 
        end_date, 
        description, 
        teacher_id, 
        price,
        lessonDays
      } = req.body;

      const cource = await Cource.create({
        name,
        subject_id,
        grade,
        start_date,
        end_date,
        description,
        teacher_id,
        price
      });

      if (lessonDays && Array.isArray(lessonDays) && lessonDays.length > 0) {
        await this._createLessonsFromArray(cource.id, start_date, end_date, lessonDays);
      }

      const createdCource = await Cource.findByPk(cource.id, {
        include: [
          {
            model: require("../models").Subject,
            as: "subject",
            attributes: ["id", "name"]
          },
          {
            model: require("../models").User,
            as: "teacher",
            attributes: ["id", "name", "userName", "email"]
          }
        ]
      });

      return sendCreated(res, createdCource, "Tạo khóa học thành công");
    } catch (err) {
      const { sendBadRequest } = require("../utils/response");
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }

  async _createLessonsFromArray(courceId, startDate, endDate, lessonDaysArray) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const lessons = [];
    let lessonNumber = 1;

    // Duyệt qua các ngày từ start đến end
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeekCurrent = currentDate.getDay();
      
      // Tìm các lesson config có thứ trùng với ngày hiện tại
      const matchingConfigs = lessonDaysArray.filter(config => config.dayOfWeek === dayOfWeekCurrent);
      
      // Với mỗi config trùng, tạo một lesson
      matchingConfigs.forEach(lessonConfig => {
        const { startTime, endTime, name: lessonName } = lessonConfig;
        
        // Parse thời gian
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const lessonStart = new Date(currentDate);
        lessonStart.setHours(startHour, startMinute, 0, 0);
        
        const lessonEnd = new Date(currentDate);
        lessonEnd.setHours(endHour, endMinute, 0, 0);

        // Sử dụng tên từ config hoặc tên mặc định
        const finalLessonName = lessonName || `Buổi ${lessonNumber}`;

        lessons.push({
          cource_id: courceId,
          name: finalLessonName,
          start: lessonStart,
          end: lessonEnd,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Tăng lessonNumber cho mỗi lesson được tạo
        lessonNumber++;
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (lessons.length > 0) {
      await Lesson.bulkCreate(lessons);
    }
  }
}

module.exports = new CourceController();

