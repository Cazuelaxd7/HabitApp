/* =========================================================
   HABITAPP
   APP.JS
========================================================= */


/* =========================================================
   ESTADO
========================================================= */

const state = {

    currentScreen: "home",

    selectedFilter: "all",

    selectedSpace: null,

    selectedTime: null,

    selectedDate: new Date(
        2026,
        8,
        27
    ),

    calendarStartDate: new Date(
        2026,
        8,
        27
    ),

    reservations: [

        {
            id: 1,
            space: "Quincho 2",
            date: "2026-09-27",
            time: "18:00 - 21:00",
            status: "upcoming"
        }

    ],

    reservationHistory: [

        {
            id: 101,
            space: "Quincho 1",
            date: "2026-09-20",
            time: "15:00 - 16:00",
            status: "completed"
        },

        {
            id: 102,
            space: "Cancha",
            date: "2026-09-15",
            time: "16:00 - 17:00",
            status: "cancelled"
        }

    ],

    notifications: [

        {
            id: 1,

            title: "Pago recibido",

            text:
                "Tu pago de gastos comunes fue registrado correctamente.",

            time: "Hace 2 horas",

            type: "success",

            unread: true
        },

        {
            id: 2,

            title: "Nuevo comentario",

            text:
                "Catalina Rojas comentó en una publicación de la comunidad.",

            time: "Hace 4 horas",

            type: "blue",

            unread: true
        },

        {
            id: 3,

            title: "Recordatorio de reserva",

            text:
                "Recuerda que tienes una reserva del Quincho 2 este domingo.",

            time: "Ayer",

            type: "purple",

            unread: false
        },

        {
            id: 4,

            title: "Aviso de administración",

            text:
                "Se realizará un corte de agua programado el próximo martes.",

            time: "Ayer",

            type: "warning",

            unread: false
        }

    ],

    posts: [

        {
            id: 1,

            author: "Administración",

            avatar: "AD",

            title: "Corte de agua programado",

            text:
                "Informamos a la comunidad que el martes se realizará un corte de agua entre las 10:00 y 13:00 hrs.",

            category: "admin",

            categoryName: "AVISO",

            likes: 12,

            liked: false,

            own: false,

            commentsList: [

                {
                    id: 1001,
                    author: "Catalina Rojas",
                    avatar: "CR",
                    text: "Gracias por avisar con anticipación.",
                    own: false
                },

                {
                    id: 1002,
                    author: "Diego Flores",
                    avatar: "DF",
                    text: "¿Se sabe si afectará a todas las torres?",
                    own: true
                },

                {
                    id: 1003,
                    author: "María Soto",
                    avatar: "MS",
                    text: "Perfecto, gracias por la información.",
                    own: false
                },

                {
                    id: 1004,
                    author: "Administración",
                    avatar: "AD",
                    text: "Sí, el corte será general.",
                    own: false
                }

            ]

        },

        {
            id: 2,

            author: "Catalina Rojas",

            avatar: "CR",

            title: "Venta de entradas - Concierto",

            text:
                "Me quedan dos entradas para el concierto del sábado. Si alguien está interesado, puede escribirme.",

            category: "community",

            categoryName: "COMUNIDAD",

            likes: 8,

            liked: false,

            own: false,

            commentsList: [

                {
                    id: 2001,
                    author: "Diego Flores",
                    avatar: "DF",
                    text: "¿Todavía te queda una disponible?",
                    own: true
                },

                {
                    id: 2002,
                    author: "Felipe Morales",
                    avatar: "FM",
                    text: "¿A cuánto las estás vendiendo?",
                    own: false
                },

                {
                    id: 2003,
                    author: "Catalina Rojas",
                    avatar: "CR",
                    text: "Sí, todavía me queda una.",
                    own: false
                }

            ]

        },

        {
            id: 3,

            author: "Jardín del Condominio",

            avatar: "JC",

            title: "Feria de emprendedores",

            text:
                "Este sábado tendremos una feria de emprendedores de nuestra comunidad en el salón multiuso.",

            category: "event",

            categoryName: "EVENTO",

            likes: 18,

            liked: false,

            own: false,

            commentsList: [

                {
                    id: 3001,
                    author: "Diego Flores",
                    avatar: "DF",
                    text: "¿A qué hora comienza?",
                    own: true
                },

                {
                    id: 3002,
                    author: "Camila Pérez",
                    avatar: "CP",
                    text: "Qué buena iniciativa.",
                    own: false
                },

                {
                    id: 3003,
                    author: "Jardín del Condominio",
                    avatar: "JC",
                    text: "Comenzará a las 11:00 hrs.",
                    own: false
                },

                {
                    id: 3004,
                    author: "Sebastián Torres",
                    avatar: "ST",
                    text: "¿Se pueden inscribir emprendedores todavía?",
                    own: false
                },

                {
                    id: 3005,
                    author: "Jardín del Condominio",
                    avatar: "JC",
                    text: "Sí, todavía quedan algunos cupos.",
                    own: false
                },

                {
                    id: 3006,
                    author: "María Soto",
                    avatar: "MS",
                    text: "Excelente, ahí estaremos.",
                    own: false
                }

            ]

        }

    ]

};


/* =========================================================
   HORARIOS
========================================================= */

const reservationSchedules = {

    "Quincho 1": [
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00"
    ],

    "Quincho 2": [
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00"
    ],

    "Salón Multiuso 1": [
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00",
        "21:00 - 22:00"
    ],

    "Salón Multiuso 2": [
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00"
    ],

    "Cancha": [
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00"
    ]

};


/* =========================================================
   HORARIOS OCUPADOS DE DEMOSTRACIÓN
========================================================= */

const demoOccupiedSchedules = {

    "2026-09-27": {

        "Quincho 1": [
            "15:00 - 16:00",
            "19:00 - 20:00"
        ],

        "Quincho 2": [
            "18:00 - 19:00",
            "19:00 - 20:00",
            "20:00 - 21:00"
        ],

        "Salón Multiuso 1": [
            "13:00 - 14:00",
            "16:00 - 17:00",
            "20:00 - 21:00"
        ],

        "Salón Multiuso 2": [
            "14:00 - 15:00",
            "18:00 - 19:00"
        ],

        "Cancha": [
            "11:00 - 12:00",
            "16:00 - 17:00"
        ]

    },

    "2026-09-28": {

        "Quincho 1": [
            "16:00 - 17:00"
        ],

        "Quincho 2": [
            "15:00 - 16:00",
            "17:00 - 18:00"
        ],

        "Salón Multiuso 1": [
            "10:00 - 11:00",
            "14:00 - 15:00",
            "18:00 - 19:00"
        ],

        "Salón Multiuso 2": [
            "13:00 - 14:00",
            "19:00 - 20:00"
        ],

        "Cancha": [
            "12:00 - 13:00",
            "15:00 - 16:00"
        ]

    },

    "2026-09-29": {

        "Quincho 1": [
            "13:00 - 14:00",
            "18:00 - 19:00"
        ],

        "Quincho 2": [
            "14:00 - 15:00"
        ],

        "Salón Multiuso 1": [
            "11:00 - 12:00",
            "15:00 - 16:00",
            "21:00 - 22:00"
        ],

        "Salón Multiuso 2": [
            "16:00 - 17:00"
        ],

        "Cancha": [
            "10:00 - 11:00",
            "14:00 - 15:00",
            "17:00 - 18:00"
        ]

    }

};


/* =========================================================
   REFERENCIAS
========================================================= */

