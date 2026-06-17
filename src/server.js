const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let students = [
  {
    id: 1,
    name: 'Pham Van Su',
    email: '23010523@st.phenikaa-uni.edu.vn',
    major: 'Artificial Intelligence and Data Science'
  },
  {
    id: 2,
    name: 'Nguyen Van Thang',
    email: '23010572@st.phenikaa-uni.edu.vn',
    major: 'Computer Science'
  },
  {
    id: 3,
    name: 'Dang Anh Tuyen',
    email: '23010912@st.phenikaa-uni.edu.vn',
    major: 'Computer Science'
  },
  {
    id: 4,
    name: 'Nguyen Van Vu',
    email: '23010734@st.phenikaa-uni.edu.vn',
    major: 'Computer Science'
  }
];

let nextId = 5;

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateStudentInput(body, requireAllFields = true) {
  const errors = [];

  if (requireAllFields || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('name phải là chuỗi có ít nhất 2 ký tự');
    }
  }

  if (requireAllFields || body.email !== undefined) {
    if (!isValidEmail(body.email)) {
      errors.push('email không đúng định dạng');
    }
  }

  if (requireAllFields || body.major !== undefined) {
    if (!body.major || typeof body.major !== 'string' || body.major.trim().length < 2) {
      errors.push('major phải là chuỗi có ít nhất 2 ký tự');
    }
  }

  return errors;
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student API is running',
    guide: 'Dùng Postman để kiểm thử các endpoint trong /api/students',
    endpoints: [
      'GET /api/students',
      'GET /api/students/:id',
      'POST /api/students',
      'PUT /api/students/:id',
      'DELETE /api/students/:id'
    ]
  });
});

app.get('/api/students', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(item => item.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy sinh viên có id = ${id}`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

app.post('/api/students', (req, res) => {
  const errors = validateStudentInput(req.body, true);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu gửi lên không hợp lệ',
      errors
    });
  }

  const existedEmail = students.some(item => item.email === req.body.email);
  if (existedEmail) {
    return res.status(409).json({
      success: false,
      message: 'Email đã tồn tại trong hệ thống'
    });
  }

  const newStudent = {
    id: nextId++,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    major: req.body.major.trim()
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: 'Thêm sinh viên thành công',
    data: newStudent
  });
});

app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const studentIndex = students.findIndex(item => item.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy sinh viên có id = ${id}`
    });
  }

  const errors = validateStudentInput(req.body, false);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu cập nhật không hợp lệ',
      errors
    });
  }

  if (req.body.email) {
    const existedEmail = students.some(item => item.email === req.body.email && item.id !== id);
    if (existedEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng bởi sinh viên khác'
      });
    }
  }

  students[studentIndex] = {
    ...students[studentIndex],
    name: req.body.name ? req.body.name.trim() : students[studentIndex].name,
    email: req.body.email ? req.body.email.trim() : students[studentIndex].email,
    major: req.body.major ? req.body.major.trim() : students[studentIndex].major
  };

  res.status(200).json({
    success: true,
    message: 'Cập nhật sinh viên thành công',
    data: students[studentIndex]
  });
});

app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const studentIndex = students.findIndex(item => item.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy sinh viên có id = ${id}`
    });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Xóa sinh viên thành công',
    data: deletedStudent
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

app.listen(PORT, () => {
  console.log(`Student API is running at http://localhost:${PORT}`);
});
