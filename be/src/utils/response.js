const sendResponse = (res, statusCode, data = null, message = "") => {
  const statusMessages = {
    200: "Thành công",
    201: "Tạo thành công",
    400: "Yêu cầu không hợp lệ",
    401: "Không được phép",
    403: "Bị cấm",
    404: "Không tìm thấy",
    500: "Lỗi máy chủ"
  }

  const defaultMessage = message || statusMessages[statusCode] || ""

  return res.status(statusCode).json({
    status: statusCode,
    message: defaultMessage,
    data: data,
  })
}

const sendSuccess = (res, data = null, message = "Thành công") => {
  return sendResponse(res, 200, data, message)
}

const sendCreated = (res, data = null, message = "Tạo thành công") => {
  return sendResponse(res, 201, data, message)
}

const sendError = (res, statusCode, message = "") => {
  return sendResponse(res, statusCode, null, message)
}

const sendBadRequest = (res, message = "Yêu cầu không hợp lệ") => {
  return sendError(res, 400, message)
}

const sendUnauthorized = (res, message = "Không được phép") => {
  return sendError(res, 401, message)
}

const sendNotFound = (res, message = "Không tìm thấy") => {
  return sendError(res, 404, message)
}

const sendServerError = (res, message = "Lỗi máy chủ") => {
  return sendError(res, 500, message)
}

module.exports = {
  sendResponse,
  sendSuccess,
  sendCreated,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendNotFound,
  sendServerError
}