const screens =
    document.querySelectorAll(".app-screen");

const navItems =
    document.querySelectorAll(".nav-item");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalContent =
    document.getElementById("modalContent");

const modalClose =
    document.getElementById("modalClose");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const notificationBadge =
    document.getElementById("notificationBadge");

const introScreen =
    document.getElementById("introScreen");


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    setupNavigation();

    setupActions();

    setupCommunity();

    setupNotifications();

    setupReservations();

    setupPayments();

    setupFines();

    setupModal();

    updateNotificationBadge();

    renderNotifications();

    renderReservations();

    renderReservationHistory();

    renderPosts();

    renderCalendar();

    setupIntro();

}


/* =========================================================
   INTRO
========================================================= */

function setupIntro() {

    if (!introScreen) {
        return;
    }

    setTimeout(() => {

        introScreen.classList.add(
            "hidden"
        );

    }, 1300);

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function setupNavigation() {

    navItems.forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                const tab =
                    item.dataset.tab;

                if (!tab) {
                    return;
                }

                navigateTo(tab);

            }
        );

    });

}


function navigateTo(screenName) {

    const targetScreen =
        document.getElementById(
            `screen-${screenName}`
        );

    if (!targetScreen) {
        return;
    }


    screens.forEach((screen) => {

        screen.classList.remove(
            "active"
        );

    });


    targetScreen.classList.add(
        "active"
    );


    state.currentScreen =
        screenName;


    updateNavigation(
        screenName
    );


    targetScreen.scrollTop = 0;

}


function updateNavigation(screenName) {

    navItems.forEach((item) => {

        item.classList.remove(
            "active"
        );


        if (
            item.dataset.tab ===
            screenName
        ) {

            item.classList.add(
                "active"
            );

        }

    });

}


/* =========================================================
   DATA ACTION
========================================================= */

function setupActions() {

    document.addEventListener(
        "click",
        (event) => {

            const element =
                event.target.closest(
                    "[data-action]"
                );

            if (!element) {
                return;
            }

            handleAction(
                element.dataset.action
            );

        }
    );

}


function handleAction(action) {

    switch (action) {

        case "home":
            navigateTo("home");
            break;

        case "community":
            navigateTo("community");
            break;

        case "reservations":
            navigateTo("reservations");
            break;

        case "notifications":
            navigateTo("notifications");
            break;

        case "profile":
            navigateTo("profile");
            break;

        case "payments":
            navigateTo("payments");
            break;

        case "fines":
            navigateTo("fines");
            break;

        case "settings":

            showToast(
                "Configuración próximamente disponible."
            );

            break;

        case "security":

            showToast(
                "Opciones de seguridad próximamente."
            );

            break;

        case "logout":

            showToast(
                "Sesión cerrada correctamente."
            );

            break;

    }

}


/* =========================================================
   RESERVAS
========================================================= */

function setupReservations() {

    const previous =
        document.getElementById(
            "previousWeek"
        );

    const next =
        document.getElementById(
            "nextWeek"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            () => {

                moveCalendar(
                    -7
                );

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            () => {

                moveCalendar(
                    7
                );

            }
        );

    }


    document.addEventListener(
        "click",
        (event) => {

            const dateButton =
                event.target.closest(
                    ".date-item"
                );

            if (dateButton) {

                selectDate(
                    dateButton.dataset.date
                );

                return;
            }


            const reserveButton =
                event.target.closest(
                    ".reserve-space"
                );

            if (reserveButton) {

                openReservationModal(
                    reserveButton.dataset.space
                );

                return;
            }


            const detailButton =
                event.target.closest(
                    ".reservation-detail"
                );

            if (detailButton) {

                const reservationId =
                    Number(
                        detailButton.dataset.id
                    );

                openReservationDetail(
                    reservationId
                );

                return;
            }


            const repeatButton =
                event.target.closest(
                    ".repeat-reservation"
                );

            if (repeatButton) {

                const reservationId =
                    Number(
                        repeatButton.dataset.id
                    );

                repeatReservation(
                    reservationId
                );

            }

        }
    );

}


/* =========================================================
   CALENDARIO
========================================================= */

function renderCalendar() {

    const container =
        document.getElementById(
            "dateSelector"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            addDays(
                state.calendarStartDate,
                i
            );


        const dateString =
            formatDateISO(date);


        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.className =
            "date-item";

        button.dataset.date =
            dateString;


        if (
            isSameDate(
                date,
                state.selectedDate
            )
        ) {

            button.classList.add(
                "selected"
            );

        }


        if (
            isToday(date)
        ) {

            button.classList.add(
                "today"
            );

        }


        if (
            hasReservationOnDate(
                dateString
            )
        ) {

            button.classList.add(
                "has-reservation"
            );

        }


        button.innerHTML = `

            <span class="date-weekday">
                ${getWeekday(date)}
            </span>

            <span class="date-number">
                ${date.getDate()}
            </span>

        `;


        container.appendChild(
            button
        );

    }


    updateSelectedDateLabel();

    updateSpaceAvailability();

}


function moveCalendar(days) {

    state.calendarStartDate =
        addDays(
            state.calendarStartDate,
            days
        );


    state.selectedDate =
        addDays(
            state.selectedDate,
            days
        );


    renderCalendar();

}


function selectDate(dateString) {

    const parts =
        dateString.split("-");


    state.selectedDate =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    renderCalendar();

}


function updateSelectedDateLabel() {

    const label =
        document.getElementById(
            "selectedDateLabel"
        );


    if (!label) {
        return;
    }


    label.textContent =
        formatLongDate(
            state.selectedDate
        );

}


/* =========================================================
   DISPONIBILIDAD
========================================================= */

function updateSpaceAvailability() {

    const selectedDate =
        formatDateISO(
            state.selectedDate
        );


    document
        .querySelectorAll(
            ".space-card"
        )
        .forEach((card) => {

            const spaceButton =
                card.querySelector(
                    ".reserve-space"
                );


            if (!spaceButton) {
                return;
            }


            const space =
                spaceButton.dataset.space;


            const available =
                getAvailableTimes(
                    space,
                    selectedDate
                );


            const timeButtons =
                card.querySelectorAll(
                    ".time-slot"
                );


            timeButtons.forEach(
                (button) => {

                    const time =
                        button.dataset.time;


                    const occupied =
                        !available.includes(
                            time
                        );


                    button.disabled =
                        occupied;


                    button.classList.toggle(
                        "occupied",
                        occupied
                    );

                }
            );


            const availabilityLabel =
                card.querySelector(
                    ".available"
                );


            if (availabilityLabel) {

                availabilityLabel.textContent =
                    available.length > 0
                        ? "DISPONIBLE"
                        : "COMPLETO";


                availabilityLabel.classList.toggle(
                    "full",
                    available.length === 0
                );

            }

        });

}


function getAvailableTimes(
    space,
    date
) {

    const allTimes =
        reservationSchedules[space] || [];


    const demoOccupied =
        (
            demoOccupiedSchedules[date] &&
            demoOccupiedSchedules[date][space]
        ) || [];


    const userReservations =
        state.reservations
            .filter(
                (reservation) =>
                    reservation.space === space &&
                    reservation.date === date
            )
            .flatMap(
                (reservation) =>
                    expandReservationTimes(
                        reservation.time
                    )
            );


    const occupied = [
        ...demoOccupied,
        ...userReservations
    ];


    return allTimes.filter(
        (time) =>
            !occupied.includes(time)
    );

}


