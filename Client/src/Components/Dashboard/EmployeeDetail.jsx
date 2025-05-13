import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Axios from "axios";
import "../../../../css/main.css";

export default function EmployeeDetail({
  employee,
  departments,
  workSchedules,
  onClose,
  onEmployeeUpdate,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    hire_date: "",
    job_title: "",
    qualification: "",
    salary: "",
    working_hours: "",
    shift_type: "",
  });
  const [editedDeptName, setEditedDeptName] = useState("");
  const [scheduleId, setScheduleId] = useState(null);

  const schedule = workSchedules.find(
    (s) => s.employee_id === employee.employee_id
  ) || {
    schedule_id: null,
    working_hours: "",
    shift_type: "",
  };

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone_number: employee.phone_number,
        hire_date: employee.hire_date?.substring(0, 10) || "",
        job_title: employee.job_title,
        qualification: employee.qualification,
        salary: employee.salary,
        working_hours: schedule.working_hours || "",
        shift_type: schedule.shift_type || "",
      });
      setEditedDeptName(employee.department_name || "");
      setScheduleId(schedule.schedule_id);
    }
  }, [employee, schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // 1) employees
      const empPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        hire_date: formData.hire_date,
        job_title: formData.job_title,
        qualification: formData.qualification,
        salary: formData.salary,
      };
      await Axios.put(
        `http://localhost:3002/employees/${employee.employee_id}`,
        empPayload
      );

      // 2) рабочие часы и смены — забираем из formData напрямую до setFormData
      const newWorkingHours = formData.working_hours;
      const newShiftType = formData.shift_type;
      if (scheduleId) {
        await Axios.put(`http://localhost:3002/workschedules/${scheduleId}`, {
          working_hours: newWorkingHours,
          shift_type: newShiftType,
        });
      }

      // 3) отдел
      await Axios.put(
        `http://localhost:3002/departments/${employee.department_id}`,
        { department_name: editedDeptName }
      );

      // обновляем локальное состояние сразу на основе этих переменных:
      setFormData((prev) => ({
        ...prev,
        ...empPayload,
        working_hours: newWorkingHours,
        shift_type: newShiftType,
      }));
      setEditedDeptName(editedDeptName);

      // сообщаем родителю
      const updatedEmployee = {
        employee_id: employee.employee_id,
        schedule_id: scheduleId, // <-- добавляем сюда
        ...empPayload,
        working_hours: newWorkingHours,
        shift_type: newShiftType,
        department_id: employee.department_id,
        department_name: editedDeptName,
      };
      onEmployeeUpdate && onEmployeeUpdate(updatedEmployee);

      alert("Данные успешно обновлены!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении данных.");
    }
  };

  return (
    <motion.div
      className="employee-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="detail-header">
        <h2 className="detail-title">Редактирование сотрудника</h2>
        <div className="close-detail" onClick={onClose}>
          <FaTimes size={24} color="#fff" />
        </div>
      </div>

      <div className="detail-content">
        {[
          { label: "Имя", name: "first_name", type: "text" },
          { label: "Фамилия", name: "last_name", type: "text" },
          { label: "Почта", name: "email", type: "email" },
          { label: "Телефон", name: "phone_number", type: "text" },
          { label: "Начало работы", name: "hire_date", type: "date" },
          { label: "Должность", name: "job_title", type: "text" },
          { label: "Квалификация", name: "qualification", type: "text" },
          { label: "Зарплата", name: "salary", type: "number" },
          { label: "Рабочие часы", name: "working_hours", type: "text" },
          { label: "Тип смены", name: "shift_type", type: "text" },
        ].map(({ label, name, type }) => (
          <div className="form-group" key={name}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Текущий отдел:</label>
          <input type="text" value={employee.department_name} disabled />
        </div>
        <div className="form-group">
          <label>Новое название отдела:</label>
          <input
            type="text"
            value={editedDeptName}
            onChange={(e) => setEditedDeptName(e.target.value)}
          />
        </div>
      </div>

      <div className="employee-form-buttons">
        <button className="btn" onClick={handleSave}>
          Сохранить
        </button>
        <button className="btn" onClick={onClose}>
          Отмена
        </button>
      </div>
    </motion.div>
  );
}
