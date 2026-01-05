/**
 * Decode tên file để hỗ trợ tiếng Việt và các ký tự đặc biệt
 * Multer có thể nhận tên file từ Content-Disposition header đã bị encode
 * @param {string} fileName - Tên file gốc từ multer
 * @returns {string} - Tên file đã được decode
 */
function decodeFileName(fileName) {
  if (!fileName) {
    return fileName;
  }

  let decodedName = fileName;

  try {
    // Multer có thể nhận tên file từ Content-Disposition header đã bị encode
    // Thử decode từ ISO-8859-1 (latin1) sang UTF-8
    // Đây là encoding mặc định của HTTP headers khi có ký tự đặc biệt
    const buffer = Buffer.from(decodedName, 'latin1');
    const decoded = buffer.toString('utf8');

    // Kiểm tra xem có ký tự tiếng Việt không và decode có hợp lệ không
    const hasVietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(decoded);
    const isValidDecode = decoded && !decoded.includes('�') && decoded.length > 0;

    if (hasVietnameseChars || isValidDecode) {
      decodedName = decoded;
    }

    // Nếu vẫn chưa đúng, thử decode từ URL encoding
    try {
      const urlDecoded = decodeURIComponent(decodedName);
      if (urlDecoded !== decodedName && urlDecoded.length > 0) {
        decodedName = urlDecoded;
      }
    } catch (urlErr) {
      // URL decode không thành công, giữ nguyên
    }
  } catch (err) {
    // Nếu decode lỗi thì giữ nguyên tên gốc
    console.warn("Không thể decode tên file:", err.message);
  }

  return decodedName;
}

module.exports = decodeFileName;