function getAllTimes(space) {

    return reservationSchedules[space] || [];

}


/* =========================================================
   RESERVA NUEVA
========================================================= */

function openReservationModal(space) {

    state.selectedSpace =
        space;

    state.selectedTime =
        null;


    const date =
        formatLongDate(
            state.selectedDate
        );


    const dateISO =
        formatDateISO(
            state.selectedDate
        );


    const allTimes =
        getAllTimes(
            space
        );


    const available =
        getAvailableTimes(
            space,
            dateISO
        );


    const buttons =
        allTimes.map(
            (time) => {

                const occupied =
                    !available.includes(
                        time
                    );


                return `

                    <button
                        class="time-slot reservation-time ${
                            occupied
                                ? "occupied"
                                : ""
                        }"
                        data-time="${time}"
                        type="button"
                        ${
                            occupied
                                ? "disabled"
                                : ""
                        }
                    >

                        <span>
                            ${time}
                        </span>

                        <small>
                            ${
                                occupied
                                    ? "Ocupado"
                                    : "Disponible"
                            }
                        </small>

                    </button>

                `;

            }
        ).join("");


    openModal(`

        <h2 style="
            font-size:19px;
            margin-bottom:5px;
        ">
            Reservar ${space}
        </h2>


        <p style="
            color:#6e6e73;
            font-size:10px;
            margin-bottom:20px;
        ">
            ${date}
        </p>


        <span style="
            display:block;
            font-size:9px;
            font-weight:600;
            margin-bottom:9px;
        ">
            Selecciona un horario
        </span>


        <div
            class="time-slots"
            style="
                margin-bottom:20px;
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
            "
        >

            ${buttons}

        </div>


        <button
            id="confirmReservation"
            class="primary-button"
            type="button"
        >
            Confirmar reserva
        </button>

    `);


    document
        .querySelectorAll(
            ".reservation-time:not(:disabled)"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".reservation-time"
                            )
                            .forEach(
                                (item) =>
                                    item.classList.remove(
                                        "selected"
                                    )
                            );


                        button.classList.add(
                            "selected"
                        );


                        state.selectedTime =
                            button.dataset.time;

                    }
                );

            }
        );


    const confirm =
        document.getElementById(
            "confirmReservation"
        );


    if (confirm) {

        confirm.addEventListener(
            "click",
            confirmReservation
        );

    }

}


function confirmReservation() {

    if (!state.selectedTime) {

        showToast(
            "Selecciona un horario."
        );

        return;
    }


    const date =
        formatDateISO(
            state.selectedDate
        );


    const available =
        getAvailableTimes(
            state.selectedSpace,
            date
        );


    if (
        !available.includes(
            state.selectedTime
        )
    ) {

        showToast(
            "Ese horario ya no está disponible."
        );

        closeModal();

        return;
    }


    state.reservations.push({

        id: Date.now(),

        space:
            state.selectedSpace,

        date,

        time:
            state.selectedTime,

        status:
            "upcoming"

    });


    closeModal();


    renderReservations();

    renderCalendar();

    updateSpaceAvailability();


    showToast(
        "Reserva confirmada correctamente."
    );


    state.selectedSpace =
        null;

    state.selectedTime =
        null;

}


/* =========================================================
   MIS RESERVAS
========================================================= */

