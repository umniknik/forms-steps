import React, { useState } from "react";

function Steps() {
    //Обработчик отправки формы, чтобы отменить автоматическую отправку формы
    const handleSubmit = evt => {
        // Отключаем автоматическую отправку
        evt.preventDefault();

        //Проверяем находимся ли мы в режиме редактирования
        if (form.buttonEdit) {  //Если находимся, то

            const existingRecord = records.find(record => record.date === form.date); // Ищем запись с новой датой 

            if (existingRecord) {
                // Если запись с новой датой уже существует, просто обновляем дистанцию
                existingRecord.distance = +form.distance; // Обновляем дистанцию
                setRecords([...records]); // Обновляем состояние
            } else {
                // Если записи с новой датой нет, то удаляем старую запись и добавляем запись с новой изменной датой
                //debugger;
                hadleDelete(form.buttonEdit); // Удаляем старую запись по старой дате

                // Добавляем новую запись с обновленной датой и дистанцией
                const newRecord = {
                    date: form.date,
                    distance: form.distance
                };

                //Этот код у меня не сработал, т.к. через дебагер увидел, что при удалении записиь в функции hadleDelete, она все ещё остается в состоянии records. Много времени потратил на решение
                //  const newRecords = [...records, newRecord].sort((a, b) => new Date(a.date) - new Date(b.date));
                //  setRecords(newRecords); // Обновляем состояние с новыми записями

                //Сработало через функцию обратного вызова, это позволяет получить актуальное состояние records на момент обновления               
                setRecords(records => {
                    const newRecords = [...records, newRecord].sort((a, b) => new Date(a.date) - new Date(b.date));
                    return newRecords; // Возвращаем новое состояние
                }

                );

            }

        } else {     //Если не находимся в режиме редактирования и просто добавляем новую запись, то 

            //Проверяем есть ли запись с такой же датой
            const existingRecord = records.find(record => record.date === form.date);
            if (existingRecord) {
                // Если запись существует, то Обновляем дистанцию для существующей записи
                existingRecord.distance = +existingRecord.distance + +form.distance;    //Плюсами превращаем строки в числа
                setRecords([...records]); // Обновляем состояние с изменённым массивом
            } else {
                // Если записи нет, добавляем новую
                //Сортируем массив записей сразу после добавления каждой записи и помещаем отсоротированный массив в состояние хранения записей
                const newRecords = [...records, form].sort((a, b) => new Date(a.date) - new Date(b.date));
                setRecords(newRecords);
            }

        }

        // Очищаем поля формы
        setForm({
            date: '',
            distance: '',
            buttonEdit: false
        })
    }

    //Состояние для формы
    const [form, setForm] = useState({
        date: '',
        distance: '',
        buttonEdit: false  //Добавил в состояния переменную редактирования, по которой будем понимать добавляем ли мы новую запись или режактируем существующую, чтобы знать что делать при нажатии кнопки ОК
    })

    //Состояние для хранения записанных значений
    const [records, setRecords] = useState([]);


    // Функция обновления состояния даты или дистанции при вводе данных в соответствующее поле
    const handleDate = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }

    //Функция редактирования записи из состояния при клике по кнопке режактировать
    const hadleEdit = (date, distance) => {
        console.log(date, distance);
        //Подставляем в поля формы переданные значения из аргументов
        setForm({
            date: date,
            distance: distance,
            buttonEdit: date  //Сначала передавал true и false, но потом решил сразу отправлять в этом аргументе и дату реактируемой записи это экономит код
        })
    }

    //Функция удаления записи из состояния при клике по кнопке удалить
    const hadleDelete = (date) => {
        const updateRcords = records.filter(record => record.date !== date);
        // debugger;
        setRecords(updateRcords);
    }

    return (
        <div className='main'>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor='date'>Дата (ДД.ММ.ГГ)</label>
                    <input type="date" id='date' name='date' value={form.date} onChange={handleDate} />
                </div>
                <div className="form-group">
                    <label htmlFor='distance'>Пройденно км</label>
                    <input type="number" id='distance' name='distance' value={form.distance} onChange={handleDate} min="0"/>
                </div>
                <button type="submit" className="buttonOk">ОК</button>
            </form>

            <div className="namesСolumn">
                <span>Дата (ДД.ММ.ГГ)</span>
                <span>Пройденно км</span>
                <span>Действия</span>
            </div>

            <div className="listRecords">
                {records.map((record, index) =>
                    <div key={record.date} className='list'>
                        <span>{record.date}</span>
                        <span>{record.distance}</span>
                        <span>
                            <button className="buttonInList" onClick={() => hadleEdit(record.date, record.distance)}>✎</button>
                            <button className="buttonInList" onClick={() => hadleDelete(record.date)}>✘</button>
                        </span>
                    </div>

                )}
            </div>

            <div>
            </div>
        </div>
    )

}

export default Steps;