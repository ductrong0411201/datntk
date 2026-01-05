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

  async getMyCourses(req, res) {
    try {
      const userId = req.user.id;
      const studentRole = await Role.findOne({ where: { code: "hocsinh" } });
      const teacherRole = await Role.findOne({ where: { code: "giaovien" } });
      
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: "roleDetail",
            attributes: ["id", "name", "code"]
          }
        ]
      });

      if (!user) {
        return sendNotFound(res, "Không tìm thấy người dùng");
      }

      let courses = [];
      
      if (user.role === teacherRole?.id) {
        courses = await Course.findAll({
          where: { teacher_id: userId },
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
          ],
          order: [["createdAt", "DESC"]]
        });
      } else if (user.role === studentRole?.id) {
        const student = await User.findByPk(userId, {
          include: [
            {
              model: Course,
              as: "enrolledCourses",
              through: { attributes: [] },
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
            }
          ]
        });
        
        courses = student?.enrolledCourses || [];
      } else {
        return sendBadRequest(res, "Người dùng không phải giáo viên hoặc học sinh");
      }

      return sendSuccess(res, courses, "Lấy danh sách khóa học thành công");
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

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeekCurrent = currentDate.getDay();

      const matchingConfigs = lessonDaysArray.filter(config => config.dayOfWeek === dayOfWeekCurrent);

      matchingConfigs.forEach(lessonConfig => {
        const { startTime, endTime, name: lessonName } = lessonConfig;

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const lessonStart = new Date(currentDate);
        lessonStart.setHours(startHour, startMinute, 0, 0);

        const lessonEnd = new Date(currentDate);
        lessonEnd.setHours(endHour, endMinute, 0, 0);

        const finalLessonName = lessonName || `Buổi ${lessonNumber}`;

        lessons.push({
          course_id: courseId,
          name: finalLessonName,
          start: lessonStart,
          end: lessonEnd,
          createdAt: new Date(),
          updatedAt: new Date()
        });

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
