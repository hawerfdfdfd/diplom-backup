// Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { FaEdit, FaSignOutAlt, FaEnvelope, FaArrowUp } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EmployeeDetail from "./EmployeeDetail";
import MailDetail from "../MailDetail/MailDetail";
import "../../../../css/main.css"; //imp4

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [mails, setMails] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [slide, setSlide] = useState(0); // 0 = сотрудники, 1 = почта
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // refs for header hide-on-scroll
  const headerWrapperRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // load data
  useEffect(() => {
    Axios.get("http://localhost:3002/employees")
      .then(({ data }) => setEmployees(data))
      .catch(console.error);

    Axios.get("http://localhost:3002/mails")
      .then(({ data }) => setMails(data))
      .catch(console.error);

    Axios.get("http://localhost:3002/departments")
      .then(({ data }) => setDepartments(data))
      .catch(console.error);

    Axios.get("http://localhost:3002/workschedules")
      .then(({ data }) => setWorkSchedules(data))
      .catch(console.error);
  }, []);

  // hide header on scroll down
  useEffect(() => {
    const cardsEl = cardsContainerRef.current;
    const headerEl = headerWrapperRef.current;
    if (!cardsEl || !headerEl) return;

    let lastScroll = 0;
    function onScroll() {
      const cur = cardsEl.scrollTop;
      if (cur > lastScroll + 10) headerEl.classList.add("scrolled");
      else if (cur < lastScroll - 10) headerEl.classList.remove("scrolled");
      lastScroll = cur;
    }

    cardsEl.addEventListener("scroll", onScroll);
    return () => cardsEl.removeEventListener("scroll", onScroll);
  }, [selectedEmployee]);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.first_name} ${emp.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleEmployeeUpdate = (updated) => {
    if (!updated.employee_id) return;
    setEmployees((prev) =>
      prev.map((e) => (e.employee_id === updated.employee_id ? updated : e))
    );
    setSelectedEmployee((cur) =>
      cur && cur.employee_id === updated.employee_id ? updated : cur
    );
  };

  const handleLogout = () => navigate("/");
  const handleCloseEmployee = () => setSelectedEmployee(null);
  const handleCloseMail = () => setSelectedMail(null);

  const handleMailDecision = (mailId, mode) => {
    // remove processed mail from list
    setMails((prev) => prev.filter((m) => m.id !== mailId));
  };

  return (
    <div className="dashboard-container">
      <div
        className="slides"
        style={{
          transform: slide === 0 ? "translateY(0)" : "translateY(-100vh)",
        }}
      >
        {/* === Слайд 0: сотрудники === */}
        <section className="slide screen-emps">
          <div ref={headerWrapperRef} className="header-wrapper">
            <header className="dashboard-header">
              {!selectedEmployee && (
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Поиск по имени и фамилии"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </header>
            {!selectedEmployee && (
              <>
                <div className="desktop-header-buttons">
                  <FaEnvelope
                    className="btn-mail-desktop"
                    size={24}
                    onClick={() => setSlide(1)}
                    title="Почта заявлений"
                  />
                  <FaSignOutAlt
                    className="logout-icon-desktop"
                    size={24}
                    onClick={handleLogout}
                    title="Выйти"
                  />
                </div>
                <div className="mobile-header-buttons">
                  <FaEnvelope
                    className="btn-mail-mobile"
                    size={24}
                    onClick={() => setSlide(1)}
                    title="Почта заявлений"
                  />
                  <FaSignOutAlt
                    className="logout-icon-mobile"
                    size={24}
                    onClick={handleLogout}
                    title="Выйти"
                  />
                </div>
              </>
            )}
          </div>

          <AnimatePresence>
            {selectedEmployee && (
              <EmployeeDetail
                employee={selectedEmployee}
                departments={departments}
                workSchedules={workSchedules}
                onClose={handleCloseEmployee}
                onEmployeeUpdate={handleEmployeeUpdate}
              />
            )}
          </AnimatePresence>

          {!selectedEmployee && (
            <div ref={cardsContainerRef} className="cards-container">
              {filteredEmployees.length ? (
                filteredEmployees.map((emp) => (
                  <div key={emp.employee_id} className="employee-card">
                    <FaEdit
                      className="edit-icon"
                      size={20}
                      onClick={() => setSelectedEmployee(emp)}
                    />
                    <ul>
                      <li>Имя: {emp.first_name}</li>
                      <li>Фамилия: {emp.last_name}</li>
                      <li>Почта: {emp.email}</li>
                      <li>Телефон: {emp.phone_number}</li>
                      <li>
                        Начало: {emp.hire_date.match(/\d{4}-\d{2}-\d{2}/)?.[0]}
                      </li>
                      <li>Должность: {emp.job_title}</li>
                      <li>Квалификация: {emp.qualification}</li>
                      <li>Зарплата: {emp.salary}</li>
                      <li>Рабочие часы: {emp.working_hours}</li>
                      <li>Тип смены: {emp.shift_type}</li>
                    </ul>
                  </div>
                ))
              ) : (
                <p className="empty">Сотрудники не найдены.</p>
              )}
            </div>
          )}
        </section>

        {/* === Слайд 1: почта заявлений === */}
        <section className="slide screen-mail">
          {/* Mail detail overlay */}
          {selectedMail && (
            <MailDetail
              mail={selectedMail}
              onClose={handleCloseMail}
              onDecision={handleMailDecision}
            />
          )}

          <header className="dashboard-header header-mail">
            <FaArrowUp
              className="btn-back-desktop"
              size={24}
              onClick={() => setSlide(0)}
              title="К сотрудникам"
            />
            <h2>Почта заявлений</h2>
            <FaSignOutAlt
              className="logout-icon-desktop"
              size={24}
              onClick={handleLogout}
              title="Выйти"
            />
          </header>

          {mails.length ? (
            <div className="mails-container">
              {mails.map((m) => (
                <div key={m.id} className="mail-card">
                  <strong>Заявление</strong>
                  <div>Тема: {m.subject}</div>
                  <div>От: {m.employeeName}</div>
                  <div className="mail-card-actions">
                    <button onClick={() => setSelectedMail(m)}>Ответить</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-mail">Входящие пусты</div>
          )}
        </section>
      </div>
    </div>
  );
}
