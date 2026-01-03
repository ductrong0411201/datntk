const BaseController = require("./BaseController");
const { Lesson, Subject, User, Course, Role } = require("../models");
const { sendSuccess, sendNotFound, sendServerError, sendCreated, sendBadRequest } = require("../utils/response");

class CourseController extends BaseController {
  constructor() {
    super("Course", {
      allowSearch: ["name", "description"],
      allowFilter: ["id", "subject_id", "teacher_id", "grade"],
      allowSort: ["id", "name", "start_date", "end_date", "price", "createdAt", "updatedAt"]
    });
  }

  _getListOptions(req) {
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
      const course = await this.Model.findByPk(req.params.id, {
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

      if (!course) {
        return sendNotFound(res, "Không tìm thấy");
      }

      return sendSuccess(res, course, "Lấy thông tin thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async create(req, res) {
    try {
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

      const course = await Course.create({
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
        await this._createLessonsFromArray(course.id, start_date, end_date, lessonDays);
      }

      const createdCourse = await Course.findByPk(course.id, {
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
      });

      return sendCreated(res, createdCourse, "Tạo khóa học thành công");
    } catch (err) {
      return sendBadRequest(res, err.message || "Dữ liệu không hợp lệ");
    }
  }

  async _createLessonsFromArray(courseId, startDate, endDate, lessonDaysArray) {
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
          course_id: courseId,
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

  async getStudents(req, res) {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) {
        return sendNotFound(res, "Không tìm thấy khóa học");
      }

      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      if (!studentRole) {
        return sendSuccess(res, [], "Lấy danh sách học sinh thành công");
      }

      const students = await course.getStudents({
        where: { role: studentRole.id },
        attributes: ["id", "name", "userName", "email", "phoneNumber", "address", "dateOfBirth"],
        through: { attributes: [] }
      });

      return sendSuccess(res, students, "Lấy danh sách học sinh thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }

  async addStudent(req, res) {
    try {
      const { student_id } = req.body;

      if (!student_id) {
        return sendBadRequest(res, "student_id là bắt buộc");
      }

      const course = await Course.findByPk(req.params.id);
      if (!course) {
        return sendNotFound(res, "Không tìm thấy khóa học");
      }

      const student = await User.findByPk(student_id);
      if (!student) {
        return sendNotFound(res, "Không tìm thấy học sinh");
      }

      const students = await course.getStudents({ where: { id: student_id } });
      if (students.length > 0) {
        return sendBadRequest(res, "Học sinh đã có trong khóa học");
      }

      await course.addStudent(student_id);

      const updatedStudent = await User.findByPk(student_id, {
        attributes: ["id", "name", "userName", "email", "phoneNumber", "address", "dateOfBirth"]
      });

      return sendSuccess(res, updatedStudent, "Thêm học sinh vào khóa học thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, err.message || "Lỗi máy chủ");
    }
  }

  async removeStudent(req, res) {
    try {
      const { student_id } = req.params;

      const course = await Course.findByPk(req.params.id);
      if (!course) {
        return sendNotFound(res, "Không tìm thấy khóa học");
      }

      await course.removeStudent(student_id);

      return sendSuccess(res, null, "Xóa học sinh khỏi khóa học thành công");
    } catch (err) {
      console.error(err.message);
      return sendServerError(res, "Lỗi máy chủ");
    }
  }
}

module.exports = new CourseController();