function renderReservations() {

    const container =
        document.querySelector(
            ".my-reservation"
        );


    if (!container) {
        return;
    }


    const upcoming =
        state.reservations
            .filter(
                (reservation) =>
                    reservation.status ===
                    "upcoming"
            )
            .sort(
                (a, b) => {

                    const dateComparison =
                        a.date.localeCompare(
                            b.date
                        );


                    if (
                        dateComparison !== 0
                    ) {

                        return dateComparison;

                    }


                    return (
                        convertTimeToMinutes(
                            a.time.split(" - ")[0]
                        ) -
                        convertTimeToMinutes(
                            b.time.split(" - ")[0]
                        )
                    );

                }
            );


    if (!upcoming.length) {

        container.innerHTML = `

            <div style="
                width:100%;
                box-sizing:border-box;
                padding:18px 12px;
                text-align:center;
                color:#9999a1;
                font-size:10px;
                background:#f5f5f7;
                border-radius:16px;
            ">

                <div style="
                    font-size:20px;
                    margin-bottom:7px;
                ">
                    ◉
                </div>

                <strong style="
                    display:block;
                    color:#6e6e73;
                    font-size:11px;
                    margin-bottom:3px;
                ">
                    No tienes reservas próximas
                </strong>

                <span>
                    Cuando realices una reserva,
                    aparecerá aquí.
                </span>

            </div>

        `;

        return;
    }


    container.innerHTML =
        upcoming.map(
            (reservation) => `

                <div
                    class="reservation-current"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        display:flex;
                        align-items:center;
                        gap:12px;
                        padding:13px;
                        margin-bottom:10px;
                        background:#f5f5f7;
                        border-radius:16px;
                    "
                >

                    <div
                        class="my-reservation-icon"
                        style="
                            width:38px;
                            height:38px;
                            min-width:38px;
                            border-radius:12px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            background:white;
                            font-size:15px;
                        "
                    >
                        ◉
                    </div>


                    <div
                        style="
                            flex:1;
                            min-width:0;
                        "
                    >

                        <div style="
                            display:flex;
                            align-items:center;
                            gap:7px;
                            margin-bottom:4px;
                        ">

                            <strong style="
                                display:block;
                                font-size:11px;
                                font-weight:600;
                                color:#1d1d1f;
                                white-space:nowrap;
                                overflow:hidden;
                                text-overflow:ellipsis;
                            ">
                                ${reservation.space}
                            </strong>

                        </div>


                        <span style="
                            display:block;
                            color:#6e6e73;
                            font-size:9px;
                            margin-bottom:3px;
                        ">
                            ${formatLongDateFromISO(
                                reservation.date
                            )}
                        </span>


                        <span style="
                            display:block;
                            color:#1d1d1f;
                            font-size:10px;
                            font-weight:600;
                        ">
                            ${reservation.time}
                        </span>

                    </div>


                    <div
                        style="
                            display:flex;
                            flex-direction:column;
                            align-items:flex-end;
                            justify-content:space-between;
                            gap:7px;
                            flex-shrink:0;
                        "
                    >

                        <span style="
                            display:block;
                            padding:4px 7px;
                            border-radius:7px;
                            background:#eaf7ee;
                            color:#34a853;
                            font-size:7px;
                            font-weight:700;
                            letter-spacing:.2px;
                        ">
                            CONFIRMADA
                        </span>


                        <button
                            class="reservation-detail"
                            data-id="${reservation.id}"
                            type="button"
                            aria-label="Ver detalle de ${reservation.space}"
                            style="
                                width:28px;
                                height:28px;
                                border:none;
                                border-radius:9px;
                                background:white;
                                color:#6e6e73;
                                font-size:17px;
                                line-height:1;
                                cursor:pointer;
                            "
                        >
                            ›
                        </button>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   DETALLE DE RESERVA
========================================================= */

function openReservationDetail(id) {

    const reservation =
        state.reservations.find(
            (item) =>
                item.id === id
        );


    if (!reservation) {
        return;
    }


    openModal(`

        <h2 style="
            font-size:19px;
            margin-bottom:5px;
        ">
            ${reservation.space}
        </h2>


        <p style="
            color:#6e6e73;
            font-size:10px;
            margin-bottom:20px;
        ">
            Detalle de tu reserva
        </p>


        <div style="
            background:white;
            padding:16px;
            border-radius:16px;
            margin-bottom:15px;
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:12px;
                font-size:10px;
            ">

                <span style="color:#6e6e73;">
                    Fecha
                </span>

                <strong>
                    ${formatLongDateFromISO(
                        reservation.date
                    )}
                </strong>

            </div>


            <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:12px;
                font-size:10px;
            ">

                <span style="color:#6e6e73;">
                    Horario
                </span>

                <strong>
                    ${reservation.time}
                </strong>

            </div>


            <div style="
                display:flex;
                justify-content:space-between;
                font-size:10px;
            ">

                <span style="color:#6e6e73;">
                    Estado
                </span>

                <strong style="color:#34a853;">
                    Próxima
                </strong>

            </div>

        </div>


        <button
            id="repeatCurrentReservation"
            class="primary-button"
            type="button"
        >
            Repetir reserva
        </button>


        <button
            id="cancelReservation"
            type="button"
            style="
                width:100%;
                margin-top:9px;
                padding:12px;
                border:none;
                border-radius:13px;
                background:#fff0f0;
                color:#d84b4b;
                font-size:11px;
                font-weight:600;
                cursor:pointer;
            "
        >
            Cancelar reserva
        </button>

    `);


    document
        .getElementById(
            "repeatCurrentReservation"
        )
        .addEventListener(
            "click",
            () => {

                closeModal();

                repeatReservation(
                    reservation.id
                );

            }
        );


    document
        .getElementById(
            "cancelReservation"
        )
        .addEventListener(
            "click",
            () => {

                cancelReservation(
                    reservation.id
                );

            }
        );

}


/* =========================================================
   REPETIR RESERVA
========================================================= */

function repeatReservation(id) {

    const reservation =
        state.reservations.find(
            (item) =>
                item.id === id
        ) ||
        state.reservationHistory.find(
            (item) =>
                item.id === id
        );


    if (!reservation) {
        return;
    }


    state.selectedSpace =
        reservation.space;


    state.selectedTime =
        null;


    openRepeatReservationModal(
        reservation.space
    );

}


function openRepeatReservationModal(space) {

    const date =
        formatLongDate(
            state.selectedDate
        );


    const dateISO =
        formatDateISO(
            state.selectedDate
        );


    const allTimes =
        getAllTimes(
            space
        );


    const available =
        getAvailableTimes(
            space,
            dateISO
        );


    const buttons =
        allTimes.map(
            (time) => {

                const occupied =
                    !available.includes(
                        time
                    );


                return `

                    <button
                        class="time-slot reservation-time ${
                            occupied
                                ? "occupied"
                                : ""
                        }"
                        data-time="${time}"
                        type="button"
                        ${
                            occupied
                                ? "disabled"
                                : ""
                        }
                    >

                        <span>
                            ${time}
                        </span>

                        <small>
                            ${
                                occupied
                                    ? "Ocupado"
                                    : "Disponible"
                            }
                        </small>

                    </button>

                `;

            }
        ).join("");


    openModal(`

        <div style="
            margin-bottom:16px;
        ">

            <span style="
                display:block;
                font-size:9px;
                color:#6e6e73;
                margin-bottom:5px;
            ">
                ESPACIO PREFERIDO
            </span>


            <h2 style="
                font-size:19px;
                margin:0;
            ">
                ${space}
            </h2>

        </div>


        <p style="
            color:#6e6e73;
            font-size:10px;
            margin-bottom:20px;
        ">
            Mantén tu espacio preferido y selecciona
            una nueva fecha y horario.
        </p>


        <div style="
            background:#f5f5f7;
            border-radius:14px;
            padding:12px;
            margin-bottom:16px;
        ">

            <span style="
                display:block;
                font-size:9px;
                color:#6e6e73;
                margin-bottom:4px;
            ">
                FECHA SELECCIONADA
            </span>

            <strong style="
                font-size:11px;
            ">
                ${date}
            </strong>

        </div>


        <span style="
            display:block;
            font-size:9px;
            font-weight:600;
            margin-bottom:9px;
        ">
            Nuevo horario
        </span>


        <div
            class="time-slots"
            style="
                margin-bottom:20px;
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
            "
        >

            ${buttons}

        </div>


        <button
            id="confirmRepeatReservation"
            class="primary-button"
            type="button"
        >
            Confirmar nueva reserva
        </button>

    `);


    document
        .querySelectorAll(
            ".reservation-time:not(:disabled)"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".reservation-time"
                            )
                            .forEach(
                                (item) =>
                                    item.classList.remove(
                                        "selected"
                                    )
                            );


                        button.classList.add(
                            "selected"
                        );


                        state.selectedTime =
                            button.dataset.time;

                    }
                );

            }
        );


    const confirm =
        document.getElementById(
            "confirmRepeatReservation"
        );


    if (confirm) {

        confirm.addEventListener(
            "click",
            confirmRepeatedReservation
        );

    }

}


function confirmRepeatedReservation() {

    if (!state.selectedTime) {

        showToast(
            "Selecciona un nuevo horario."
        );

        return;
    }


    const date =
        formatDateISO(
            state.selectedDate
        );


    const available =
        getAvailableTimes(
            state.selectedSpace,
            date
        );


    if (
        !available.includes(
            state.selectedTime
        )
    ) {

        showToast(
            "Ese horario ya no está disponible."
        );

        return;
    }


    state.reservations.push({

        id: Date.now(),

        space:
            state.selectedSpace,

        date,

        time:
            state.selectedTime,

        status:
            "upcoming"

    });


    closeModal();


    renderReservations();

    renderCalendar();

    updateSpaceAvailability();


    showToast(
        "Reserva repetida correctamente."
    );


    state.selectedSpace =
        null;

    state.selectedTime =
        null;

}


/* =========================================================
   CANCELAR RESERVA
========================================================= */

function cancelReservation(id) {

    const reservation =
        state.reservations.find(
            (item) =>
                item.id === id
        );


    if (!reservation) {
        return;
    }


    reservation.status =
        "cancelled";


    state.reservationHistory.unshift({

        id: Date.now(),

        space:
            reservation.space,

        date:
            reservation.date,

        time:
            reservation.time,

        status:
            "cancelled"

    });


    state.reservations =
        state.reservations.filter(
            (item) =>
                item.id !== id
        );


    closeModal();


    renderReservations();

    renderReservationHistory();

    renderCalendar();

    updateSpaceAvailability();


    showToast(
        "Reserva cancelada."
    );

}


/* =========================================================
   HISTORIAL
========================================================= */

function renderReservationHistory() {

    const container =
        document.getElementById(
            "reservationHistory"
        );


    if (!container) {
        return;
    }


    if (
        !state.reservationHistory.length
    ) {

        container.innerHTML = `

            <div style="
                padding:16px;
                text-align:center;
                color:#9999a1;
                font-size:10px;
            ">
                No tienes historial de reservas.
            </div>

        `;

        return;
    }


    container.innerHTML =
        state.reservationHistory
            .map(
                (reservation) => {

                    const status =
                        getReservationStatus(
                            reservation.status
                        );


                    return `

                        <div
                            class="reservation-history-item"
                            style="
                                display:flex;
                                align-items:center;
                                gap:11px;
                                padding:12px 0;
                                border-bottom:1px solid rgba(0,0,0,.06);
                            "
                        >

                            <div
                                style="
                                    width:36px;
                                    height:36px;
                                    border-radius:12px;
                                    background:#f5f5f7;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:15px;
                                    flex-shrink:0;
                                "
                            >
                                ◉
                            </div>


                            <div
                                style="
                                    flex:1;
                                    min-width:0;
                                "
                            >

                                <strong style="
                                    display:block;
                                    font-size:11px;
                                    margin-bottom:3px;
                                ">
                                    ${reservation.space}
                                </strong>


                                <span style="
                                    display:block;
                                    color:#6e6e73;
                                    font-size:9px;
                                    margin-bottom:2px;
                                ">
                                    ${formatLongDateFromISO(
                                        reservation.date
                                    )}
                                </span>


                                <span style="
                                    display:block;
                                    color:#6e6e73;
                                    font-size:9px;
                                ">
                                    ${reservation.time}
                                </span>

                            </div>


                            <div
                                style="
                                    text-align:right;
                                "
                            >

                                <span style="
                                    display:block;
                                    font-size:8px;
                                    font-weight:600;
                                    color:${status.color};
                                    margin-bottom:7px;
                                ">
                                    ${status.label}
                                </span>


                                <button
                                    class="repeat-reservation"
                                    data-id="${reservation.id}"
                                    type="button"
                                    style="
                                        border:none;
                                        background:none;
                                        color:#007aff;
                                        font-size:9px;
                                        font-weight:600;
                                        cursor:pointer;
                                    "
                                >
                                    Repetir
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


function getReservationStatus(status) {

    if (
        status ===
        "cancelled"
    ) {

        return {
            label: "CANCELADA",
            color: "#d84b4b"
        };

    }


    return {

        label: "COMPLETADA",

        color: "#6e6e73"

    };

}


/* =========================================================
   COMUNIDAD
========================================================= */

function setupCommunity() {

    const filters =
        document.querySelectorAll(
            ".segment"
        );


    filters.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    state.selectedFilter =
                        button.dataset.filter;


                    filters.forEach(
                        (item) =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    renderPosts();

                }
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            const like =
                event.target.closest(
                    ".like-button"
                );

            if (like) {

                handleLike(
                    like
                );

                return;
            }


            const comment =
                event.target.closest(
                    ".comment-button"
                );

            if (comment) {

                handleComment(
                    comment
                );

                return;
            }


            const share =
                event.target.closest(
                    ".share-button"
                );

            if (share) {

                handleShare(
                    share
                );

                return;
            }


            const editPostButton =
                event.target.closest(
                    ".edit-post-button"
                );

            if (editPostButton) {

                editPost(
                    Number(
                        editPostButton.dataset.id
                    )
                );

                return;
            }


            const deletePostButton =
                event.target.closest(
                    ".delete-post-button"
                );

            if (deletePostButton) {

                deletePost(
                    Number(
                        deletePostButton.dataset.id
                    )
                );

                return;
            }


            const addCommentButton =
                event.target.closest(
                    ".submit-comment-button"
                );

            if (addCommentButton) {

                submitComment(
                    Number(
                        addCommentButton.dataset.postId
                    )
                );

                return;
            }


            const editCommentButton =
                event.target.closest(
                    ".edit-comment-button"
                );

            if (editCommentButton) {

                editComment(
                    Number(
                        editCommentButton.dataset.postId
                    ),
                    Number(
                        editCommentButton.dataset.commentId
                    )
                );

                return;
            }


            const deleteCommentButton =
                event.target.closest(
                    ".delete-comment-button"
                );

            if (deleteCommentButton) {

                deleteComment(
                    Number(
                        deleteCommentButton.dataset.postId
                    ),
                    Number(
                        deleteCommentButton.dataset.commentId
                    )
                );

            }

        }
    );


    const create =
        document.getElementById(
            "createPostButton"
        );


    if (create) {

        create.addEventListener(
            "click",
            openCreatePostModal
        );

    }

}


