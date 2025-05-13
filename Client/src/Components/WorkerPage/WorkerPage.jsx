import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaPaperPlane, FaArrowUp } from "react-icons/fa";
import Axios from "axios";
import userImg from "../../WorkerAssets/user.png";
import "../../../../css/main.css"; //imp4

export default function WorkerPage() {
  const location = useLocation();
  const userInfo = location.state?.userInfo || null;

  const [slide, setSlide] = useState(0);
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [myMails, setMyMails] = useState([]);
  const [removingId, setRemovingId] = useState(null);

  // Загрузка заявлений сотрудника
  const fetchMyMails = useCallback(() => {
    if (!userInfo) return;
    const empId = userInfo[0].employee_id;
    Axios.get(`http://localhost:3002/mails/employee/${empId}`)
      .then(({ data }) => setMyMails(data))
      .catch(console.error);
  }, [userInfo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchMyMails();
    return () => (document.body.style.overflow = "");
  }, [fetchMyMails]);

  useEffect(() => {
    fetchMyMails();
  }, [fetchMyMails, submitResult]);

  if (!userInfo) return <div className="workerPage">Нет данных</div>;
  const u = userInfo[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      await Axios.post("http://localhost:3002/mails", {
        employee_id: u.employee_id,
        subject,
        start_date: startDate,
        end_date: endDate,
        reason,
      });
      setSubmitResult("success");
      setSubject("");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch {
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const translateStatus = (status) => {
    if (status === "approved") return "Принято";
    if (status === "rejected") return "Отклонено";
    return "В ожидании";
  };

  const markRead = async (id) => {
    const el = document.getElementById(`mail-${id}`);
    if (!el) return;

    // 1) Зафиксировать текущую высоту в inline max-height
    const height = el.scrollHeight;
    el.style.maxHeight = `${height}px`;

    // 2) На следующий тик добавить класс removing
    requestAnimationFrame(() => {
      setRemovingId(id);
    });

    try {
      await Axios.delete(`http://localhost:3002/mails/${id}`);
      // после завершения анимации и удаления из базы
      setTimeout(() => {
        setMyMails((prev) => prev.filter((m) => m.id !== id));
        // убрать inline‑стиль, чтобы карточки нового списка рисовались нормально
        el.style.maxHeight = "";
      }, 400); // совпадает с длительностью transition в CSS
    } catch (err) {
      console.error(err);
      // если ошибка — сбросить класс
      setRemovingId(null);
      el.style.maxHeight = "";
    }
  };

  return (
    <div className="workerPage">
      <div className="background">
        <div className="stars">
          <div id="stars" />
          <div id="stars2" />
          <div id="stars3" />
        </div>
      </div>

      {/* Оверлей уведомления */}
      {(isSubmitting || submitResult) && (
        <div className="notify-overlay">
          <div className="notify-card">
            {isSubmitting && <p>Отправляем заявление...</p>}
            {submitResult === "success" && <p>✅ Заявление отправлено!</p>}
            {submitResult === "error" && <p>❌ Ошибка при отправке.</p>}
            {submitResult && (
              <button
                className="btn"
                onClick={() => {
                  setSubmitResult(null);
                  setSlide(0);
                }}
              >
                ОК
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className="slides"
        style={{ transform: `translateY(-${slide * 100}vh)` }}
      >
        {/* Слайд 0: профиль + мои заявления */}
        <section className="halfSection top">
          <div className="workerUpInfo">
            <div className="workerImgInfo">
              <img src={userImg} alt="user" />
            </div>
            <div className="workerMainInfo">
              <ul>
                <li>Имя: {u.first_name}</li>
                <li>Фамилия: {u.last_name}</li>
                <li>Почта: {u.email}</li>
                <li>Телефон: {u.phone_number}</li>
                <li>
                  Начало работы: {u.hire_date.match(/\d{4}-\d{2}-\d{2}/)[0]}
                </li>
                <li>Должность: {u.job_title}</li>
                <li>Квалификация: {u.qualification}</li>
                <li>Зарплата: {u.salary}</li>
              </ul>
            </div>

            <div className="my-mails">
              <h3>Мои заявления</h3>
              {myMails.length ? (
                <ul className="my-mails-list">
                  {myMails.map((m) => (
                    <li
                      id={`mail-${m.id}`}
                      key={m.id}
                      className={`my-mail-card ${
                        removingId === m.id ? "removing" : ""
                      }`}
                    >
                      <button
                        className="mark-read-btn"
                        onClick={() => markRead(m.id)}
                        title="Отметить как прочитанное"
                      >
                        ✓
                      </button>
                      <div>
                        <strong>Тема:</strong> {m.subject}
                      </div>
                      <div>
                        <strong>Период:</strong>{" "}
                        {m.start_date.match(/\d{4}-\d{2}-\d{2}/)[0]} —{" "}
                        {m.end_date.match(/\d{4}-\d{2}-\d{2}/)[0]}
                      </div>
                      <div>
                        <strong>Статус:</strong>{" "}
                        {translateStatus(m.mail_status)}
                      </div>
                      {m.admin_comment && (
                        <div className="admin-comment">
                          <strong>Комментарий:</strong> {m.admin_comment}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Заявлений нет.</p>
              )}
            </div>
          </div>

          <div className="anchorIcon" onClick={() => setSlide(1)}>
            <FaPaperPlane size={28} />
          </div>
        </section>

        {/* Слайд 1: форма */}
        <section className="halfSection bottom">
          <div className="requestForm">
            <h2>Заявка сотрудника</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Тема заявления</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Выберите тему</option>
                  <option>Отпуск</option>
                  <option>Отгул</option>
                  <option>Больничный</option>
                </select>
              </div>
              <div className="form-group dates">
                <div>
                  <label>С</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>По</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Причина</label>
                <textarea
                  rows="4"
                  placeholder="Опишите..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn">
                  Отправить
                </button>
              </div>
            </form>
            <div className="anchorIcon" onClick={() => setSlide(0)}>
              <FaArrowUp size={28} />
            </div>
          </div>
        </section>
      </div>

      <div className="workerDownButton">
        <Link to="/" className="btn">
          Выйти
        </Link>
      </div>
    </div>
  );
}