/* =========================================================
   RENDER PUBLICACIONES
========================================================= */

function renderPosts() {

    const container =
        document.querySelector(
            ".community-posts"
        );


    if (!container) {
        return;
    }


    const posts =
        state.posts.filter(
            (post) =>
                state.selectedFilter ===
                    "all" ||
                post.category ===
                    state.selectedFilter
        );


    container.innerHTML = "";


    if (!posts.length) {

        container.innerHTML = `

            <div style="
                padding:25px 15px;
                text-align:center;
                color:#8e8e93;
                font-size:10px;
            ">
                No hay publicaciones en esta categoría.
            </div>

        `;

        return;
    }


    posts.forEach(
        (post) => {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "community-post";


            article.dataset.postId =
                post.id;


            const commentsCount =
                Array.isArray(
                    post.commentsList
                )
                    ? post.commentsList.length
                    : Number(
                        post.comments || 0
                    );


            let avatarClass =
                "post-avatar";


            if (
                post.category ===
                "admin"
            ) {

                avatarClass +=
                    " admin-avatar";

            }


            if (
                post.category ===
                "event"
            ) {

                avatarClass +=
                    " green-avatar";

            }


            const ownActions =
                post.own === true
                    ? `

                        <div style="
                            display:flex;
                            gap:6px;
                            margin-left:auto;
                        ">

                            <button
                                class="edit-post-button"
                                data-id="${post.id}"
                                type="button"
                                style="
                                    border:none;
                                    background:#f2f2f7;
                                    color:#007aff;
                                    border-radius:8px;
                                    padding:5px 8px;
                                    font-size:8px;
                                    font-weight:600;
                                    cursor:pointer;
                                "
                            >
                                Editar
                            </button>

                            <button
                                class="delete-post-button"
                                data-id="${post.id}"
                                type="button"
                                style="
                                    border:none;
                                    background:#fff0f0;
                                    color:#d84b4b;
                                    border-radius:8px;
                                    padding:5px 8px;
                                    font-size:8px;
                                    font-weight:600;
                                    cursor:pointer;
                                "
                            >
                                Eliminar
                            </button>

                        </div>

                    `
                    : "";


            article.innerHTML = `

                <div class="post-header">

                    <div class="${avatarClass}">
                        ${escapeHTML(post.avatar)}
                    </div>

                    <div style="
                        min-width:0;
                    ">

                        <strong>
                            ${escapeHTML(post.author)}
                        </strong>

                        <span>
                            ${post.own ? "Tú" : "Hace poco"}
                        </span>

                    </div>

                    ${ownActions}

                </div>


                <span class="
                    post-category
                    ${post.category}
                ">
                    ${escapeHTML(post.categoryName)}
                </span>


                <h2>
                    ${escapeHTML(post.title)}
                </h2>


                <p>
                    ${escapeHTML(post.text)}
                </p>


                <div class="post-actions">

                    <button
                        class="
                            like-button
                            ${post.liked ? "liked" : ""}
                        "
                        type="button"
                    >
                        ${post.liked ? "♥" : "♡"} ${post.likes}
                    </button>

                    <button
                        class="comment-button"
                        type="button"
                    >
                        ◯ ${commentsCount}
                    </button>

                    <button
                        class="share-button"
                        type="button"
                    >
                        Compartir
                    </button>

                </div>

            `;


            container.appendChild(
                article
            );

        }
    );

}


/* =========================================================
   LIKES
========================================================= */

function handleLike(button) {

    const postElement =
        button.closest(
            ".community-post"
        );


    if (!postElement) {
        return;
    }


    const post =
        state.posts.find(
            (item) =>
                item.id ===
                Number(
                    postElement.dataset.postId
                )
        );


    if (!post) {
        return;
    }


    post.liked =
        !post.liked;


    post.likes +=
        post.liked
            ? 1
            : -1;


    renderPosts();

}


/* =========================================================
   COMENTARIOS
========================================================= */

function handleComment(button) {

    const postElement =
        button.closest(
            ".community-post"
        );


    if (!postElement) {
        return;
    }


    const postId =
        Number(
            postElement.dataset.postId
        );


    openCommentsModal(
        postId
    );

}


function openCommentsModal(postId) {

    const post =
        state.posts.find(
            (item) =>
                item.id === postId
        );


    if (!post) {
        return;
    }


    if (
        !Array.isArray(
            post.commentsList
        )
    ) {

        post.commentsList = [];

    }


    const commentsHTML =
        post.commentsList.length
            ? post.commentsList
                .map(
                    (comment) => {

                        const ownActions =
                            comment.own === true
                                ? `

                                    <div style="
                                        display:flex;
                                        gap:8px;
                                        margin-top:7px;
                                    ">

                                        <button
                                            class="edit-comment-button"
                                            data-post-id="${post.id}"
                                            data-comment-id="${comment.id}"
                                            type="button"
                                            style="
                                                border:none;
                                                background:none;
                                                color:#007aff;
                                                padding:0;
                                                font-size:8px;
                                                font-weight:600;
                                                cursor:pointer;
                                            "
                                        >
                                            Editar
                                        </button>

                                        <button
                                            class="delete-comment-button"
                                            data-post-id="${post.id}"
                                            data-comment-id="${comment.id}"
                                            type="button"
                                            style="
                                                border:none;
                                                background:none;
                                                color:#d84b4b;
                                                padding:0;
                                                font-size:8px;
                                                font-weight:600;
                                                cursor:pointer;
                                            "
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                `
                                : "";


                        return `

                            <div style="
                                display:flex;
                                gap:9px;
                                padding:12px 0;
                                border-bottom:1px solid rgba(0,0,0,.06);
                            ">

                                <div style="
                                    width:30px;
                                    height:30px;
                                    min-width:30px;
                                    border-radius:50%;
                                    background:#f0f0f3;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:8px;
                                    font-weight:700;
                                    color:#6e6e73;
                                ">
                                    ${escapeHTML(comment.avatar)}
                                </div>


                                <div style="
                                    flex:1;
                                    min-width:0;
                                ">

                                    <div style="
                                        display:flex;
                                        align-items:center;
                                        gap:5px;
                                        margin-bottom:3px;
                                    ">

                                        <strong style="
                                            font-size:9px;
                                            color:#1d1d1f;
                                        ">
                                            ${escapeHTML(comment.author)}
                                        </strong>

                                        ${
                                            comment.own
                                                ? `
                                                    <span style="
                                                        font-size:7px;
                                                        color:#007aff;
                                                        font-weight:600;
                                                    ">
                                                        TÚ
                                                    </span>
                                                `
                                                : ""
                                        }

                                    </div>


                                    <p style="
                                        margin:0;
                                        font-size:9px;
                                        line-height:1.5;
                                        color:#4a4a4f;
                                    ">
                                        ${escapeHTML(comment.text)}
                                    </p>


                                    ${ownActions}

                                </div>

                            </div>

                        `;

                    }
                )
                .join("")
            : `

                <div style="
                    padding:20px 10px;
                    text-align:center;
                    color:#8e8e93;
                    font-size:10px;
                ">
                    Todavía no hay comentarios.
                </div>

            `;


    openModal(`

        <div style="
            margin-bottom:17px;
        ">

            <span style="
                display:block;
                color:#6e6e73;
                font-size:8px;
                font-weight:600;
                margin-bottom:5px;
            ">
                COMENTARIOS
            </span>

            <h2 style="
                font-size:18px;
                margin:0;
            ">
                ${escapeHTML(post.title)}
            </h2>

        </div>


        <div style="
            max-height:260px;
            overflow-y:auto;
            margin-bottom:15px;
            padding-right:2px;
        ">

            ${commentsHTML}

        </div>


        <div style="
            display:flex;
            gap:7px;
            align-items:flex-end;
        ">

            <textarea
                id="newCommentText"
                rows="2"
                placeholder="Escribe un comentario..."
                style="
                    flex:1;
                    width:100%;
                    box-sizing:border-box;
                    padding:10px;
                    border:1px solid rgba(0,0,0,.08);
                    border-radius:12px;
                    background:#f8f8fa;
                    resize:none;
                    outline:none;
                    font-family:inherit;
                    font-size:9px;
                "
            ></textarea>


            <button
                class="submit-comment-button"
                data-post-id="${post.id}"
                type="button"
                style="
                    width:38px;
                    height:38px;
                    border:none;
                    border-radius:11px;
                    background:#007aff;
                    color:white;
                    font-size:14px;
                    cursor:pointer;
                    flex-shrink:0;
                "
                aria-label="Enviar comentario"
            >
                ↑
            </button>

        </div>

    `);

}


/* =========================================================
   AGREGAR COMENTARIO
========================================================= */

function submitComment(postId) {

    const input =
        document.getElementById(
            "newCommentText"
        );


    if (!input) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {

        showToast(
            "Escribe un comentario."
        );

        return;
    }


    const post =
        state.posts.find(
            (item) =>
                item.id === postId
        );


    if (!post) {
        return;
    }


    if (
        !Array.isArray(
            post.commentsList
        )
    ) {

        post.commentsList = [];

    }


    post.commentsList.push({

        id: Date.now(),

        author:
            "Diego Flores",

        avatar:
            "DF",

        text,

        own:
            true

    });


    openCommentsModal(
        postId
    );


    renderPosts();


    showToast(
        "Comentario publicado."
    );

}


/* =========================================================
   EDITAR COMENTARIO
========================================================= */

function editComment(
    postId,
    commentId
) {

    const post =
        state.posts.find(
            (item) =>
                item.id === postId
        );


    if (!post) {
        return;
    }


    const comment =
        post.commentsList.find(
            (item) =>
                item.id === commentId
        );


    if (
        !comment ||
        comment.own !== true
    ) {
        return;
    }


    openModal(`

        <h2 style="
            font-size:19px;
            margin-bottom:6px;
        ">
            Editar comentario
        </h2>


        <p style="
            color:#6e6e73;
            font-size:10px;
            margin-bottom:17px;
        ">
            Modifica el contenido de tu comentario.
        </p>


        <textarea
            id="editCommentText"
            rows="4"
            style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                resize:none;
                outline:none;
                font-family:inherit;
                font-size:10px;
                margin-bottom:15px;
            "
        >${escapeHTML(comment.text)}</textarea>


        <button
            id="saveEditedComment"
            class="primary-button"
            type="button"
        >
            Guardar cambios
        </button>

    `);


    document
        .getElementById(
            "saveEditedComment"
        )
        .addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "editCommentText"
                    );


                const newText =
                    input.value.trim();


                if (!newText) {

                    showToast(
                        "El comentario no puede estar vacío."
                    );

                    return;
                }


                comment.text =
                    newText;


                closeModal();

                renderPosts();

                openCommentsModal(
                    postId
                );


                showToast(
                    "Comentario actualizado."
                );

            }
        );

}


/* =========================================================
   ELIMINAR COMENTARIO
========================================================= */

function deleteComment(
    postId,
    commentId
) {

    const post =
        state.posts.find(
            (item) =>
                item.id === postId
        );


    if (!post) {
        return;
    }


    const comment =
        post.commentsList.find(
            (item) =>
                item.id === commentId
        );


    if (
        !comment ||
        comment.own !== true
    ) {
        return;
    }


    const confirmed =
        window.confirm(
            "¿Quieres eliminar este comentario?"
        );


    if (!confirmed) {
        return;
    }


    post.commentsList =
        post.commentsList.filter(
            (item) =>
                item.id !== commentId
        );


    renderPosts();

    openCommentsModal(
        postId
    );


    showToast(
        "Comentario eliminado."
    );

}


/* =========================================================
   COMPARTIR
========================================================= */

async function handleShare(button) {

    const postElement =
        button.closest(
            ".community-post"
        );


    if (!postElement) {
        return;
    }


    const post =
        state.posts.find(
            (item) =>
                item.id ===
                Number(
                    postElement.dataset.postId
                )
        );


    if (!post) {
        return;
    }


    if (
        navigator.clipboard
    ) {

        try {

            await navigator.clipboard.writeText(
                `${post.title}\n\n${post.text}`
            );

            showToast(
                "Publicación copiada para compartir."
            );

            return;

        } catch (error) {

            // Continúa con el mensaje normal.

        }

    }


    showToast(
        "Publicación lista para compartir."
    );

}


/* =========================================================
   CREAR PUBLICACIÓN
========================================================= */

function openCreatePostModal() {

    openModal(`

        <h2 style="
            font-size:19px;
            margin-bottom:6px;
        ">
            Nueva publicación
        </h2>

        <p style="
            color:#6e6e73;
            font-size:10px;
            margin-bottom:20px;
        ">
            Comparte algo con tu comunidad.
        </p>


        <select
            id="newPostCategory"
            style="
                width:100%;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                margin-bottom:14px;
                outline:none;
            "
        >

            <option value="community">
                Comunidad
            </option>

            <option value="event">
                Evento
            </option>

            <option value="admin">
                Aviso
            </option>

        </select>


        <input
            id="newPostTitle"
            type="text"
            placeholder="Título"
            style="
                width:100%;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                margin-bottom:14px;
                outline:none;
                box-sizing:border-box;
            "
        >


        <textarea
            id="newPostDescription"
            rows="4"
            placeholder="Escribe tu publicación..."
            style="
                width:100%;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                resize:none;
                margin-bottom:17px;
                outline:none;
                box-sizing:border-box;
                font-family:inherit;
            "
        ></textarea>


        <button
            id="submitNewPost"
            class="primary-button"
            type="button"
        >
            Publicar
        </button>

    `);


    document
        .getElementById(
            "submitNewPost"
        )
        .addEventListener(
            "click",
            () => {

                const title =
                    document
                        .getElementById(
                            "newPostTitle"
                        )
                        .value
                        .trim();


                const description =
                    document
                        .getElementById(
                            "newPostDescription"
                        )
                        .value
                        .trim();


                if (
                    !title ||
                    !description
                ) {

                    showToast(
                        "Completa todos los campos."
                    );

                    return;
                }


                const category =
                    document
                        .getElementById(
                            "newPostCategory"
                        )
                        .value;


                const names = {

                    community:
                        "COMUNIDAD",

                    event:
                        "EVENTO",

                    admin:
                        "AVISO"

                };


                state.posts.unshift({

                    id: Date.now(),

                    author:
                        "Diego Flores",

                    avatar:
                        "DF",

                    title,

                    text:
                        description,

                    category,

                    categoryName:
                        names[category],

                    likes: 0,

                    liked: false,

                    own: true,

                    commentsList: []

                });


                closeModal();

                renderPosts();

                showToast(
                    "Publicación creada."
                );

            }
        );

}


/* =========================================================
   EDITAR PUBLICACIÓN
========================================================= */

function editPost(id) {

    const post =
        state.posts.find(
            (item) =>
                item.id === id
        );


    if (
        !post ||
        post.own !== true
    ) {
        return;
    }


    openModal(`

        <h2 style="
            font-size:19px;
            margin-bottom:6px;
        ">
            Editar publicación
        </h2>


        <p style="
            color:#6e6e73;
            font-size:10px;
            margin-bottom:20px;
        ">
            Modifica la información de tu publicación.
        </p>


        <select
            id="editPostCategory"
            style="
                width:100%;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                margin-bottom:14px;
                outline:none;
            "
        >

            <option
                value="community"
                ${post.category === "community" ? "selected" : ""}
            >
                Comunidad
            </option>

            <option
                value="event"
                ${post.category === "event" ? "selected" : ""}
            >
                Evento
            </option>

            <option
                value="admin"
                ${post.category === "admin" ? "selected" : ""}
            >
                Aviso
            </option>

        </select>


        <input
            id="editPostTitle"
            type="text"
            value="${escapeAttribute(post.title)}"
            placeholder="Título"
            style="
                width:100%;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                margin-bottom:14px;
                outline:none;
                box-sizing:border-box;
            "
        >


        <textarea
            id="editPostDescription"
            rows="4"
            placeholder="Escribe tu publicación..."
            style="
                width:100%;
                padding:12px;
                border:1px solid rgba(0,0,0,.08);
                border-radius:12px;
                background:white;
                resize:none;
                margin-bottom:17px;
                outline:none;
                box-sizing:border-box;
                font-family:inherit;
            "
        >${escapeHTML(post.text)}</textarea>


        <button
            id="saveEditedPost"
            class="primary-button"
            type="button"
        >
            Guardar cambios
        </button>

    `);


    document
        .getElementById(
            "saveEditedPost"
        )
        .addEventListener(
            "click",
            () => {

                const title =
                    document
                        .getElementById(
                            "editPostTitle"
                        )
                        .value
                        .trim();


                const text =
                    document
                        .getElementById(
                            "editPostDescription"
                        )
                        .value
                        .trim();


                const category =
                    document
                        .getElementById(
                            "editPostCategory"
                        )
                        .value;


                if (
                    !title ||
                    !text
                ) {

                    showToast(
                        "Completa todos los campos."
                    );

                    return;
                }


                const names = {

                    community:
                        "COMUNIDAD",

                    event:
                        "EVENTO",

                    admin:
                        "AVISO"

                };


                post.title =
                    title;


                post.text =
                    text;


                post.category =
                    category;


                post.categoryName =
                    names[category];


                closeModal();

                renderPosts();


                showToast(
                    "Publicación actualizada."
                );

            }
        );

}


/* =========================================================
   ELIMINAR PUBLICACIÓN
========================================================= */

function deletePost(id) {

    const post =
        state.posts.find(
            (item) =>
                item.id === id
        );


    if (
        !post ||
        post.own !== true
    ) {
        return;
    }


    const confirmed =
        window.confirm(
            "¿Quieres eliminar esta publicación?"
        );


    if (!confirmed) {
        return;
    }


    state.posts =
        state.posts.filter(
            (item) =>
                item.id !== id
        );


    renderPosts();


    showToast(
        "Publicación eliminada."
    );

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function setupNotifications() {

    const markAll =
        document.getElementById(
            "markAllRead"
        );


    if (markAll) {

        markAll.addEventListener(
            "click",
            () => {

                state.notifications
                    .forEach(
                        (item) =>
                            item.unread =
                                false
                    );


                renderNotifications();

                showToast(
                    "Todas las notificaciones fueron leídas."
                );

            }
        );

    }


    document.addEventListener(
        "click",
        (event) => {

            const notification =
                event.target.closest(
                    ".notification"
                );


            if (
                notification &&
                !event.target.closest(
                    ".delete-notification"
                )
            ) {

                const id =
                    Number(
                        notification.dataset.id
                    );


                const item =
                    state.notifications.find(
                        (notification) =>
                            notification.id ===
                            id
                    );


                if (item) {

                    item.unread =
                        false;

                    renderNotifications();

                }

            }


            const deleteButton =
                event.target.closest(
                    ".delete-notification"
                );


            if (deleteButton) {

                const element =
                    deleteButton.closest(
                        ".notification"
                    );


                const id =
                    Number(
                        element.dataset.id
                    );


                state.notifications =
                    state.notifications.filter(
                        (item) =>
                            item.id !== id
                    );


                renderNotifications();

                showToast(
                    "Notificación eliminada."
                );

            }

        }
    );

}


function renderNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    state.notifications.forEach(
        (item) => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                `notification ${
                    item.unread
                        ? "unread"
                        : ""
                }`;


            element.dataset.id =
                item.id;


            element.innerHTML = `

                <div class="
                    notification-icon
                    ${item.type}
                ">
                    ${getNotificationIcon(
                        item.type
                    )}
                </div>


                <div class="
                    notification-content
                ">

                    <strong>
                        ${item.title}
                    </strong>

                    <p>
                        ${item.text}
                    </p>

                    <small>
                        ${item.time}
                    </small>

                </div>


                <button
                    class="delete-notification"
                    type="button"
                >
                    ×
                </button>

            `;


            container.appendChild(
                element
            );

        }
    );


    updateNotificationBadge();

}


function getNotificationIcon(type) {

    const icons = {

        success: "✓",

        blue: "●",

        purple: "◈",

        warning: "!"

    };


    return icons[type] || "•";

}


function updateNotificationBadge() {

    const unread =
        state.notifications.filter(
            (item) =>
                item.unread
        ).length;


    if (!notificationBadge) {
        return;
    }


    notificationBadge.textContent =
        unread;


    notificationBadge.style.display =
        unread > 0
            ? "flex"
            : "none";

}


/* =========================================================
   PAGOS
========================================================= */

function setupPayments() {

    const button =
        document.getElementById(
            "payCommonExpenses"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            openModal(`

                <h2 style="
                    font-size:19px;
                    margin-bottom:7px;
                ">
                    Pagar gastos comunes
                </h2>

                <p style="
                    color:#6e6e73;
                    font-size:10px;
                    line-height:1.5;
                    margin-bottom:20px;
                ">
                    Esta es una simulación de pago
                    para el prototipo de HabitApp.
                </p>


                <div style="
                    background:white;
                    padding:17px;
                    border-radius:16px;
                    margin-bottom:15px;
                ">

                    <span style="
                        display:block;
                        color:#6e6e73;
                        font-size:9px;
                    ">
                        Total a pagar
                    </span>

                    <strong style="
                        display:block;
                        margin-top:5px;
                        font-size:25px;
                    ">
                        $84.500
                    </strong>

                </div>


                <button
                    id="simulatePayment"
                    class="primary-button"
                    type="button"
                >
                    Confirmar pago
                </button>

            `);


            document
                .getElementById(
                    "simulatePayment"
                )
                .addEventListener(
                    "click",
                    () => {

                        closeModal();

                        showToast(
                            "Pago realizado correctamente."
                        );

                    }
                );

        }
    );

}


/* =========================================================
   MULTAS
========================================================= */

function setupFines() {

    const button =
        document.getElementById(
            "payFine"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            openModal(`

                <h2 style="
                    font-size:19px;
                    margin-bottom:7px;
                ">
                    Pagar multa
                </h2>

                <p style="
                    color:#6e6e73;
                    font-size:10px;
                    line-height:1.5;
                    margin-bottom:20px;
                ">
                    Se registrará el pago de la multa
                    asociada a tu cuenta.
                </p>


                <div style="
                    background:#fff3e8;
                    padding:17px;
                    border-radius:16px;
                    margin-bottom:15px;
                ">

                    <span style="
                        display:block;
                        color:#92765c;
                        font-size:9px;
                    ">
                        Monto
                    </span>

                    <strong style="
                        display:block;
                        margin-top:5px;
                        font-size:25px;
                    ">
                        $15.000
                    </strong>

                </div>


                <button
                    id="simulateFinePayment"
                    class="primary-button"
                    type="button"
                >
                    Confirmar pago
                </button>

            `);


            document
                .getElementById(
                    "simulateFinePayment"
                )
                .addEventListener(
                    "click",
                    () => {

                        closeModal();

                        showToast(
                            "Multa pagada correctamente."
                        );

                    }
                );

        }
    );

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    modalOverlay
                ) {

                    closeModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modalOverlay &&
                modalOverlay.classList.contains(
                    "open"
                )
            ) {

                closeModal();

            }

        }
    );

}


function openModal(content) {

    if (
        !modalOverlay ||
        !modalContent
    ) {
        return;
    }


    modalContent.innerHTML =
        content;


    modalOverlay.classList.add(
        "open"
    );

}


function closeModal() {

    if (!modalOverlay) {
        return;
    }


    modalOverlay.classList.remove(
        "open"
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout = null;


function showToast(message) {

    if (
        !toast ||
        !toastMessage
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   SEGURIDAD DE TEXTO
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   FECHAS
========================================================= */

function addDays(
    date,
    days
) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;

}


function formatDateISO(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


function formatLongDate(date) {

    const weekdays = [

        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"

    ];


    const months = [

        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"

    ];


    return `
        ${weekdays[date.getDay()]}
        ${date.getDate()}
        de
        ${months[date.getMonth()]}
    `.replace(
        /\s+/g,
        " "
    ).trim();

}


function formatLongDateFromISO(
    iso
) {

    const parts =
        iso.split("-");


    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    return formatLongDate(
        date
    );

}


function getWeekday(date) {

    const days = [

        "DOM",
        "LUN",
        "MAR",
        "MIÉ",
        "JUE",
        "VIE",
        "SÁB"

    ];


    return days[
        date.getDay()
    ];

}


function isSameDate(
    a,
    b
) {

    return (
        a.getFullYear() ===
            b.getFullYear() &&

        a.getMonth() ===
            b.getMonth() &&

        a.getDate() ===
            b.getDate()
    );

}


function isToday(date) {

    const today =
        new Date();

    return isSameDate(
        date,
        today
    );

}


function hasReservationOnDate(
    date
) {

    return state.reservations.some(
        (reservation) =>
            reservation.date === date
    );

}


function expandReservationTimes(
    reservationTime
) {

    if (!reservationTime) {
        return [];
    }


    const parts =
        reservationTime.split(" - ");


    if (parts.length !== 2) {
        return [reservationTime];
    }


    const start =
        convertTimeToMinutes(
            parts[0]
        );


    const end =
        convertTimeToMinutes(
            parts[1]
        );


    const result = [];


    for (
        let time = start;
        time < end;
        time += 60
    ) {

        const next =
            time + 60;


        result.push(
            `${formatMinutesAsTime(time)} - ${formatMinutesAsTime(next)}`
        );

    }


    return result;

}


function convertTimeToMinutes(time) {

    const parts =
        time.split(":");


    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


function formatMinutesAsTime(minutes) {

    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return `
        ${String(hours).padStart(2, "0")}:
        ${String(mins).padStart(2, "0")}
    `.replace(
        /\s+/g,
        ""
    );

}


/* =========================================================
   EXPORTAR PARA DEBUG
========================================================= */

window.showToast =
    showToast;

window.closeModal =
    closeModal;