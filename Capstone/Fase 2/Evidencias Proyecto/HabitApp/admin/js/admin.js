/* =========================================================
   HABITAPP — ADMIN
   admin/js/admin.js
   ========================================================= */

const STORAGE_KEY = "habitapp_admin_data";

const adminState = {
    currentScreen: "dashboard",
    sidebarOpen: false,
    calendarDate: new Date(2026, 8, 27)
};


/* =========================================================
   DATOS INICIALES
========================================================= */

const defaultData = {
    residents: [
        {
            id: 1,
            name: "Diego Flores",
            apartment: "302",
            email: "diego.flores@email.com",
            phone: "+56 9 1234 5678",
            status: "Activo",
            payment: "Pagado"
        },
        {
            id: 2,
            name: "Catalina Rojas",
            apartment: "504",
            email: "catalina.rojas@email.com",
            phone: "+56 9 2345 6789",
            status: "Activo",
            payment: "Pendiente"
        },
        {
            id: 3,
            name: "Felipe Morales",
            apartment: "201",
            email: "felipe.morales@email.com",
            phone: "+56 9 3456 7890",
            status: "Activo",
            payment: "Pagado"
        }
    ],

    payments: [
        {
            id: 1,
            resident: "Diego Flores",
            apartment: "302",
            amount: 84500,
            date: "2026-09-05",
            status: "Pagado"
        },
        {
            id: 2,
            resident: "Catalina Rojas",
            apartment: "504",
            amount: 84500,
            date: "2026-09-07",
            status: "Pendiente"
        }
    ],

    fines: [
        {
            id: 1,
            resident: "Catalina Rojas",
            apartment: "504",
            reason: "Uso indebido de estacionamiento",
            amount: 15000,
            date: "2026-09-18",
            status: "Pendiente"
        }
    ],

    reservations: [
        {
            id: 1,
            resident: "Diego Flores",
            apartment: "302",
            space: "Quincho 2",
            date: "2026-09-27",
            start: "18:00",
            end: "21:00",
            status: "Confirmada"
        },
        {
            id: 2,
            resident: "Catalina Rojas",
            apartment: "504",
            space: "Cancha",
            date: "2026-09-27",
            start: "16:00",
            end: "17:00",
            status: "Confirmada"
        }
    ],

    posts: [
        {
            id: 1,
            author: "Administración",
            title: "Corte de agua programado",
            content: "Se informa a los residentes que habrá un corte de agua programado.",
            date: "2026-09-26"
        },
        {
            id: 2,
            author: "Catalina Rojas",
            title: "Venta de entradas",
            content: "Venta de entradas para concierto.",
            date: "2026-09-25"
        }
    ],

    notices: [
        {
            id: 1,
            title: "Corte de agua programado",
            content: "El próximo martes se realizará un corte de agua.",
            date: "2026-09-26",
            status: "Publicado"
        }
    ],

    settings: {
        communityName: "Condominio HabitApp",
        address: "Av. Principal 1234",
        administrator: "Administración HabitApp",
        email: "administracion@habitapp.cl"
    }
};


/* =========================================================
   CARGA / GUARDADO
========================================================= */

let data = loadData();


function loadData() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return structuredClone(defaultData);
        }

        const parsed = JSON.parse(saved);

        return {
            ...structuredClone(defaultData),
            ...parsed,

            residents:
                parsed.residents ||
                structuredClone(defaultData.residents),

            payments:
                parsed.payments ||
                structuredClone(defaultData.payments),

            fines:
                parsed.fines ||
                structuredClone(defaultData.fines),

            reservations:
                parsed.reservations ||
                structuredClone(defaultData.reservations),

            posts:
                parsed.posts ||
                structuredClone(defaultData.posts),

            notices:
                parsed.notices ||
                structuredClone(defaultData.notices),

            settings:
                parsed.settings ||
                structuredClone(defaultData.settings)
        };

    } catch (error) {

        console.warn(
            "No se pudieron cargar los datos.",
            error
        );

        return structuredClone(defaultData);
    }
}


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();
    setupMobileMenu();
    setupTopbar();
    setupGlobalSearch();

    interceptButtons();

    refreshInterface();

    showScreen("dashboard");

});


/* =========================================================
   NAVEGACIÓN
========================================================= */

function setupNavigation() {

    document.querySelectorAll(
        ".menu-item[data-screen]"
    ).forEach(item => {

        item.addEventListener("click", () => {

            showScreen(item.dataset.screen);

        });

    });


    document.querySelectorAll(
        "[data-screen-link]"
    ).forEach(item => {

        item.addEventListener("click", () => {

            showScreen(item.dataset.screenLink);

        });

    });

}


function showScreen(screenName) {

    const screens =
        document.querySelectorAll(".screen");

    const target =
        document.getElementById(
            `screen-${screenName}`
        );

    if (!target) {
        return;
    }


    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    target.classList.add("active");


    document
        .querySelectorAll(".menu-item[data-screen]")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.screen === screenName
            );

        });


    adminState.currentScreen = screenName;

    closeMobileSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById("mobileMenuButton");

    const sidebar =
        document.querySelector(".sidebar");


    if (!button || !sidebar) {
        return;
    }


    button.addEventListener("click", event => {

        event.stopPropagation();

        sidebar.classList.toggle("mobile-open");

        adminState.sidebarOpen =
            sidebar.classList.contains("mobile-open");

    });


    document.addEventListener("click", event => {

        if (window.innerWidth > 900) {
            return;
        }

        if (!adminState.sidebarOpen) {
            return;
        }

        if (
            !sidebar.contains(event.target) &&
            !button.contains(event.target)
        ) {
            closeMobileSidebar();
        }

    });

}


function closeMobileSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.classList.remove("mobile-open");

    adminState.sidebarOpen = false;

}


/* =========================================================
   TOPBAR
========================================================= */

function setupTopbar() {

    const notificationButton =
        document.getElementById("notificationButton");

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Tienes 3 notificaciones nuevas."
                );

            }
        );

    }


    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmLogout =
                    confirm(
                        "¿Quieres cerrar la sesión administrativa?"
                    );

                if (confirmLogout) {

                    showToast(
                        "Sesión cerrada correctamente."
                    );

                }

            }
        );

    }


    const quickActionButton =
        document.getElementById("quickActionButton");

    if (quickActionButton) {

        quickActionButton.addEventListener(
            "click",
            openQuickActions
        );

    }

}


/* =========================================================
   INTERCEPTAR BOTONES DEL HTML
========================================================= */

function interceptButtons() {

    document.addEventListener("click", event => {

        const button =
            event.target.closest("button, a");

        if (!button) {
            return;
        }


        const text =
            button.textContent
                .trim()
                .toLowerCase();


        /* CREAR MULTA */

        if (
            text.includes("crear multa") ||
            text.includes("nueva multa") ||
            text.includes("agregar multa")
        ) {

            event.preventDefault();

            openFineModal();

            return;
        }


        /* CREAR AVISO */

        if (
            text.includes("crear aviso") ||
            text.includes("nuevo aviso") ||
            text.includes("publicar aviso")
        ) {

            event.preventDefault();

            openNoticeModal();

            return;
        }


        /* AGREGAR RESIDENTE */

        if (
            text.includes("agregar residente") ||
            text.includes("nuevo residente") ||
            text.includes("añadir residente")
        ) {

            event.preventDefault();

            openResidentModal();

            return;
        }


        /* REGISTRAR PAGO */

        if (
            text.includes("registrar pago") ||
            text.includes("nuevo pago")
        ) {

            event.preventDefault();

            openPaymentModal();

            return;
        }


        /* NUEVA RESERVA */

        if (
            text.includes("nueva reserva") ||
            text.includes("crear reserva") ||
            text.includes("agregar reserva")
        ) {

            event.preventDefault();

            openReservationModal();

            return;
        }


        /* CALENDARIO */

        if (
            text.includes("ver calendario") ||
            text === "calendario"
        ) {

            event.preventDefault();

            openCalendarModal();

            return;
        }


        /* VER TODOS */

        if (
            text === "ver todos" ||
            text.includes("ver todos los residentes")
        ) {

            event.preventDefault();

            showScreen("residents");

            return;
        }


        if (
            text.includes("ver pagos") ||
            text.includes("ver todos los pagos")
        ) {

            event.preventDefault();

            showScreen("payments");

            return;
        }


        if (
            text.includes("ver multas") ||
            text.includes("ver todas las multas")
        ) {

            event.preventDefault();

            showScreen("fines");

            return;
        }


        if (
            text.includes("ver reservas") ||
            text.includes("ver todas las reservas")
        ) {

            event.preventDefault();

            showScreen("reservations");

            return;
        }


        /* EDITAR */

        if (
            text === "editar" ||
            text.includes("editar residente") ||
            text.includes("editar multa") ||
            text.includes("editar reserva") ||
            text.includes("editar aviso")
        ) {

            event.preventDefault();

            handleEditButton(button);

            return;
        }


        /* ELIMINAR */

        if (
            text === "eliminar" ||
            text.includes("eliminar residente") ||
            text.includes("eliminar multa") ||
            text.includes("eliminar reserva") ||
            text.includes("eliminar aviso")
        ) {

            event.preventDefault();

            handleDeleteButton(button);

            return;
        }


        /* MARCAR PAGADO */

        if (
            text.includes("marcar como pagado") ||
            text.includes("marcar pagado")
        ) {

            event.preventDefault();

            handleMarkPaid(button);

            return;
        }


        /* CANCELAR RESERVA */

        if (
            text.includes("cancelar reserva")
        ) {

            event.preventDefault();

            handleCancelReservation(button);

            return;
        }

    });

}


/* =========================================================
   ACCIONES RÁPIDAS
========================================================= */

function openQuickActions() {

    openModal(
        "Nueva acción",
        `
            <div class="quick-actions-grid">

                <button class="admin-modal-action"
                        data-action="resident">
                    👤 Agregar residente
                </button>

                <button class="admin-modal-action"
                        data-action="payment">
                    💰 Registrar pago
                </button>

                <button class="admin-modal-action"
                        data-action="fine">
                    ⚠️ Crear multa
                </button>

                <button class="admin-modal-action"
                        data-action="reservation">
                    📅 Nueva reserva
                </button>

                <button class="admin-modal-action"
                        data-action="notice">
                    🔔 Crear aviso
                </button>

            </div>
        `,
        null
    );


    document
        .querySelectorAll(".admin-modal-action")
        .forEach(button => {

            button.addEventListener("click", () => {

                closeModal();

                switch (button.dataset.action) {

                    case "resident":
                        openResidentModal();
                        break;

                    case "payment":
                        openPaymentModal();
                        break;

                    case "fine":
                        openFineModal();
                        break;

                    case "reservation":
                        openReservationModal();
                        break;

                    case "notice":
                        openNoticeModal();
                        break;

                }

            });

        });

}


/* =========================================================
   RESIDENTES
========================================================= */

function openResidentModal(resident = null) {

    const editing = Boolean(resident);

    openModal(
        editing
            ? "Editar residente"
            : "Agregar residente",

        `
        <form id="residentForm">

            <div class="form-grid">

                <label>
                    Nombre completo
                    <input
                        name="name"
                        required
                        value="${escapeAttribute(
                            resident?.name || ""
                        )}"
                    >
                </label>

                <label>
                    Departamento
                    <input
                        name="apartment"
                        required
                        value="${escapeAttribute(
                            resident?.apartment || ""
                        )}"
                    >
                </label>

                <label>
                    Correo
                    <input
                        name="email"
                        type="email"
                        required
                        value="${escapeAttribute(
                            resident?.email || ""
                        )}"
                    >
                </label>

                <label>
                    Teléfono
                    <input
                        name="phone"
                        value="${escapeAttribute(
                            resident?.phone || ""
                        )}"
                    >
                </label>

                <label>
                    Estado
                    <select name="status">

                        <option ${
                            resident?.status === "Activo"
                                ? "selected"
                                : ""
                        }>
                            Activo
                        </option>

                        <option ${
                            resident?.status === "Inactivo"
                                ? "selected"
                                : ""
                        }>
                            Inactivo
                        </option>

                    </select>
                </label>

            </div>

            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit">
                    ${editing ? "Guardar cambios" : "Agregar residente"}
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById("residentForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const form =
                new FormData(event.target);

            const residentData = {
                name: form.get("name"),
                apartment: form.get("apartment"),
                email: form.get("email"),
                phone: form.get("phone"),
                status: form.get("status"),
                payment: resident?.payment || "Pendiente"
            };


            if (editing) {

                Object.assign(
                    resident,
                    residentData
                );

                showToast(
                    "Residente actualizado correctamente."
                );

            } else {

                data.residents.push({
                    id: nextId(data.residents),
                    ...residentData
                });

                showToast(
                    "Residente agregado correctamente."
                );

            }


            saveData();

            refreshInterface();

            closeModal();

        });

}


/* =========================================================
   PAGOS
========================================================= */

function openPaymentModal() {

    const residents =
        data.residents;

    openModal(
        "Registrar pago",

        `
        <form id="paymentForm">

            <div class="form-grid">

                <label>
                    Residente

                    <select name="resident" required>

                        ${residents.map(
                            resident => `
                                <option value="${escapeAttribute(resident.name)}">
                                    ${escapeHTML(resident.name)}
                                    — Depto ${escapeHTML(resident.apartment)}
                                </option>
                            `
                        ).join("")}

                    </select>
                </label>

                <label>
                    Monto
                    <input
                        name="amount"
                        type="number"
                        min="1"
                        required
                        placeholder="84500"
                    >
                </label>

                <label>
                    Fecha
                    <input
                        name="date"
                        type="date"
                        value="${todayISO()}"
                        required
                    >
                </label>

                <label>
                    Estado
                    <select name="status">
                        <option>Pagado</option>
                        <option>Pendiente</option>
                    </select>
                </label>

            </div>

            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit">
                    Registrar pago
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById("paymentForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const form =
                new FormData(event.target);

            const residentName =
                form.get("resident");

            const resident =
                data.residents.find(
                    item => item.name === residentName
                );


            data.payments.push({

                id: nextId(data.payments),

                resident: residentName,

                apartment:
                    resident?.apartment || "",

                amount:
                    Number(form.get("amount")),

                date:
                    form.get("date"),

                status:
                    form.get("status")

            });


            if (resident) {

                resident.payment =
                    form.get("status");

            }


            saveData();

            refreshInterface();

            closeModal();

            showToast(
                "Pago registrado correctamente."
            );

        });

}


/* =========================================================
   MULTAS
========================================================= */

function openFineModal(fine = null) {

    const editing =
        Boolean(fine);

    openModal(
        editing
            ? "Editar multa"
            : "Crear multa",

        `
        <form id="fineForm">

            <div class="form-grid">

                <label>
                    Residente

                    <select name="resident" required>

                        ${data.residents.map(
                            resident => `
                                <option
                                    value="${escapeAttribute(resident.name)}"
                                    ${
                                        fine?.resident === resident.name
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${escapeHTML(resident.name)}
                                    — Depto ${escapeHTML(resident.apartment)}
                                </option>
                            `
                        ).join("")}

                    </select>
                </label>

                <label>
                    Motivo
                    <input
                        name="reason"
                        required
                        value="${escapeAttribute(
                            fine?.reason || ""
                        )}"
                        placeholder="Ej: Uso indebido de estacionamiento"
                    >
                </label>

                <label>
                    Monto
                    <input
                        name="amount"
                        type="number"
                        min="1"
                        required
                        value="${fine?.amount || ""}"
                        placeholder="15000"
                    >
                </label>

                <label>
                    Fecha
                    <input
                        name="date"
                        type="date"
                        required
                        value="${fine?.date || todayISO()}"
                    >
                </label>

                <label>
                    Estado
                    <select name="status">

                        <option
                            ${
                                fine?.status !== "Pagada"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pendiente
                        </option>

                        <option
                            ${
                                fine?.status === "Pagada"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pagada
                        </option>

                    </select>
                </label>

            </div>

            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit">
                    ${editing ? "Guardar cambios" : "Crear multa"}
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById("fineForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const form =
                new FormData(event.target);

            const residentName =
                form.get("resident");

            const resident =
                data.residents.find(
                    item => item.name === residentName
                );


            const fineData = {

                resident:
                    residentName,

                apartment:
                    resident?.apartment || "",

                reason:
                    form.get("reason"),

                amount:
                    Number(form.get("amount")),

                date:
                    form.get("date"),

                status:
                    form.get("status")

            };


            if (editing) {

                Object.assign(
                    fine,
                    fineData
                );

                showToast(
                    "Multa actualizada correctamente."
                );

            } else {

                data.fines.push({

                    id:
                        nextId(data.fines),

                    ...fineData

                });

                showToast(
                    "Multa creada correctamente."
                );

            }


            saveData();

            refreshInterface();

            closeModal();

        });

}


/* =========================================================
   RESERVAS
========================================================= */

function openReservationModal(
    reservation = null
) {

    const editing =
        Boolean(reservation);


    const spaces = [
        "Quincho 1",
        "Quincho 2",
        "Salón Multiuso 1",
        "Salón Multiuso 2",
        "Cancha"
    ];


    openModal(
        editing
            ? "Editar reserva"
            : "Nueva reserva",

        `
        <form id="reservationForm">

            <div class="form-grid">

                <label>
                    Residente

                    <select name="resident" required>

                        ${data.residents.map(
                            resident => `
                                <option
                                    value="${escapeAttribute(resident.name)}"
                                    ${
                                        reservation?.resident === resident.name
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${escapeHTML(resident.name)}
                                    — Depto ${escapeHTML(resident.apartment)}
                                </option>
                            `
                        ).join("")}

                    </select>
                </label>

                <label>
                    Espacio

                    <select name="space" required>

                        ${spaces.map(
                            space => `
                                <option
                                    ${
                                        reservation?.space === space
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${escapeHTML(space)}
                                </option>
                            `
                        ).join("")}

                    </select>

                </label>

                <label>
                    Fecha
                    <input
                        name="date"
                        type="date"
                        required
                        value="${reservation?.date || todayISO()}"
                    >
                </label>

                <label>
                    Hora inicio
                    <input
                        name="start"
                        type="time"
                        required
                        value="${reservation?.start || "18:00"}"
                    >
                </label>

                <label>
                    Hora término
                    <input
                        name="end"
                        type="time"
                        required
                        value="${reservation?.end || "19:00"}"
                    >
                </label>

                <label>
                    Estado

                    <select name="status">

                        <option
                            ${
                                reservation?.status === "Cancelada"
                                    ? ""
                                    : "selected"
                            }
                        >
                            Confirmada
                        </option>

                        <option
                            ${
                                reservation?.status === "Cancelada"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Cancelada
                        </option>

                    </select>

                </label>

            </div>

            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit">
                    ${editing ? "Guardar cambios" : "Crear reserva"}
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById("reservationForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const form =
                new FormData(event.target);

            const residentName =
                form.get("resident");

            const resident =
                data.residents.find(
                    item => item.name === residentName
                );


            const start =
                form.get("start");

            const end =
                form.get("end");


            if (start >= end) {

                showToast(
                    "La hora de término debe ser posterior al inicio."
                );

                return;
            }


            const reservationData = {

                resident:
                    residentName,

                apartment:
                    resident?.apartment || "",

                space:
                    form.get("space"),

                date:
                    form.get("date"),

                start,

                end,

                status:
                    form.get("status")

            };


            if (editing) {

                Object.assign(
                    reservation,
                    reservationData
                );

                showToast(
                    "Reserva actualizada correctamente."
                );

            } else {

                data.reservations.push({

                    id:
                        nextId(data.reservations),

                    ...reservationData

                });

                showToast(
                    "Reserva creada correctamente."
                );

            }


            saveData();

            refreshInterface();

            closeModal();

        });

}


/* =========================================================
   CALENDARIO
========================================================= */

function openCalendarModal() {

    renderCalendarModal();

}


function renderCalendarModal() {

    const year =
        adminState.calendarDate.getFullYear();

    const month =
        adminState.calendarDate.getMonth();


    const monthName =
        adminState.calendarDate.toLocaleDateString(
            "es-CL",
            {
                month: "long",
                year: "numeric"
            }
        );


    /*
     * Ajustamos el inicio para que domingo sea 0.
     */

    const firstDay =
        new Date(year, month, 1).getDay();


    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    let calendarDays = "";


    for (let i = 0; i < firstDay; i++) {

        calendarDays += `
            <div class="calendar-day empty"></div>
        `;

    }


    for (let day = 1; day <= daysInMonth; day++) {

        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const reservations =
            data.reservations.filter(
                reservation =>
                    reservation.date === date &&
                    reservation.status !== "Cancelada"
            );


        calendarDays += `
            <button
                type="button"
                class="calendar-day ${
                    reservations.length
                        ? "has-reservations"
                        : ""
                }"
                data-calendar-date="${date}"
            >

                <strong>${day}</strong>

                ${
                    reservations.length
                        ? `
                            <small>
                                ${reservations.length}
                                reserva${reservations.length > 1 ? "s" : ""}
                            </small>
                        `
                        : ""
                }

            </button>
        `;

    }


    openModal(
        "Calendario de reservas",

        `
        <div class="calendar-container">

            <div class="calendar-header">

                <button
                    type="button"
                    class="calendar-nav"
                    id="calendarPrev">
                    ‹
                </button>

                <strong>
                    ${capitalize(monthName)}
                </strong>

                <button
                    type="button"
                    class="calendar-nav"
                    id="calendarNext">
                    ›
                </button>

            </div>

            <div class="calendar-week">

                <span>Dom</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>

            </div>

            <div class="calendar-grid">

                ${calendarDays}

            </div>

            <div
                id="calendarReservations"
                class="calendar-reservations">

                <p>
                    Selecciona un día para ver sus reservas.
                </p>

            </div>

        </div>
        `
    );


    document
        .getElementById("calendarPrev")
        .addEventListener("click", () => {

            adminState.calendarDate =
                new Date(year, month - 1, 1);

            renderCalendarModal();

        });


    document
        .getElementById("calendarNext")
        .addEventListener("click", () => {

            adminState.calendarDate =
                new Date(year, month + 1, 1);

            renderCalendarModal();

        });


    document
        .querySelectorAll("[data-calendar-date]")
        .forEach(button => {

            button.addEventListener("click", () => {

                showCalendarReservations(
                    button.dataset.calendarDate
                );

            });

        });

}


function showCalendarReservations(date) {

    const container =
        document.getElementById(
            "calendarReservations"
        );


    if (!container) {
        return;
    }


    const reservations =
        data.reservations.filter(
            reservation =>
                reservation.date === date
        );


    if (!reservations.length) {

        container.innerHTML = `
            <p>
                No hay reservas para este día.
            </p>
        `;

        return;
    }


    container.innerHTML = `

        <h4>
            Reservas del ${formatDate(date)}
        </h4>

        ${reservations.map(
            reservation => `

                <div class="calendar-reservation-item">

                    <strong>
                        ${escapeHTML(reservation.space)}
                    </strong>

                    <span>
                        ${escapeHTML(reservation.start)}
                        -
                        ${escapeHTML(reservation.end)}
                    </span>

                    <small>
                        ${escapeHTML(reservation.resident)}
                        · Depto ${escapeHTML(reservation.apartment)}
                    </small>

                    <small>
                        Estado:
                        ${escapeHTML(reservation.status)}
                    </small>

                </div>

            `
        ).join("")}

    `;

}


/* =========================================================
   AVISOS
========================================================= */

function openNoticeModal(notice = null) {

    const editing =
        Boolean(notice);


    openModal(
        editing
            ? "Editar aviso"
            : "Crear aviso",

        `
        <form id="noticeForm">

            <label>
                Título

                <input
                    name="title"
                    required
                    value="${escapeAttribute(
                        notice?.title || ""
                    )}"
                    placeholder="Título del aviso"
                >

            </label>

            <label>
                Contenido

                <textarea
                    name="content"
                    rows="5"
                    required
                    placeholder="Escribe el contenido del aviso..."
                >${escapeHTML(
                    notice?.content || ""
                )}</textarea>

            </label>

            <label>
                Estado

                <select name="status">

                    <option
                        ${
                            notice?.status === "Borrador"
                                ? ""
                                : "selected"
                        }
                    >
                        Publicado
                    </option>

                    <option
                        ${
                            notice?.status === "Borrador"
                                ? "selected"
                                : ""
                        }
                    >
                        Borrador
                    </option>

                </select>

            </label>

            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit">
                    ${editing ? "Guardar cambios" : "Publicar aviso"}
                </button>

            </div>

        </form>
        `
    );


    document
        .getElementById("noticeForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const form =
                new FormData(event.target);


            const noticeData = {

                title:
                    form.get("title"),

                content:
                    form.get("content"),

                date:
                    todayISO(),

                status:
                    form.get("status")

            };


            if (editing) {

                Object.assign(
                    notice,
                    noticeData
                );

                showToast(
                    "Aviso actualizado correctamente."
                );

            } else {

                data.notices.push({

                    id:
                        nextId(data.notices),

                    ...noticeData

                });

                showToast(
                    "Aviso publicado correctamente."
                );

            }


            saveData();

            refreshInterface();

            closeModal();

        });

}


/* =========================================================
   EDITAR
========================================================= */

function handleEditButton(button) {

    const type =
        getDataType(button);

    const id =
        getDataId(button);


    if (!type || !id) {

        showToast(
            "No se pudo identificar el elemento."
        );

        return;
    }


    const item =
        data[type]?.find(
            element =>
                String(element.id) === String(id)
        );


    if (!item) {
        return;
    }


    switch (type) {

        case "residents":
            openResidentModal(item);
            break;

        case "fines":
            openFineModal(item);
            break;

        case "reservations":
            openReservationModal(item);
            break;

        case "notices":
            openNoticeModal(item);
            break;

    }

}


/* =========================================================
   ELIMINAR
========================================================= */

function handleDeleteButton(button) {

    const type =
        getDataType(button);

    const id =
        getDataId(button);


    if (!type || !id) {
        return;
    }


    const index =
        data[type]?.findIndex(
            element =>
                String(element.id) === String(id)
        );


    if (
        index === undefined ||
        index === -1
    ) {
        return;
    }


    const confirmed =
        confirm(
            "¿Estás seguro de que quieres eliminar este elemento?"
        );


    if (!confirmed) {
        return;
    }


    data[type].splice(index, 1);

    saveData();

    refreshInterface();

    showToast(
        "Elemento eliminado correctamente."
    );

}


/* =========================================================
   MARCAR PAGO
========================================================= */

function handleMarkPaid(button) {

    const id =
        getDataId(button);

    const payment =
        data.payments.find(
            item =>
                String(item.id) === String(id)
        );


    if (!payment) {
        return;
    }


    payment.status =
        "Pagado";


    const resident =
        data.residents.find(
            item =>
                item.name === payment.resident
        );


    if (resident) {

        resident.payment =
            "Pagado";

    }


    saveData();

    refreshInterface();

    showToast(
        "Pago marcado como pagado."
    );

}


/* =========================================================
   CANCELAR RESERVA
========================================================= */

function handleCancelReservation(button) {

    const id =
        getDataId(button);

    const reservation =
        data.reservations.find(
            item =>
                String(item.id) === String(id)
        );


    if (!reservation) {
        return;
    }


    const confirmed =
        confirm(
            "¿Cancelar esta reserva?"
        );


    if (!confirmed) {
        return;
    }


    reservation.status =
        "Cancelada";


    saveData();

    refreshInterface();

    showToast(
        "Reserva cancelada."
    );

}


/* =========================================================
   ACTUALIZAR INTERFAZ
========================================================= */

function refreshInterface() {

    updateDashboard();

    renderTables();

    updateNotices();

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    if (!statCards.length) {
        return;
    }


    /*
     * =====================================================
     * RECAUDACIÓN DEL MES
     * =====================================================
     */

    const dashboardMonth =
        "2026-09";


    const monthlyPayments =
        data.payments.filter(
            payment =>
                payment.date?.startsWith(
                    dashboardMonth
                )
        );


    const totalBilled =
        monthlyPayments.reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );


    const totalCollected =
        monthlyPayments
            .filter(
                payment =>
                    payment.status === "Pagado"
            )
            .reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


    const totalPending =
        monthlyPayments
            .filter(
                payment =>
                    payment.status !== "Pagado"
            )
            .reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


    /*
     * =====================================================
     * RESERVAS DEL MES
     * =====================================================
     */

    const monthlyReservations =
        data.reservations.filter(
            reservation =>
                reservation.date?.startsWith(
                    dashboardMonth
                )
        );


    /*
     * =====================================================
     * MULTAS PENDIENTES
     * =====================================================
     */

    const pendingFines =
        data.fines.filter(
            fine =>
                fine.status === "Pendiente"
        );


    /*
     * =====================================================
     * RESIDENTES
     * =====================================================
     */

    const totalResidents =
        data.residents.length;


    /*
     * =====================================================
     * ACTUALIZACIÓN INTELIGENTE
     *
     * Busca el texto de cada tarjeta para saber
     * qué número debe mostrar.
     * =====================================================
     */

    statCards.forEach(card => {

        const cardText =
            card.textContent
                .trim()
                .toLowerCase();


        const number =
            card.querySelector(
                ".stat-value, .stat-number, h2, h3, strong"
            );


        if (!number) {
            return;
        }


        /*
         * RECAUDACIÓN
         */

        if (
            cardText.includes("recaudación") ||
            cardText.includes("recaudacion")
        ) {

            number.textContent =
                formatMoney(totalCollected);

            makeStatCardClickable(
                card,
                () => openCollectionDetails()
            );

            return;
        }


        /*
         * RESERVAS
         */

        if (
            cardText.includes("reservas")
        ) {

            number.textContent =
                monthlyReservations.length;

            makeStatCardClickable(
                card,
                () => openCalendarModal()
            );

            return;
        }


        /*
         * MULTAS
         */

        if (
            cardText.includes("multas")
        ) {

            number.textContent =
                pendingFines.length;

            makeStatCardClickable(
                card,
                () => openFineDetails()
            );

            return;
        }


        /*
         * RESIDENTES
         */

        if (
            cardText.includes("residentes")
        ) {

            number.textContent =
                totalResidents;

            makeStatCardClickable(
                card,
                () => showScreen("residents")
            );

            return;
        }


        /*
         * COMPATIBILIDAD CON EL DASHBOARD ANTERIOR
         */

        if (
            cardText.includes("cobranza") ||
            cardText.includes("pagos")
        ) {

            const percentage =
                totalBilled
                    ? Math.round(
                        (
                            totalCollected /
                            totalBilled
                        ) * 100
                    )
                    : 0;

            number.textContent =
                `${percentage}%`;

            makeStatCardClickable(
                card,
                () => openCollectionDetails()
            );

        }

    });

}


/* =========================================================
   HACER TARJETA CLICKEABLE
========================================================= */

function makeStatCardClickable(
    card,
    callback
) {

    if (card.dataset.habitappClickable === "true") {
        return;
    }


    card.dataset.habitappClickable =
        "true";


    card.style.cursor =
        "pointer";


    card.addEventListener(
        "click",
        event => {

            /*
             * Si se hizo clic en un botón dentro
             * de la tarjeta, no abrimos el detalle.
             */

            if (
                event.target.closest(
                    "button, a"
                )
            ) {
                return;
            }


            callback();

        }
    );

}


/* =========================================================
   DETALLE DE RECAUDACIÓN
========================================================= */

function openCollectionDetails() {

    const dashboardMonth =
        "2026-09";


    const monthlyPayments =
        data.payments.filter(
            payment =>
                payment.date?.startsWith(
                    dashboardMonth
                )
        );


    const totalBilled =
        monthlyPayments.reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );


    const paidPayments =
        monthlyPayments.filter(
            payment =>
                payment.status === "Pagado"
        );


    const pendingPayments =
        monthlyPayments.filter(
            payment =>
                payment.status !== "Pagado"
        );


    const totalCollected =
        paidPayments.reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );


    const totalPending =
        pendingPayments.reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );


    const percentage =
        totalBilled
            ? Math.round(
                (
                    totalCollected /
                    totalBilled
                ) * 100
            )
            : 0;


    openModal(

        "Detalle de recaudación",

        `
        <div class="admin-detail-container">

            <div class="detail-summary-grid">

                <div class="detail-summary-card">
                    <span>Total facturado</span>
                    <strong>
                        ${formatMoney(totalBilled)}
                    </strong>
                </div>

                <div class="detail-summary-card success">
                    <span>Total recaudado</span>
                    <strong>
                        ${formatMoney(totalCollected)}
                    </strong>
                </div>

                <div class="detail-summary-card warning">
                    <span>Total pendiente</span>
                    <strong>
                        ${formatMoney(totalPending)}
                    </strong>
                </div>

                <div class="detail-summary-card">
                    <span>Recaudación</span>
                    <strong>
                        ${percentage}%
                    </strong>
                </div>

            </div>


            <div class="detail-section">

                <div class="detail-section-header">

                    <div>
                        <h3>Pagos realizados</h3>
                        <span>
                            ${paidPayments.length}
                            residente${paidPayments.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                </div>


                ${
                    paidPayments.length
                        ? `
                            <div class="detail-list">

                                ${paidPayments.map(
                                    payment => `

                                        <div class="detail-row">

                                            <div>

                                                <strong>
                                                    ${escapeHTML(payment.resident)}
                                                </strong>

                                                <small>
                                                    Depto ${escapeHTML(payment.apartment)}
                                                </small>

                                            </div>

                                            <div class="detail-row-right">

                                                <strong>
                                                    ${formatMoney(payment.amount)}
                                                </strong>

                                                <small>
                                                    ${formatDate(payment.date)}
                                                </small>

                                            </div>

                                        </div>

                                    `
                                ).join("")}

                            </div>
                        `
                        : `
                            <div class="detail-empty">
                                No existen pagos registrados.
                            </div>
                        `
                }

            </div>


            <div class="detail-section">

                <div class="detail-section-header">

                    <div>
                        <h3>Pagos pendientes</h3>
                        <span>
                            ${pendingPayments.length}
                            residente${pendingPayments.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                </div>


                ${
                    pendingPayments.length
                        ? `
                            <div class="detail-list">

                                ${pendingPayments.map(
                                    payment => `

                                        <div class="detail-row pending">

                                            <div>

                                                <strong>
                                                    ${escapeHTML(payment.resident)}
                                                </strong>

                                                <small>
                                                    Depto ${escapeHTML(payment.apartment)}
                                                </small>

                                            </div>

                                            <div class="detail-row-right">

                                                <strong>
                                                    ${formatMoney(payment.amount)}
                                                </strong>

                                                <button
                                                    type="button"
                                                    class="detail-pay-button"
                                                    data-payment-detail-id="${payment.id}">
                                                    Marcar pagado
                                                </button>

                                            </div>

                                        </div>

                                    `
                                ).join("")}

                            </div>
                        `
                        : `
                            <div class="detail-empty success-empty">
                                Todos los pagos están al día.
                            </div>
                        `
                }

            </div>


            <div class="detail-month">
                Mostrando información correspondiente a
                <strong>septiembre 2026</strong>.
            </div>

        </div>
        `

    );


    /*
     * Botones para marcar pagos directamente
     * desde el detalle de recaudación.
     */

    document
        .querySelectorAll(
            "[data-payment-detail-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const payment =
                        data.payments.find(
                            item =>
                                String(item.id) ===
                                String(
                                    button.dataset
                                        .paymentDetailId
                                )
                        );


                    if (!payment) {
                        return;
                    }


                    payment.status =
                        "Pagado";


                    const resident =
                        data.residents.find(
                            item =>
                                item.name ===
                                payment.resident
                        );


                    if (resident) {

                        resident.payment =
                            "Pagado";

                    }


                    saveData();

                    closeModal();

                    refreshInterface();

                    showToast(
                        `${payment.resident} ahora figura como pagado.`
                    );

                    /*
                     * Volvemos a abrir para mantener
                     * la vista de administración.
                     */

                    openCollectionDetails();

                }
            );

        });

}


/* =========================================================
   DETALLE DE MULTAS
========================================================= */

function openFineDetails() {

    const pendingFines =
        data.fines.filter(
            fine =>
                fine.status === "Pendiente"
        );


    const totalPending =
        pendingFines.reduce(
            (total, fine) =>
                total + Number(fine.amount || 0),
            0
        );


    openModal(

        "Multas pendientes",

        `
        <div class="admin-detail-container">

            <div class="detail-summary-grid">

                <div class="detail-summary-card warning">
                    <span>Multas pendientes</span>
                    <strong>
                        ${pendingFines.length}
                    </strong>
                </div>

                <div class="detail-summary-card">
                    <span>Monto pendiente</span>
                    <strong>
                        ${formatMoney(totalPending)}
                    </strong>
                </div>

            </div>


            <div class="detail-section">

                <div class="detail-section-header">

                    <div>
                        <h3>Detalle de multas</h3>
                        <span>
                            Personas y viviendas registradas
                        </span>
                    </div>

                </div>


                ${
                    pendingFines.length
                        ? `
                            <div class="fine-detail-list">

                                ${pendingFines.map(
                                    fine => `

                                        <div class="fine-detail-card">

                                            <div class="fine-detail-top">

                                                <div>

                                                    <strong>
                                                        ${escapeHTML(fine.resident)}
                                                    </strong>

                                                    <span>
                                                        Casa / Depto
                                                        ${escapeHTML(fine.apartment)}
                                                    </span>

                                                </div>

                                                <strong class="fine-detail-amount">
                                                    ${formatMoney(fine.amount)}
                                                </strong>

                                            </div>


                                            <div class="fine-detail-info">

                                                <div>

                                                    <span>Motivo</span>

                                                    <strong>
                                                        ${escapeHTML(fine.reason)}
                                                    </strong>

                                                </div>

                                                <div>

                                                    <span>Fecha</span>

                                                    <strong>
                                                        ${formatDate(fine.date)}
                                                    </strong>

                                                </div>

                                                <div>

                                                    <span>Estado</span>

                                                    <strong class="fine-status">
                                                        ${escapeHTML(fine.status)}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div class="fine-detail-actions">

                                                <button
                                                    type="button"
                                                    class="table-action"
                                                    data-fine-detail-edit="${fine.id}">
                                                    Editar multa
                                                </button>

                                                <button
                                                    type="button"
                                                    class="table-action"
                                                    data-fine-detail-delete="${fine.id}">
                                                    Eliminar
                                                </button>

                                            </div>

                                        </div>

                                    `
                                ).join("")}

                            </div>
                        `
                        : `
                            <div class="detail-empty success-empty">
                                No existen multas pendientes.
                            </div>
                        `
                }

            </div>

        </div>
        `

    );


    /*
     * EDITAR MULTA
     */

    document
        .querySelectorAll(
            "[data-fine-detail-edit]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const fine =
                        data.fines.find(
                            item =>
                                String(item.id) ===
                                String(
                                    button.dataset
                                        .fineDetailEdit
                                )
                        );


                    if (!fine) {
                        return;
                    }


                    closeModal();

                    openFineModal(fine);

                }
            );

        });


    /*
     * ELIMINAR MULTA
     */

    document
        .querySelectorAll(
            "[data-fine-detail-delete]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const fine =
                        data.fines.find(
                            item =>
                                String(item.id) ===
                                String(
                                    button.dataset
                                        .fineDetailDelete
                                )
                        );


                    if (!fine) {
                        return;
                    }


                    const confirmed =
                        confirm(
                            `¿Eliminar la multa de ${fine.resident}?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    data.fines =
                        data.fines.filter(
                            item =>
                                item.id !== fine.id
                        );


                    saveData();

                    closeModal();

                    refreshInterface();

                    showToast(
                        "Multa eliminada correctamente."
                    );


                    openFineDetails();

                }
            );

        });

}


/* =========================================================
   TABLAS
========================================================= */

function renderTables() {

    renderResidentTable();

    renderFineTable();

    renderReservationTable();

    renderPaymentTable();

}


/* =========================================================
   TABLA RESIDENTES
========================================================= */

function renderResidentTable() {

    const table =
        document.querySelector(
            "#screen-residents table tbody"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        data.residents.map(
            resident => `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(resident.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(resident.apartment)}
                    </td>

                    <td>
                        ${escapeHTML(resident.email)}
                    </td>

                    <td>
                        ${escapeHTML(resident.status)}
                    </td>

                    <td>
                        ${escapeHTML(resident.payment)}
                    </td>

                    <td>

                        <button
                            class="table-action"
                            data-type="residents"
                            data-id="${resident.id}">
                            Editar
                        </button>

                        <button
                            class="table-action"
                            data-type="residents"
                            data-id="${resident.id}">
                            Eliminar
                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   TABLA MULTAS
========================================================= */

function renderFineTable() {

    const table =
        document.querySelector(
            "#screen-fines table tbody"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        data.fines.map(
            fine => `

                <tr>

                    <td>
                        ${escapeHTML(fine.resident)}
                    </td>

                    <td>
                        ${escapeHTML(fine.apartment)}
                    </td>

                    <td>
                        ${escapeHTML(fine.reason)}
                    </td>

                    <td>
                        ${formatMoney(fine.amount)}
                    </td>

                    <td>
                        ${formatDate(fine.date)}
                    </td>

                    <td>
                        ${escapeHTML(fine.status)}
                    </td>

                    <td>

                        <button
                            class="table-action"
                            data-type="fines"
                            data-id="${fine.id}">
                            Editar
                        </button>

                        <button
                            class="table-action"
                            data-type="fines"
                            data-id="${fine.id}">
                            Eliminar
                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   TABLA RESERVAS
========================================================= */

function renderReservationTable() {

    const table =
        document.querySelector(
            "#screen-reservations table tbody"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        data.reservations.map(
            reservation => `

                <tr>

                    <td>
                        ${escapeHTML(reservation.resident)}
                    </td>

                    <td>
                        ${escapeHTML(reservation.apartment)}
                    </td>

                    <td>
                        ${escapeHTML(reservation.space)}
                    </td>

                    <td>
                        ${formatDate(reservation.date)}
                    </td>

                    <td>
                        ${escapeHTML(reservation.start)}
                        -
                        ${escapeHTML(reservation.end)}
                    </td>

                    <td>
                        ${escapeHTML(reservation.status)}
                    </td>

                    <td>

                        <button
                            class="table-action"
                            data-type="reservations"
                            data-id="${reservation.id}">
                            Editar
                        </button>

                        ${
                            reservation.status !== "Cancelada"
                                ? `
                                    <button
                                        class="table-action"
                                        data-type="reservations"
                                        data-id="${reservation.id}">
                                        Cancelar reserva
                                    </button>
                                `
                                : ""
                        }

                        <button
                            class="table-action"
                            data-type="reservations"
                            data-id="${reservation.id}">
                            Eliminar
                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   TABLA PAGOS
========================================================= */

function renderPaymentTable() {

    const table =
        document.querySelector(
            "#screen-payments table tbody"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        data.payments.map(
            payment => `

                <tr>

                    <td>
                        ${escapeHTML(payment.resident)}
                    </td>

                    <td>
                        ${escapeHTML(payment.apartment)}
                    </td>

                    <td>
                        ${formatMoney(payment.amount)}
                    </td>

                    <td>
                        ${formatDate(payment.date)}
                    </td>

                    <td>
                        ${escapeHTML(payment.status)}
                    </td>

                    <td>

                        ${
                            payment.status !== "Pagado"
                                ? `
                                    <button
                                        class="table-action"
                                        data-type="payments"
                                        data-id="${payment.id}">
                                        Marcar como pagado
                                    </button>
                                `
                                : ""
                        }

                        <button
                            class="table-action"
                            data-type="payments"
                            data-id="${payment.id}">
                            Eliminar
                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   AVISOS
========================================================= */

function updateNotices() {

    const container =
        document.querySelector(
            "#screen-notices .notices-list, " +
            "#screen-notices .notice-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        data.notices.map(
            notice => `

                <div class="notice-item">

                    <div>

                        <h3>
                            ${escapeHTML(notice.title)}
                        </h3>

                        <p>
                            ${escapeHTML(notice.content)}
                        </p>

                        <small>
                            ${formatDate(notice.date)}
                            ·
                            ${escapeHTML(notice.status)}
                        </small>

                    </div>

                    <div>

                        <button
                            class="table-action"
                            data-type="notices"
                            data-id="${notice.id}">
                            Editar
                        </button>

                        <button
                            class="table-action"
                            data-type="notices"
                            data-id="${notice.id}">
                            Eliminar
                        </button>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   BÚSQUEDA
========================================================= */

function setupGlobalSearch() {

    const input =
        document.getElementById(
            "globalSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            if (
                adminState.currentScreen !==
                "residents"
            ) {
                return;
            }


            document
                .querySelectorAll(
                    "#screen-residents table tbody tr"
                )
                .forEach(row => {

                    row.style.display =
                        row.textContent
                            .toLowerCase()
                            .includes(query)
                            ? ""
                            : "none";

                });

        }
    );

}


/* =========================================================
   MODAL
========================================================= */

function openModal(
    title,
    content,
    onReady = null
) {

    closeModal();


    const overlay =
        document.createElement("div");


    overlay.id =
        "adminModalOverlay";


    overlay.innerHTML = `

        <div class="admin-modal">

            <div class="admin-modal-header">

                <h2>
                    ${escapeHTML(title)}
                </h2>

                <button
                    class="admin-modal-close"
                    aria-label="Cerrar">
                    ×
                </button>

            </div>

            <div class="admin-modal-body">

                ${content}

            </div>

        </div>

    `;


    document.body.appendChild(overlay);


    addModalStyles();


    overlay
        .querySelector(".admin-modal-close")
        .addEventListener(
            "click",
            closeModal
        );


    const cancel =
        overlay.querySelector(".modal-cancel");


    if (cancel) {

        cancel.addEventListener(
            "click",
            closeModal
        );

    }


    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {
                closeModal();
            }

        }
    );


    if (onReady) {
        onReady(overlay);
    }

}


function closeModal() {

    const modal =
        document.getElementById(
            "adminModalOverlay"
        );


    if (modal) {
        modal.remove();
    }

}


/* =========================================================
   ESTILOS DE MODALES
========================================================= */

function addModalStyles() {

    if (
        document.getElementById(
            "habitappAdminModalStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "habitappAdminModalStyles";


    style.textContent = `

        #adminModalOverlay {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                rgba(15, 23, 42, .45);

            backdrop-filter:
                blur(4px);

        }


        .admin-modal {

            width: min(760px, 100%);

            max-height: 90vh;

            overflow-y: auto;

            background: #ffffff;

            border-radius: 18px;

            box-shadow:
                0 25px 70px rgba(15, 23, 42, .25);

            animation:
                modalIn .2s ease;

        }


        @keyframes modalIn {

            from {

                opacity: 0;

                transform:
                    translateY(12px)
                    scale(.98);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        .admin-modal-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            padding: 20px 22px;

            border-bottom:
                1px solid #e5e7eb;

        }


        .admin-modal-header h2 {

            margin: 0;

            font-size: 18px;

            color: #16181d;

        }


        .admin-modal-close {

            width: 34px;

            height: 34px;

            border: 0;

            border-radius: 9px;

            background: #f1f5f9;

            color: #475569;

            font-size: 22px;

            cursor: pointer;

        }


        .admin-modal-body {

            padding: 22px;

        }


        .admin-modal-body label {

            display: flex;

            flex-direction: column;

            gap: 7px;

            margin-bottom: 15px;

            color: #334155;

            font-size: 13px;

            font-weight: 600;

        }


        .admin-modal-body input,

        .admin-modal-body select,

        .admin-modal-body textarea {

            width: 100%;

            padding: 11px 12px;

            border: 1px solid #dbe2ea;

            border-radius: 9px;

            outline: none;

            background: #fff;

            color: #16181d;

            font: inherit;

        }


        .admin-modal-body input:focus,

        .admin-modal-body select:focus,

        .admin-modal-body textarea:focus {

            border-color: #2563eb;

            box-shadow:
                0 0 0 3px rgba(37,99,235,.10);

        }


        .form-grid {

            display: grid;

            grid-template-columns:
                repeat(2, minmax(0, 1fr));

            gap: 4px 15px;

        }


        .modal-actions {

            display: flex;

            justify-content: flex-end;

            gap: 10px;

            margin-top: 20px;

            padding-top: 16px;

            border-top:
                1px solid #e5e7eb;

        }


        .modal-cancel,

        .modal-submit {

            border: 0;

            border-radius: 9px;

            padding: 10px 16px;

            cursor: pointer;

            font-weight: 600;

        }


        .modal-cancel {

            background: #f1f5f9;

            color: #475569;

        }


        .modal-submit {

            background: #2563eb;

            color: white;

        }


        .quick-actions-grid {

            display: grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap: 12px;

        }


        .admin-modal-action {

            padding: 18px;

            border: 1px solid #e2e8f0;

            border-radius: 12px;

            background: #f8fafc;

            color: #334155;

            text-align: left;

            cursor: pointer;

            font-weight: 600;

            transition: .2s;

        }


        .admin-modal-action:hover {

            border-color: #2563eb;

            background: #eff6ff;

        }


        /* =================================================
           DETALLES
        ================================================= */


        .admin-detail-container {

            display: flex;

            flex-direction: column;

            gap: 20px;

        }


        .detail-summary-grid {

            display: grid;

            grid-template-columns:
                repeat(4, minmax(0, 1fr));

            gap: 10px;

        }


        .detail-summary-card {

            padding: 15px;

            border: 1px solid #e2e8f0;

            border-radius: 12px;

            background: #f8fafc;

        }


        .detail-summary-card span {

            display: block;

            margin-bottom: 7px;

            color: #64748b;

            font-size: 11px;

            font-weight: 600;

        }


        .detail-summary-card strong {

            display: block;

            color: #16181d;

            font-size: 17px;

        }


        .detail-summary-card.success {

            background: #f0fdf4;

            border-color: #bbf7d0;

        }


        .detail-summary-card.success strong {

            color: #15803d;

        }


        .detail-summary-card.warning {

            background: #fff7ed;

            border-color: #fed7aa;

        }


        .detail-summary-card.warning strong {

            color: #c2410c;

        }


        .detail-section {

            border: 1px solid #e2e8f0;

            border-radius: 13px;

            overflow: hidden;

        }


        .detail-section-header {

            padding: 14px 16px;

            background: #f8fafc;

            border-bottom:
                1px solid #e2e8f0;

        }


        .detail-section-header h3 {

            margin: 0 0 3px;

            color: #16181d;

            font-size: 14px;

        }


        .detail-section-header span {

            color: #64748b;

            font-size: 11px;

        }


        .detail-list {

            display: flex;

            flex-direction: column;

        }


        .detail-row {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 15px;

            padding: 14px 16px;

            border-bottom:
                1px solid #eef2f7;

        }


        .detail-row:last-child {

            border-bottom: 0;

        }


        .detail-row > div:first-child {

            display: flex;

            flex-direction: column;

            gap: 3px;

        }


        .detail-row strong {

            color: #1e293b;

            font-size: 13px;

        }


        .detail-row small {

            color: #64748b;

            font-size: 11px;

        }


        .detail-row-right {

            display: flex;

            align-items: center;

            gap: 12px;

            text-align: right;

        }


        .detail-row.pending {

            background: #fffbeb;

        }


        .detail-pay-button {

            border: 0;

            border-radius: 8px;

            padding: 7px 10px;

            background: #2563eb;

            color: #fff;

            cursor: pointer;

            font-size: 11px;

            font-weight: 600;

        }


        .detail-empty {

            padding: 20px;

            color: #64748b;

            text-align: center;

            font-size: 12px;

        }


        .success-empty {

            color: #15803d;

        }


        .detail-month {

            padding: 12px 14px;

            border-radius: 9px;

            background: #eff6ff;

            color: #475569;

            font-size: 11px;

        }


        /* =================================================
           MULTAS
        ================================================= */


        .fine-detail-list {

            display: flex;

            flex-direction: column;

            gap: 10px;

            padding: 12px;

        }


        .fine-detail-card {

            padding: 15px;

            border: 1px solid #e2e8f0;

            border-radius: 12px;

            background: #fff;

        }


        .fine-detail-top {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 15px;

            margin-bottom: 14px;

        }


        .fine-detail-top > div {

            display: flex;

            flex-direction: column;

            gap: 4px;

        }


        .fine-detail-top strong {

            color: #16181d;

            font-size: 14px;

        }


        .fine-detail-top span {

            color: #64748b;

            font-size: 11px;

        }


        .fine-detail-amount {

            color: #c2410c !important;

            font-size: 16px !important;

        }


        .fine-detail-info {

            display: grid;

            grid-template-columns:
                1.5fr 1fr 1fr;

            gap: 10px;

            padding: 12px;

            border-radius: 9px;

            background: #f8fafc;

        }


        .fine-detail-info div {

            display: flex;

            flex-direction: column;

            gap: 4px;

        }


        .fine-detail-info span {

            color: #64748b;

            font-size: 10px;

        }


        .fine-detail-info strong {

            color: #334155;

            font-size: 11px;

        }


        .fine-status {

            color: #c2410c !important;

        }


        .fine-detail-actions {

            display: flex;

            justify-content: flex-end;

            gap: 8px;

            margin-top: 12px;

        }


        /* =================================================
           CALENDARIO
        ================================================= */


        .calendar-container {

            width: 100%;

        }


        .calendar-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            margin-bottom: 18px;

        }


        .calendar-nav {

            width: 35px;

            height: 35px;

            border: 0;

            border-radius: 9px;

            background: #eff6ff;

            color: #2563eb;

            font-size: 22px;

            cursor: pointer;

        }


        .calendar-week,

        .calendar-grid {

            display: grid;

            grid-template-columns:
                repeat(7, 1fr);

            gap: 6px;

        }


        .calendar-week {

            margin-bottom: 6px;

        }


        .calendar-week span {

            text-align: center;

            color: #64748b;

            font-size: 11px;

            font-weight: 700;

        }


        .calendar-day {

            min-height: 58px;

            padding: 7px;

            border: 1px solid #e2e8f0;

            border-radius: 9px;

            background: #fff;

            color: #334155;

            cursor: pointer;

            text-align: left;

        }


        .calendar-day:hover {

            border-color: #2563eb;

        }


        .calendar-day.has-reservations {

            background: #eff6ff;

            border-color: #bfdbfe;

        }


        .calendar-day small {

            display: block;

            margin-top: 5px;

            color: #2563eb;

            font-size: 9px;

        }


        .calendar-reservations {

            margin-top: 18px;

            padding-top: 15px;

            border-top:
                1px solid #e2e8f0;

        }


        .calendar-reservation-item {

            display: flex;

            flex-direction: column;

            gap: 3px;

            padding: 11px;

            margin-top: 8px;

            border-radius: 10px;

            background: #f8fafc;

        }


        .calendar-reservation-item span {

            color: #2563eb;

            font-size: 12px;

            font-weight: 600;

        }


        .calendar-reservation-item small {

            color: #64748b;

        }


        @media (max-width: 800px) {

            .detail-summary-grid {

                grid-template-columns:
                    repeat(2, 1fr);

            }

        }


        @media (max-width: 600px) {

            .form-grid {

                grid-template-columns: 1fr;

            }


            .quick-actions-grid {

                grid-template-columns: 1fr;

            }


            #adminModalOverlay {

                padding: 10px;

            }


            .admin-modal {

                max-height: 94vh;

                border-radius: 14px;

            }


            .detail-summary-grid {

                grid-template-columns: 1fr 1fr;

            }


            .detail-row {

                align-items: flex-start;

            }


            .detail-row-right {

                flex-direction: column;

                align-items: flex-end;

                gap: 6px;

            }


            .fine-detail-info {

                grid-template-columns: 1fr;

            }


            .fine-detail-top {

                align-items: flex-start;

            }


            .calendar-day {

                min-height: 48px;

                padding: 5px;

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   IDENTIFICAR ELEMENTOS
========================================================= */

function getDataType(button) {

    if (button.dataset.type) {
        return button.dataset.type;
    }


    const screen =
        button.closest(".screen");


    if (!screen) {
        return null;
    }


    const id =
        screen.id;


    if (id.includes("residents")) {
        return "residents";
    }


    if (id.includes("fines")) {
        return "fines";
    }


    if (id.includes("reservations")) {
        return "reservations";
    }


    if (id.includes("notices")) {
        return "notices";
    }


    if (id.includes("payments")) {
        return "payments";
    }


    return null;

}


function getDataId(button) {

    return (
        button.dataset.id ||
        button.closest("[data-id]")?.dataset.id ||
        null
    );

}


/* =========================================================
   UTILIDADES
========================================================= */

function nextId(array) {

    if (!array.length) {
        return 1;
    }


    return (
        Math.max(
            ...array.map(
                item => Number(item.id) || 0
            )
        ) + 1
    );

}


function todayISO() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


function formatMoney(value) {

    return new Intl.NumberFormat(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }
    ).format(value || 0);

}


function capitalize(text) {

    if (!text) {
        return "";
    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "adminToast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "adminToast";

        toast.innerHTML = `
            <span>✓</span>
            <span class="admin-toast-message"></span>
        `;


        Object.assign(
            toast.style,
            {

                position: "fixed",

                right: "24px",

                bottom: "24px",

                zIndex: "100000",

                display: "flex",

                alignItems: "center",

                gap: "9px",

                padding: "12px 15px",

                background: "#16181d",

                color: "#ffffff",

                borderRadius: "11px",

                boxShadow:
                    "0 10px 30px rgba(15,23,42,.18)",

                fontFamily:
                    '"Inter", sans-serif',

                fontSize: "12px",

                fontWeight: "500",

                opacity: "0",

                transform:
                    "translateY(10px)",

                transition:
                    "opacity .2s ease, transform .2s ease"

            }
        );


        document.body.appendChild(toast);

    }


    const messageElement =
        toast.querySelector(
            ".admin-toast-message"
        );


    if (messageElement) {
        messageElement.textContent =
            message;
    }


    requestAnimationFrame(() => {

        toast.style.opacity = "1";

        toast.style.transform =
            "translateY(0)";

    });


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(() => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(10px)";

        }, 2500);

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 900) {
            closeMobileSidebar();
        }

    }
);


/* =========================================================
   DEBUG
========================================================= */

window.habitAppAdmin = {

    state: adminState,

    data,

    showScreen,

    showToast,

    openResidentModal,

    openPaymentModal,

    openFineModal,

    openReservationModal,

    openCalendarModal,

    openNoticeModal,

    openCollectionDetails,

    openFineDetails

}; 
    /* =========================================================
   HABITAPP ADMIN — EXTENSIÓN PROFESIONAL
   Pegar al FINAL de admin.js
========================================================= */


/* =========================================================
   1. DATOS ADICIONALES
========================================================= */

if (!data.charges) {
    data.charges = [];
}

if (!data.finance) {
    data.finance = {
        billed: 10450000,
        collected: 8970000,
        pending: 1480000
    };
}

if (!data.adminActivity) {
    data.adminActivity = [];
}

if (!data.dashboardSummary) {
    data.dashboardSummary = {
        residents: 124,
        collectionRate: 86,
        pendingFines: 7,
        reservationsToday: 12,
        reservationsThisMonth: 148
    };
}

saveData();


/* =========================================================
   2. UTILIDADES
========================================================= */

function extendedMoney(value) {

    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(Number(value || 0));

}


function extendedDate(date) {

    if (!date) return "-";

    const parts = String(date).split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


function extendedToday() {

    const date = new Date();

    return date.toISOString().split("T")[0];

}


function extendedInitials(name) {

    if (!name) return "?";

    return name
        .split(" ")
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase();

}


function extendedNextId(array) {

    if (!Array.isArray(array) || array.length === 0) {
        return 1;
    }

    return Math.max(
        ...array.map(item => Number(item.id) || 0)
    ) + 1;

}


function extendedEscape(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   3. RESUMEN FINANCIERO
========================================================= */

function getExtendedFinanceSummary() {

    const base = data.finance || {
        billed: 0,
        collected: 0,
        pending: 0
    };

    const charges = Array.isArray(data.charges)
        ? data.charges
        : [];

    let extraBilled = 0;
    let extraCollected = 0;
    let extraPending = 0;

    charges.forEach(charge => {

        const amount = Number(charge.amount || 0);

        extraBilled += amount;

        if (charge.status === "Pagado") {
            extraCollected += amount;
        } else {
            extraPending += amount;
        }

    });

    return {

        billed:
            Number(base.billed || 0) +
            extraBilled,

        collected:
            Number(base.collected || 0) +
            extraCollected,

        pending:
            Number(base.pending || 0) +
            extraPending

    };

}


/* =========================================================
   4. ACTIVIDAD ADMINISTRATIVA
========================================================= */

function addExtendedActivity(activity) {

    if (!data.adminActivity) {
        data.adminActivity = [];
    }

    data.adminActivity.unshift({
        id: Date.now(),
        ...activity
    });

    data.adminActivity =
        data.adminActivity.slice(0, 40);

}


/* =========================================================
   5. MODAL — REGISTRAR COBRO
========================================================= */

function openExtendedChargeModal() {

    const residents = data.residents || [];

    openModal(

        "Registrar cobro",

        `

        <form id="extendedChargeForm">

            <div class="extended-form-grid">

                <div class="extended-form-group">

                    <label>
                        Residente
                    </label>

                    <select
                        name="resident"
                        required
                    >

                        <option value="">
                            Seleccionar residente
                        </option>

                        ${residents.map(resident => `

                            <option value="${extendedEscape(resident.name)}">

                                ${extendedEscape(resident.name)}
                                — Depto ${extendedEscape(resident.apartment)}

                            </option>

                        `).join("")}

                    </select>

                </div>


                <div class="extended-form-group">

                    <label>
                        Concepto
                    </label>

                    <input
                        type="text"
                        name="concept"
                        placeholder="Ej: Gasto común septiembre"
                        required
                    >

                </div>


                <div class="extended-form-group">

                    <label>
                        Monto
                    </label>

                    <input
                        type="number"
                        name="amount"
                        min="1"
                        placeholder="84500"
                        required
                    >

                </div>


                <div class="extended-form-group">

                    <label>
                        Fecha
                    </label>

                    <input
                        type="date"
                        name="date"
                        value="${extendedToday()}"
                        required
                    >

                </div>


                <div class="extended-form-group">

                    <label>
                        Estado
                    </label>

                    <select name="status">

                        <option value="Pendiente">
                            Pendiente
                        </option>

                        <option value="Pagado">
                            Pagado
                        </option>

                    </select>

                </div>

            </div>


            <div class="extended-info-box">

                <strong>
                    💰 Registro financiero
                </strong>

                <span>
                    El cobro se incorporará automáticamente
                    a la recaudación y reportes.
                </span>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit"
                >
                    Registrar cobro
                </button>

            </div>

        </form>

        `
    );


    const form =
        document.getElementById(
            "extendedChargeForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const formData =
                new FormData(form);

            const residentName =
                formData.get("resident");

            const resident =
                data.residents.find(
                    item =>
                        item.name === residentName
                );

            const amount =
                Number(
                    formData.get("amount")
                );

            if (!resident || amount <= 0) {

                showToast(
                    "Completa correctamente los datos."
                );

                return;
            }


            const charge = {

                id:
                    extendedNextId(
                        data.charges
                    ),

                resident:
                    resident.name,

                apartment:
                    resident.apartment,

                concept:
                    formData.get("concept"),

                amount,

                date:
                    formData.get("date"),

                status:
                    formData.get("status")

            };


            data.charges.push(charge);


            resident.payment =
                charge.status === "Pagado"
                    ? "Pagado"
                    : "Pendiente";


            addExtendedActivity({

                type: "Cobro",

                description:
                    `${resident.name} — ${charge.concept}`,

                amount:

                    charge.amount,

                status:
                    charge.status,

                date:
                    charge.date

            });


            saveData();

            refreshInterface();

            closeModal();


            showToast(
                charge.status === "Pagado"
                    ? "Cobro registrado como pagado."
                    : "Cobro pendiente registrado."
            );

        }
    );

}


/* =========================================================
   6. MODAL — NUEVA PUBLICACIÓN
========================================================= */

function openExtendedPostModal() {

    openModal(

        "Nueva publicación",

        `

        <form id="extendedPostForm">

            <div class="extended-form-group">

                <label>
                    Título
                </label>

                <input
                    type="text"
                    name="title"
                    placeholder="Ej: Mantención de ascensores"
                    required
                >

            </div>


            <div class="extended-form-group">

                <label>
                    Contenido
                </label>

                <textarea
                    name="content"
                    rows="6"
                    placeholder="Escribe la información para los residentes..."
                    required
                ></textarea>

            </div>


            <div class="extended-info-box">

                <strong>
                    📢 Publicación comunitaria
                </strong>

                <span>
                    La publicación aparecerá en la sección
                    Comunidad como emitida por Administración.
                </span>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="modal-cancel"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="modal-submit"
                >
                    Publicar
                </button>

            </div>

        </form>

        `
    );


    const form =
        document.getElementById(
            "extendedPostForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const formData =
                new FormData(form);


            if (!data.posts) {
                data.posts = [];
            }


            const post = {

                id:
                    extendedNextId(
                        data.posts
                    ),

                author:
                    "Administración",

                title:
                    formData.get("title"),

                content:
                    formData.get("content"),

                date:
                    extendedToday()

            };


            data.posts.push(post);


            addExtendedActivity({

                type: "Publicación",

                description:
                    post.title,

                status:
                    "Publicado",

                date:
                    post.date

            });


            saveData();

            refreshInterface();

            closeModal();


            showToast(
                "Publicación creada correctamente."
            );

        }
    );

}


/* =========================================================
   7. BOTONES EXTRA
========================================================= */

function setupExtendedAdminButtons() {

    if (
        window.__habitAppExtendedButtons
    ) {
        return;
    }

    window.__habitAppExtendedButtons = true;


    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "button, a"
                );

            if (!button) return;


            const text =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (

                text.includes("registrar cobro") ||
                text.includes("nuevo cobro") ||
                text.includes("crear cobro") ||
                text.includes("registrar deuda") ||
                text.includes("nueva deuda")

            ) {

                event.preventDefault();

                event.stopImmediatePropagation();

                openExtendedChargeModal();

                return;

            }


            if (

                text.includes("nueva publicación") ||
                text.includes("nueva publicacion") ||
                text.includes("crear publicación") ||
                text.includes("crear publicacion") ||
                text.includes("agregar publicación") ||
                text.includes("agregar publicacion")

            ) {

                event.preventDefault();

                event.stopImmediatePropagation();

                openExtendedPostModal();

                return;

            }

        },
        true
    );

}


/* =========================================================
   8. DETALLE DE RECAUDACIÓN
========================================================= */

function openExtendedCollectionModal() {

    const summary =
        getExtendedFinanceSummary();


    const percentage =
        summary.billed > 0
            ? Math.round(
                (
                    summary.collected /
                    summary.billed
                ) * 100
            )
            : 0;


    const payments =
        data.payments || [];

    const charges =
        data.charges || [];


    const paid = [

        ...payments
            .filter(
                item =>
                    item.status === "Pagado"
            )
            .map(item => ({

                ...item,

                concept:
                    "Pago registrado",

                source:
                    "payment"

            })),

        ...charges
            .filter(
                item =>
                    item.status === "Pagado"
            )
            .map(item => ({

                ...item,

                source:
                    "charge"

            }))

    ];


    const pending = [

        ...payments
            .filter(
                item =>
                    item.status !== "Pagado"
            )
            .map(item => ({

                ...item,

                concept:
                    "Pago pendiente",

                source:
                    "payment"

            })),

        ...charges
            .filter(
                item =>
                    item.status !== "Pagado"
            )
            .map(item => ({

                ...item,

                source:
                    "charge"

            }))

    ];


    openModal(

        "Recaudación y pagos",

        `

        <div class="extended-finance">

            <div class="extended-finance-kpis">

                <div>

                    <span>
                        Facturado
                    </span>

                    <strong>
                        ${extendedMoney(summary.billed)}
                    </strong>

                </div>


                <div class="positive">

                    <span>
                        Recaudado
                    </span>

                    <strong>
                        ${extendedMoney(summary.collected)}
                    </strong>

                </div>


                <div class="warning">

                    <span>
                        Pendiente
                    </span>

                    <strong>
                        ${extendedMoney(summary.pending)}
                    </strong>

                </div>


                <div>

                    <span>
                        Recaudación
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>

            </div>


            <div class="extended-progress">

                <div class="extended-progress-header">

                    <strong>
                        Nivel de recaudación
                    </strong>

                    <span>
                        ${percentage}%
                    </span>

                </div>


                <div class="extended-progress-track">

                    <div
                        style="width:${Math.min(percentage, 100)}%"
                    ></div>

                </div>

            </div>


            <div class="extended-finance-columns">

                <div class="extended-finance-list">

                    <div class="extended-list-header">

                        <div>

                            <h3>
                                Pagados
                            </h3>

                            <span>
                                Residentes que han pagado
                            </span>

                        </div>

                        <strong>
                            ${paid.length}
                        </strong>

                    </div>


                    ${
                        paid.length

                        ?

                        paid.map(item => `

                            <div class="extended-person-row">

                                <div class="extended-person">

                                    <div class="extended-avatar">

                                        ${extendedInitials(
                                            item.resident
                                        )}

                                    </div>

                                    <div>

                                        <strong>
                                            ${extendedEscape(
                                                item.resident
                                            )}
                                        </strong>

                                        <span>
                                            Depto ${extendedEscape(
                                                item.apartment
                                            )}
                                        </span>

                                        <small>
                                            ${extendedEscape(
                                                item.concept
                                            )}
                                        </small>

                                    </div>

                                </div>


                                <div class="extended-person-right">

                                    <strong>
                                        ${extendedMoney(
                                            item.amount
                                        )}
                                    </strong>

                                    <span>
                                        ${extendedDate(
                                            item.date
                                        )}
                                    </span>

                                    <em class="extended-paid">
                                        Pagado
                                    </em>

                                </div>

                            </div>

                        `).join("")

                        :

                        `

                            <div class="extended-empty">
                                No existen pagos registrados.
                            </div>

                        `
                    }

                </div>


                <div class="extended-finance-list">

                    <div class="extended-list-header">

                        <div>

                            <h3>
                                Pendientes
                            </h3>

                            <span>
                                Residentes con deuda
                            </span>

                        </div>

                        <strong>
                            ${pending.length}
                        </strong>

                    </div>


                    ${
                        pending.length

                        ?

                        pending.map(item => `

                            <div class="extended-person-row pending">

                                <div class="extended-person">

                                    <div class="extended-avatar pending">
                                        ${extendedInitials(
                                            item.resident
                                        )}
                                    </div>

                                    <div>

                                        <strong>
                                            ${extendedEscape(
                                                item.resident
                                            )}
                                        </strong>

                                        <span>
                                            Depto ${extendedEscape(
                                                item.apartment
                                            )}
                                        </span>

                                        <small>
                                            ${extendedEscape(
                                                item.concept
                                            )}
                                        </small>

                                    </div>

                                </div>


                                <div class="extended-person-right">

                                    <strong>
                                        ${extendedMoney(
                                            item.amount
                                        )}
                                    </strong>

                                    <span>
                                        ${extendedDate(
                                            item.date
                                        )}
                                    </span>

                                    <em class="extended-pending">
                                        Pendiente
                                    </em>

                                </div>

                            </div>

                        `).join("")

                        :

                        `

                            <div class="extended-empty success">
                                No existen pagos pendientes.
                            </div>

                        `
                    }

                </div>

            </div>


            <div class="extended-finance-footer">

                <span>
                    Resumen financiero de HabitApp
                </span>

                <strong>
                    ${paid.length} pagos registrados ·
                    ${pending.length} pendientes
                </strong>

            </div>

        </div>

        `
    );

}


/* =========================================================
   9. REPORTES
========================================================= */

function renderExtendedReports() {

    const screen =
        document.getElementById(
            "screen-reports"
        );

    if (!screen) return;


    const summary =
        getExtendedFinanceSummary();


    const reservations =
        data.reservations || [];

    const fines =
        data.fines || [];

    const charges =
        data.charges || [];


    const confirmedReservations =
        reservations.filter(
            item =>
                item.status !== "Cancelada"
        );


    const cancelledReservations =
        reservations.filter(
            item =>
                item.status === "Cancelada"
        );


    const pendingFines =
        fines.filter(
            item =>
                item.status === "Pendiente"
        );


    const totalFines =
        pendingFines.reduce(
            (total, fine) =>
                total +
                Number(fine.amount || 0),
            0
        );


    const collectionPercentage =
        summary.billed > 0
            ? Math.round(
                (
                    summary.collected /
                    summary.billed
                ) * 100
            )
            : 0;


    const spaces = [

        "Quincho 1",
        "Quincho 2",
        "Salón Multiuso 1",
        "Salón Multiuso 2",
        "Cancha"

    ];


    const spaceStats =
        spaces.map(space => ({

            name: space,

            count:
                reservations.filter(
                    item =>
                        item.space === space &&
                        item.status !== "Cancelada"
                ).length

        }));


    const maxSpace =
        Math.max(
            1,
            ...spaceStats.map(
                item => item.count
            )
        );


    const activities =
        data.adminActivity || [];


    screen.innerHTML = `

        <div class="extended-reports">

            <div class="extended-reports-header">

                <div>

                    <span class="extended-eyebrow">
                        ADMINISTRACIÓN
                    </span>

                    <h1>
                        Reportes y estadísticas
                    </h1>

                    <p>
                        Información general sobre la gestión
                        financiera y operativa del condominio.
                    </p>

                </div>


                <div class="extended-report-actions">

                    <button
                        type="button"
                        id="extendedRefreshReport"
                        class="extended-secondary-button"
                    >
                        ↻ Actualizar
                    </button>


                    <button
                        type="button"
                        id="extendedExportReport"
                        class="extended-primary-button"
                    >
                        ↓ Exportar CSV
                    </button>

                </div>

            </div>


            <!-- INDICADORES -->

            <div class="extended-report-kpis">

                <div class="extended-report-card blue">

                    <div class="extended-report-icon">
                        $
                    </div>

                    <div>

                        <span>
                            Recaudado
                        </span>

                        <strong>
                            ${extendedMoney(
                                summary.collected
                            )}
                        </strong>

                        <small>
                            ${collectionPercentage}% del total
                        </small>

                    </div>

                </div>


                <div class="extended-report-card orange">

                    <div class="extended-report-icon">
                        !
                    </div>

                    <div>

                        <span>
                            Pendiente
                        </span>

                        <strong>
                            ${extendedMoney(
                                summary.pending
                            )}
                        </strong>

                        <small>
                            Montos por cobrar
                        </small>

                    </div>

                </div>


                <div class="extended-report-card purple">

                    <div class="extended-report-icon">
                        R
                    </div>

                    <div>

                        <span>
                            Reservas
                        </span>

                        <strong>
                            ${confirmedReservations.length}
                        </strong>

                        <small>
                            Reservas confirmadas
                        </small>

                    </div>

                </div>


                <div class="extended-report-card red">

                    <div class="extended-report-icon">
                        M
                    </div>

                    <div>

                        <span>
                            Multas
                        </span>

                        <strong>
                            ${pendingFines.length}
                        </strong>

                        <small>
                            ${extendedMoney(
                                totalFines
                            )}
                            pendientes
                        </small>

                    </div>

                </div>

            </div>


            <!-- PRINCIPAL -->

            <div class="extended-report-grid">

                <!-- RECAUDACIÓN -->

                <section class="extended-report-panel">

                    <div class="extended-panel-header">

                        <div>

                            <h2>
                                Recaudación
                            </h2>

                            <span>
                                Estado financiero
                            </span>

                        </div>


                        <button
                            type="button"
                            id="extendedOpenCollection"
                            class="extended-link-button"
                        >
                            Ver detalle
                        </button>

                    </div>


                    <div class="extended-total-box">

                        <div>

                            <span>
                                Total recaudado
                            </span>

                            <strong>
                                ${extendedMoney(
                                    summary.collected
                                )}
                            </strong>

                        </div>


                        <div class="extended-percentage">
                            ${collectionPercentage}%
                        </div>

                    </div>


                    <div class="extended-big-progress">

                        <div
                            style="width:${Math.min(
                                collectionPercentage,
                                100
                            )}%"
                        ></div>

                    </div>


                    <div class="extended-legend">

                        <div>

                            <i class="paid-dot"></i>

                            <span>
                                Recaudado
                            </span>

                            <strong>
                                ${extendedMoney(
                                    summary.collected
                                )}
                            </strong>

                        </div>


                        <div>

                            <i class="pending-dot"></i>

                            <span>
                                Pendiente
                            </span>

                            <strong>
                                ${extendedMoney(
                                    summary.pending
                                )}
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ESPACIOS -->

                <section class="extended-report-panel">

                    <div class="extended-panel-header">

                        <div>

                            <h2>
                                Uso de espacios
                            </h2>

                            <span>
                                Reservas por área común
                            </span>

                        </div>

                    </div>


                    <div class="extended-space-list">

                        ${
                            spaceStats.map(
                                space => {

                                    const width =
                                        Math.round(
                                            (
                                                space.count /
                                                maxSpace
                                            ) * 100
                                        );


                                    return `

                                        <div class="extended-space-item">

                                            <div>

                                                <span>
                                                    ${extendedEscape(
                                                        space.name
                                                    )}
                                                </span>

                                                <strong>
                                                    ${space.count}
                                                </strong>

                                            </div>


                                            <div class="extended-space-track">

                                                <div
                                                    style="width:${width}%"
                                                ></div>

                                            </div>

                                        </div>

                                    `;

                                }
                            ).join("")
                        }

                    </div>

                </section>

            </div>


            <!-- SEGUNDA FILA -->

            <div class="extended-three-grid">

                <section class="extended-report-panel">

                    <div class="extended-panel-header">

                        <div>

                            <h2>
                                Pagos
                            </h2>

                            <span>
                                Registros financieros
                            </span>

                        </div>

                    </div>


                    <div class="extended-stat-list">

                        <div>

                            <span>
                                Cobros nuevos
                            </span>

                            <strong>
                                ${charges.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Pagos registrados
                            </span>

                            <strong>
                                ${
                                    (data.payments || [])
                                        .filter(
                                            item =>
                                                item.status === "Pagado"
                                        ).length
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Pendientes
                            </span>

                            <strong>
                                ${
                                    (data.payments || [])
                                        .filter(
                                            item =>
                                                item.status !== "Pagado"
                                        ).length
                                }
                            </strong>

                        </div>

                    </div>

                </section>


                <section class="extended-report-panel">

                    <div class="extended-panel-header">

                        <div>

                            <h2>
                                Reservas
                            </h2>

                            <span>
                                Estado actual
                            </span>

                        </div>

                    </div>


                    <div class="extended-reservation-stats">

                        <div class="confirmed">

                            <strong>
                                ${confirmedReservations.length}
                            </strong>

                            <span>
                                Confirmadas
                            </span>

                        </div>


                        <div class="cancelled">

                            <strong>
                                ${cancelledReservations.length}
                            </strong>

                            <span>
                                Canceladas
                            </span>

                        </div>

                    </div>

                </section>


                <section class="extended-report-panel">

                    <div class="extended-panel-header">

                        <div>

                            <h2>
                                Multas
                            </h2>

                            <span>
                                Situación actual
                            </span>

                        </div>

                    </div>


                    <div class="extended-fine-summary">

                        <div>

                            <span>
                                Pendientes
                            </span>

                            <strong>
                                ${pendingFines.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Monto
                            </span>

                            <strong>
                                ${extendedMoney(
                                    totalFines
                                )}
                            </strong>

                        </div>

                    </div>


                    <button
                        type="button"
                        id="extendedOpenFines"
                        class="extended-wide-button"
                    >
                        Revisar multas
                    </button>

                </section>

            </div>


            <!-- ACTIVIDAD -->

            <section class="extended-report-panel extended-activity-panel">

                <div class="extended-panel-header">

                    <div>

                        <h2>
                            Actividad administrativa
                        </h2>

                        <span>
                            Últimos movimientos realizados
                        </span>

                    </div>

                </div>


                <div class="extended-activity-list">

                    ${
                        activities.length

                        ?

                        activities
                            .slice(0, 10)
                            .map(activity => `

                                <div class="extended-activity-row">

                                    <div class="extended-activity-icon">
                                        ${getExtendedActivityIcon(
                                            activity.type
                                        )}
                                    </div>


                                    <div class="extended-activity-content">

                                        <strong>
                                            ${extendedEscape(
                                                activity.type
                                            )}
                                        </strong>

                                        <span>
                                            ${extendedEscape(
                                                activity.description ||
                                                "Actividad administrativa"
                                            )}
                                        </span>

                                    </div>


                                    <div class="extended-activity-meta">

                                        ${
                                            activity.amount

                                                ?

                                                `<strong>
                                                    ${extendedMoney(
                                                        activity.amount
                                                    )}
                                                </strong>`

                                                :

                                                ""
                                        }

                                        <span>
                                            ${extendedDate(
                                                activity.date
                                            )}
                                        </span>

                                    </div>

                                </div>

                            `)
                            .join("")

                        :

                        `

                            <div class="extended-empty-activity">

                                <div>
                                    ✓
                                </div>

                                <strong>
                                    No hay actividad adicional
                                </strong>

                                <span>
                                    Las nuevas acciones administrativas
                                    aparecerán aquí.
                                </span>

                            </div>

                        `
                    }

                </div>

            </section>


            <!-- ALERTAS -->

            <div class="extended-alert-grid">

                <div class="extended-alert blue">

                    <div>
                        $
                    </div>

                    <section>

                        <strong>
                            Seguimiento financiero
                        </strong>

                        <span>
                            Actualmente existen
                            ${extendedMoney(summary.pending)}
                            pendientes por recaudar.
                        </span>

                    </section>

                </div>


                <div class="extended-alert orange">

                    <div>
                        !
                    </div>

                    <section>

                        <strong>
                            Atención administrativa
                        </strong>

                        <span>
                            Hay ${pendingFines.length}
                            multa${pendingFines.length !== 1 ? "s" : ""}
                            pendiente${pendingFines.length !== 1 ? "s" : ""}.
                        </span>

                    </section>

                </div>

            </div>

        </div>

    `;


    setupExtendedReportEvents();

}


/* =========================================================
   10. EVENTOS DE REPORTES
========================================================= */

function setupExtendedReportEvents() {

    const refresh =
        document.getElementById(
            "extendedRefreshReport"
        );

    const exportButton =
        document.getElementById(
            "extendedExportReport"
        );

    const collection =
        document.getElementById(
            "extendedOpenCollection"
        );

    const fines =
        document.getElementById(
            "extendedOpenFines"
        );


    if (refresh) {

        refresh.onclick = function() {

            renderExtendedReports();

            showToast(
                "Reporte actualizado."
            );

        };

    }


    if (exportButton) {

        exportButton.onclick =
            exportExtendedReportCSV;

    }


    if (collection) {

        collection.onclick =
            openExtendedCollectionModal;

    }


    if (fines) {

        fines.onclick = function() {

            if (
                typeof openFineDetails ===
                "function"
            ) {

                openFineDetails();

            }

        };

    }

}


/* =========================================================
   11. EXPORTAR CSV
========================================================= */

function exportExtendedReportCSV() {

    const summary =
        getExtendedFinanceSummary();


    const rows = [];


    rows.push([
        "TIPO",
        "RESIDENTE",
        "DEPARTAMENTO",
        "CONCEPTO",
        "MONTO",
        "FECHA",
        "ESTADO"
    ]);


    (data.payments || [])
        .forEach(payment => {

            rows.push([

                "Pago",

                payment.resident,

                payment.apartment,

                "Pago registrado",

                payment.amount,

                payment.date,

                payment.status

            ]);

        });


    (data.charges || [])
        .forEach(charge => {

            rows.push([

                "Cobro",

                charge.resident,

                charge.apartment,

                charge.concept,

                charge.amount,

                charge.date,

                charge.status

            ]);

        });


    (data.fines || [])
        .forEach(fine => {

            rows.push([

                "Multa",

                fine.resident,

                fine.apartment,

                fine.reason,

                fine.amount,

                fine.date,

                fine.status

            ]);

        });


    const csv =
        rows
            .map(row =>
                row.map(value => {

                    const text =
                        String(value ?? "");

                    return `"${text.replace(
                        /"/g,
                        '""'
                    )}"`;

                }).join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [
                "\uFEFF" + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        `habitapp-reporte-${extendedToday()}.csv`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);


    showToast(
        "Reporte CSV exportado correctamente."
    );

}


/* =========================================================
   12. ICONOS DE ACTIVIDAD
========================================================= */

function getExtendedActivityIcon(type) {

    switch (String(type).toLowerCase()) {

        case "cobro":
            return "$";

        case "publicación":
        case "publicacion":
            return "P";

        case "residente":
            return "R";

        case "reserva":
            return "C";

        case "multa":
            return "!";

        default:
            return "•";

    }

}


/* =========================================================
   13. DASHBOARD — ACTUALIZACIÓN FINANCIERA
========================================================= */

const habitAppOriginalUpdateDashboard =
    updateDashboard;


updateDashboard = function() {

    habitAppOriginalUpdateDashboard();


    const summary =
        getExtendedFinanceSummary();


    const cards =
        document.querySelectorAll(
            ".stat-card"
        );


    cards.forEach(card => {

        const label =
            card.textContent
                .trim()
                .toLowerCase();


        const number =
            card.querySelector(
                ".stat-number"
            );


        if (!number) return;


        if (
            label.includes("recaudación")
        ) {

            number.textContent =
                extendedMoney(
                    summary.collected
                );

        }


        if (
            label.includes("cobranza") ||
            label.includes("cobrado") ||
            label.includes("pagos")
        ) {

            const percentage =
                summary.billed > 0
                    ? Math.round(
                        (
                            summary.collected /
                            summary.billed
                        ) * 100
                    )
                    : 0;

            number.textContent =
                `${percentage}%`;

        }

    });

};


/* =========================================================
   14. PUBLICACIONES EN COMUNIDAD
========================================================= */

function renderExtendedCommunityPosts() {

    const screen =
        document.getElementById(
            "screen-community"
        );

    if (!screen) return;


    let container =
        screen.querySelector(
            ".extended-community-posts"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "extended-community-posts";

        screen.appendChild(container);

    }


    const posts =
        data.posts || [];


    container.innerHTML = `

        <div class="extended-community-header">

            <div>

                <span>
                    COMUNIDAD
                </span>

                <h2>
                    Publicaciones recientes
                </h2>

                <p>
                    Comunicaciones realizadas por la administración
                    y residentes.
                </p>

            </div>


            <button
                type="button"
                class="extended-community-button"
                id="extendedNewPost"
            >
                + Nueva publicación
            </button>

        </div>


        <div class="extended-post-list">

            ${
                posts.length

                ?

                [...posts]
                    .reverse()
                    .slice(0, 8)
                    .map(post => `

                        <article class="extended-post">

                            <div class="extended-post-top">

                                <div class="extended-post-avatar">

                                    ${extendedInitials(
                                        post.author
                                    )}

                                </div>


                                <div>

                                    <strong>
                                        ${extendedEscape(
                                            post.author
                                        )}
                                    </strong>

                                    <span>
                                        ${extendedDate(
                                            post.date
                                        )}
                                    </span>

                                </div>

                            </div>


                            <h3>
                                ${extendedEscape(
                                    post.title
                                )}
                            </h3>


                            <p>
                                ${extendedEscape(
                                    post.content
                                )}
                            </p>

                        </article>

                    `)
                    .join("")

                :

                `

                    <div class="extended-empty-community">

                        <strong>
                            No hay publicaciones
                        </strong>

                        <span>
                            Crea la primera publicación para la comunidad.
                        </span>

                    </div>

                `
            }

        </div>

    `;


    const button =
        document.getElementById(
            "extendedNewPost"
        );


    if (button) {

        button.onclick =
            openExtendedPostModal;

    }

}


/* =========================================================
   15. REFRESH GENERAL
========================================================= */

const habitAppOriginalRefresh =
    refreshInterface;


refreshInterface = function() {

    habitAppOriginalRefresh();


    setTimeout(
        function() {

            renderExtendedReports();

            renderExtendedCommunityPosts();

        },
        0
    );

};


/* =========================================================
   16. ESTILOS ADICIONALES
========================================================= */

function addExtendedAdminStyles() {

    if (
        document.getElementById(
            "habitappExtendedStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "habitappExtendedStyles";


    style.textContent = `

        /* =============================================
           FORMULARIOS
        ============================================= */

        .extended-form-grid {

            display: grid;

            grid-template-columns:
                repeat(2, minmax(0, 1fr));

            gap: 18px;

        }


        .extended-form-group {

            display: flex;

            flex-direction: column;

            gap: 7px;

        }


        .extended-form-group label {

            font-size: 13px;

            font-weight: 700;

            color: #334155;

        }


        .extended-form-group input,
        .extended-form-group select,
        .extended-form-group textarea {

            width: 100%;

            border: 1px solid #dbe3ef;

            border-radius: 10px;

            padding: 11px 13px;

            font-family: inherit;

            font-size: 14px;

            background: #fff;

            color: #16181d;

            outline: none;

        }


        .extended-form-group textarea {

            resize: vertical;

        }


        .extended-form-group input:focus,
        .extended-form-group select:focus,
        .extended-form-group textarea:focus {

            border-color: #2563eb;

            box-shadow:
                0 0 0 3px
                rgba(37,99,235,.10);

        }


        .extended-info-box {

            display: flex;

            flex-direction: column;

            gap: 4px;

            margin-top: 18px;

            padding: 14px 16px;

            border-radius: 12px;

            background: #eff6ff;

            border: 1px solid #dbeafe;

        }


        .extended-info-box strong {

            color: #1d4ed8;

            font-size: 13px;

        }


        .extended-info-box span {

            color: #64748b;

            font-size: 12px;

        }


        /* =============================================
           FINANZAS
        ============================================= */

        .extended-finance {

            display: flex;

            flex-direction: column;

            gap: 22px;

        }


        .extended-finance-kpis {

            display: grid;

            grid-template-columns:
                repeat(4, minmax(0,1fr));

            gap: 12px;

        }


        .extended-finance-kpis > div {

            padding: 16px;

            border-radius: 13px;

            background: #f8fafc;

            border: 1px solid #e2e8f0;

        }


        .extended-finance-kpis span {

            display: block;

            color: #64748b;

            font-size: 11px;

            font-weight: 600;

            margin-bottom: 7px;

        }


        .extended-finance-kpis strong {

            font-size: 18px;

            color: #0f172a;

        }


        .extended-finance-kpis .positive strong {

            color: #16a34a;

        }


        .extended-finance-kpis .warning strong {

            color: #d97706;

        }


        .extended-progress {

            padding: 16px;

            border: 1px solid #e2e8f0;

            border-radius: 13px;

        }


        .extended-progress-header {

            display: flex;

            justify-content: space-between;

            margin-bottom: 10px;

            font-size: 13px;

        }


        .extended-progress-header span {

            color: #2563eb;

            font-weight: 700;

        }


        .extended-progress-track {

            height: 9px;

            background: #e2e8f0;

            border-radius: 99px;

            overflow: hidden;

        }


        .extended-progress-track > div {

            height: 100%;

            background: #2563eb;

            border-radius: inherit;

        }


        .extended-finance-columns {

            display: grid;

            grid-template-columns:
                repeat(2, minmax(0,1fr));

            gap: 18px;

        }


        .extended-finance-list {

            border: 1px solid #e2e8f0;

            border-radius: 14px;

            overflow: hidden;

        }


        .extended-list-header {

            padding: 16px;

            display: flex;

            justify-content: space-between;

            align-items: center;

            background: #f8fafc;

            border-bottom: 1px solid #e2e8f0;

        }


        .extended-list-header h3 {

            margin: 0 0 3px;

            font-size: 14px;

            color: #0f172a;

        }


        .extended-list-header span {

            font-size: 11px;

            color: #64748b;

        }


        .extended-list-header > strong {

            font-size: 18px;

            color: #2563eb;

        }


        .extended-person-row {

            display: flex;

            justify-content: space-between;

            align-items: center;

            gap: 15px;

            padding: 14px 16px;

            border-bottom: 1px solid #f1f5f9;

        }


        .extended-person-row:last-child {

            border-bottom: 0;

        }


        .extended-person {

            display: flex;

            align-items: center;

            gap: 10px;

            min-width: 0;

        }


        .extended-avatar {

            width: 38px;

            height: 38px;

            border-radius: 50%;

            display: flex;

            align-items: center;

            justify-content: center;

            background: #dbeafe;

            color: #1d4ed8;

            font-size: 11px;

            font-weight: 800;

            flex-shrink: 0;

        }


        .extended-avatar.pending {

            background: #fef3c7;

            color: #b45309;

        }


        .extended-person > div:last-child {

            display: flex;

            flex-direction: column;

            min-width: 0;

        }


        .extended-person strong {

            font-size: 13px;

            color: #0f172a;

        }


        .extended-person span {

            font-size: 11px;

            color: #64748b;

        }


        .extended-person small {

            margin-top: 2px;

            font-size: 10px;

            color: #94a3b8;

        }


        .extended-person-right {

            display: flex;

            flex-direction: column;

            align-items: flex-end;

            gap: 2px;

            flex-shrink: 0;

        }


        .extended-person-right strong {

            font-size: 13px;

            color: #0f172a;

        }


        .extended-person-right span {

            font-size: 10px;

            color: #94a3b8;

        }


        .extended-person-right em {

            font-size: 9px;

            font-style: normal;

            font-weight: 700;

            padding: 3px 7px;

            border-radius: 99px;

        }


        .extended-paid {

            color: #15803d;

            background: #dcfce7;

        }


        .extended-pending {

            color: #b45309;

            background: #fef3c7;

        }


        .extended-empty {

            padding: 28px;

            text-align: center;

            color: #94a3b8;

            font-size: 13px;

        }


        .extended-empty.success {

            color: #16a34a;

        }


        .extended-finance-footer {

            display: flex;

            justify-content: space-between;

            gap: 15px;

            padding: 14px 16px;

            border-radius: 12px;

            background: #f8fafc;

            color: #64748b;

            font-size: 11px;

        }


        .extended-finance-footer strong {

            color: #334155;

        }


        /* =============================================
           REPORTES
        ============================================= */

        .extended-reports {

            display: flex;

            flex-direction: column;

            gap: 22px;

        }


        .extended-reports-header {

            display: flex;

            justify-content: space-between;

            align-items: flex-start;

            gap: 20px;

        }


        .extended-eyebrow {

            color: #2563eb;

            font-size: 10px;

            font-weight: 800;

            letter-spacing: .12em;

        }


        .extended-reports-header h1 {

            margin: 5px 0 5px;

            font-size: 27px;

            color: #0f172a;

        }


        .extended-reports-header p {

            margin: 0;

            color: #64748b;

            font-size: 13px;

        }


        .extended-report-actions {

            display: flex;

            gap: 9px;

        }


        .extended-primary-button,
        .extended-secondary-button {

            border: 0;

            border-radius: 9px;

            padding: 10px 14px;

            cursor: pointer;

            font-family: inherit;

            font-size: 12px;

            font-weight: 700;

        }


        .extended-primary-button {

            background: #2563eb;

            color: #fff;

        }


        .extended-secondary-button {

            background: #fff;

            color: #334155;

            border: 1px solid #dbe3ef;

        }


        .extended-report-kpis {

            display: grid;

            grid-template-columns:
                repeat(4, minmax(0,1fr));

            gap: 14px;

        }


        .extended-report-card {

            display: flex;

            align-items: center;

            gap: 13px;

            padding: 18px;

            background: #fff;

            border: 1px solid #e2e8f0;

            border-radius: 15px;

            box-shadow:
                0 5px 16px
                rgba(15,23,42,.04);

        }


        .extended-report-icon {

            width: 42px;

            height: 42px;

            border-radius: 11px;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 16px;

            font-weight: 800;

            flex-shrink: 0;

        }


        .extended-report-card.blue
        .extended-report-icon {

            background: #dbeafe;

            color: #2563eb;

        }


        .extended-report-card.orange
        .extended-report-icon {

            background: #fef3c7;

            color: #d97706;

        }


        .extended-report-card.purple
        .extended-report-icon {

            background: #ede9fe;

            color: #7c3aed;

        }


        .extended-report-card.red
        .extended-report-icon {

            background: #fee2e2;

            color: #dc2626;

        }


        .extended-report-card span {

            display: block;

            font-size: 11px;

            color: #64748b;

        }


        .extended-report-card strong {

            display: block;

            margin: 3px 0;

            font-size: 20px;

            color: #0f172a;

        }


        .extended-report-card small {

            font-size: 10px;

            color: #94a3b8;

        }


        .extended-report-grid {

            display: grid;

            grid-template-columns:
                1.15fr .85fr;

            gap: 18px;

        }


        .extended-three-grid {

            display: grid;

            grid-template-columns:
                repeat(3, minmax(0,1fr));

            gap: 18px;

        }


        .extended-report-panel {

            background: #fff;

            border: 1px solid #e2e8f0;

            border-radius: 15px;

            padding: 20px;

            box-shadow:
                0 5px 16px
                rgba(15,23,42,.035);

        }


        .extended-panel-header {

            display: flex;

            justify-content: space-between;

            align-items: flex-start;

            gap: 12px;

            margin-bottom: 18px;

        }


        .extended-panel-header h2 {

            margin: 0 0 4px;

            font-size: 15px;

            color: #0f172a;

        }


        .extended-panel-header span {

            color: #64748b;

            font-size: 11px;

        }


        .extended-link-button {

            border: 0;

            background: #eff6ff;

            color: #2563eb;

            padding: 7px 10px;

            border-radius: 7px;

            font-size: 11px;

            font-weight: 700;

            cursor: pointer;

        }


        .extended-total-box {

            display: flex;

            justify-content: space-between;

            align-items: center;

            margin-bottom: 14px;

        }


        .extended-total-box span {

            display: block;

            font-size: 11px;

            color: #64748b;

        }


        .extended-total-box strong {

            display: block;

            margin-top: 3px;

            font-size: 25px;

            color: #0f172a;

        }


        .extended-percentage {

            font-size: 20px;

            font-weight: 800;

            color: #2563eb;

        }


        .extended-big-progress {

            height: 10px;

            background: #e2e8f0;

            border-radius: 99px;

            overflow: hidden;

        }


        .extended-big-progress > div {

            height: 100%;

            background: #2563eb;

            border-radius: inherit;

        }


        .extended-legend {

            display: grid;

            grid-template-columns:
                repeat(2,1fr);

            gap: 15px;

            margin-top: 20px;

        }


        .extended-legend > div {

            display: grid;

            grid-template-columns:
                8px 1fr auto;

            align-items: center;

            gap: 7px;

            font-size: 11px;

        }


        .extended-legend i {

            width: 8px;

            height: 8px;

            border-radius: 50%;

        }


        .paid-dot {

            background: #22c55e;

        }


        .pending-dot {

            background: #f59e0b;

        }


        .extended-legend span {

            color: #64748b;

        }


        .extended-legend strong {

            color: #0f172a;

        }


        .extended-space-list {

            display: flex;

            flex-direction: column;

            gap: 15px;

        }


        .extended-space-item > div:first-child {

            display: flex;

            justify-content: space-between;

            margin-bottom: 6px;

            font-size: 11px;

        }


        .extended-space-item span {

            color: #475569;

        }


        .extended-space-item strong {

            color: #0f172a;

        }


        .extended-space-track {

            height: 7px;

            background: #eef2f7;

            border-radius: 99px;

            overflow: hidden;

        }


        .extended-space-track div {

            height: 100%;

            background: #2563eb;

            border-radius: inherit;

        }


        .extended-stat-list {

            display: flex;

            flex-direction: column;

        }


        .extended-stat-list > div {

            display: flex;

            justify-content: space-between;

            align-items: center;

            padding: 12px 0;

            border-bottom: 1px solid #f1f5f9;

        }


        .extended-stat-list > div:last-child {

            border-bottom: 0;

        }


        .extended-stat-list span {

            color: #64748b;

            font-size: 11px;

        }


        .extended-stat-list strong {

            font-size: 17px;

            color: #0f172a;

        }


        .extended-reservation-stats {

            display: grid;

            grid-template-columns:
                repeat(2,1fr);

            gap: 10px;

        }


        .extended-reservation-stats > div {

            padding: 15px;

            border-radius: 11px;

            text-align: center;

        }


        .extended-reservation-stats .confirmed {

            background: #ecfdf5;

            color: #15803d;

        }


        .extended-reservation-stats .cancelled {

            background: #fef2f2;

            color: #dc2626;

        }


        .extended-reservation-stats strong {

            display: block;

            font-size: 23px;

        }


        .extended-reservation-stats span {

            font-size: 10px;

        }


        .extended-fine-summary {

            display: grid;

            grid-template-columns:
                repeat(2,1fr);

            gap: 10px;

            margin-bottom: 14px;

        }


        .extended-fine-summary > div {

            padding: 13px;

            border-radius: 10px;

            background: #f8fafc;

        }


        .extended-fine-summary span {

            display: block;

            font-size: 10px;

            color: #64748b;

        }


        .extended-fine-summary strong {

            display: block;

            margin-top: 4px;

            font-size: 17px;

            color: #dc2626;

        }


        .extended-wide-button {

            width: 100%;

            padding: 10px;

            border: 0;

            border-radius: 9px;

            background: #f1f5f9;

            color: #334155;

            font-weight: 700;

            cursor: pointer;

        }


        .extended-activity-panel {

            width: 100%;

        }


        .extended-activity-list {

            display: flex;

            flex-direction: column;

        }


        .extended-activity-row {

            display: flex;

            align-items: center;

            gap: 12px;

            padding: 12px 0;

            border-bottom: 1px solid #f1f5f9;

        }


        .extended-activity-row:last-child {

            border-bottom: 0;

        }


        .extended-activity-icon {

            width: 34px;

            height: 34px;

            border-radius: 9px;

            background: #eff6ff;

            color: #2563eb;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 12px;

            font-weight: 800;

            flex-shrink: 0;

        }


        .extended-activity-content {

            display: flex;

            flex-direction: column;

            flex: 1;

            min-width: 0;

        }


        .extended-activity-content strong {

            font-size: 12px;

            color: #0f172a;

        }


        .extended-activity-content span {

            font-size: 11px;

            color: #64748b;

            overflow: hidden;

            text-overflow: ellipsis;

            white-space: nowrap;

        }


        .extended-activity-meta {

            display: flex;

            flex-direction: column;

            align-items: flex-end;

            gap: 3px;

        }


        .extended-activity-meta strong {

            font-size: 11px;

            color: #0f172a;

        }


        .extended-activity-meta span {

            font-size: 10px;

            color: #94a3b8;

        }


        .extended-empty-activity {

            display: flex;

            flex-direction: column;

            align-items: center;

            padding: 35px;

            color: #94a3b8;

            text-align: center;

        }


        .extended-empty-activity div {

            width: 38px;

            height: 38px;

            border-radius: 50%;

            background: #dcfce7;

            color: #16a34a;

            display: flex;

            align-items: center;

            justify-content: center;

            margin-bottom: 10px;

        }


        .extended-empty-activity strong {

            color: #475569;

            font-size: 13px;

        }


        .extended-empty-activity span {

            margin-top: 4px;

            font-size: 11px;

        }


        .extended-alert-grid {

            display: grid;

            grid-template-columns:
                repeat(2,1fr);

            gap: 15px;

        }


        .extended-alert {

            display: flex;

            gap: 12px;

            align-items: center;

            padding: 15px;

            border-radius: 13px;

            border: 1px solid;

        }


        .extended-alert > div {

            width: 36px;

            height: 36px;

            border-radius: 9px;

            display: flex;

            align-items: center;

            justify-content: center;

            font-weight: 800;

            flex-shrink: 0;

        }


        .extended-alert section {

            display: flex;

            flex-direction: column;

            gap: 3px;

        }


        .extended-alert strong {

            font-size: 12px;

        }


        .extended-alert span {

            font-size: 10px;

        }


        .extended-alert.blue {

            background: #eff6ff;

            border-color: #dbeafe;

        }


        .extended-alert.blue > div {

            background: #dbeafe;

            color: #2563eb;

        }


        .extended-alert.blue strong {

            color: #1d4ed8;

        }


        .extended-alert.blue span {

            color: #64748b;

        }


        .extended-alert.orange {

            background: #fffbeb;

            border-color: #fef3c7;

        }


        .extended-alert.orange > div {

            background: #fef3c7;

            color: #d97706;

        }


        .extended-alert.orange strong {

            color: #b45309;

        }


        .extended-alert.orange span {

            color: #64748b;

        }


        /* =============================================
           COMUNIDAD
        ============================================= */

        .extended-community-posts {

            margin-top: 24px;

            background: #fff;

            border: 1px solid #e2e8f0;

            border-radius: 15px;

            padding: 20px;

        }


        .extended-community-header {

            display: flex;

            justify-content: space-between;

            align-items: flex-start;

            gap: 15px;

            margin-bottom: 18px;

        }


        .extended-community-header > div span {

            color: #2563eb;

            font-size: 9px;

            font-weight: 800;

            letter-spacing: .1em;

        }


        .extended-community-header h2 {

            margin: 4px 0;

            font-size: 17px;

            color: #0f172a;

        }


        .extended-community-header p {

            margin: 0;

            color: #64748b;

            font-size: 11px;

        }


        .extended-community-button {

            border: 0;

            border-radius: 9px;

            padding: 10px 13px;

            background: #2563eb;

            color: white;

            font-weight: 700;

            font-size: 11px;

            cursor: pointer;

        }


        .extended-post-list {

            display: grid;

            grid-template-columns:
                repeat(2,minmax(0,1fr));

            gap: 14px;

        }


        .extended-post {

            border: 1px solid #e2e8f0;

            border-radius: 12px;

            padding: 15px;

            background: #f8fafc;

        }


        .extended-post-top {

            display: flex;

            align-items: center;

            gap: 9px;

            margin-bottom: 12px;

        }


        .extended-post-avatar {

            width: 32px;

            height: 32px;

            border-radius: 50%;

            background: #dbeafe;

            color: #2563eb;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 9px;

            font-weight: 800;

        }


        .extended-post-top div:last-child {

            display: flex;

            flex-direction: column;

        }


        .extended-post-top strong {

            font-size: 11px;

            color: #0f172a;

        }


        .extended-post-top span {

            font-size: 9px;

            color: #94a3b8;

        }


        .extended-post h3 {

            margin: 0 0 7px;

            font-size: 13px;

            color: #0f172a;

        }


        .extended-post p {

            margin: 0;

            color: #64748b;

            font-size: 11px;

            line-height: 1.55;

        }


        .extended-empty-community {

            padding: 35px;

            text-align: center;

            color: #94a3b8;

        }


        .extended-empty-community strong {

            display: block;

            color: #475569;

            font-size: 13px;

        }


        .extended-empty-community span {

            display: block;

            margin-top: 4px;

            font-size: 11px;

        }


        /* =============================================
           RESPONSIVE
        ============================================= */

        @media (max-width: 1000px) {

            .extended-report-kpis {

                grid-template-columns:
                    repeat(2,1fr);

            }


            .extended-report-grid {

                grid-template-columns: 1fr;

            }


            .extended-three-grid {

                grid-template-columns: 1fr;

            }

        }


        @media (max-width: 750px) {

            .extended-form-grid {

                grid-template-columns: 1fr;

            }


            .extended-finance-kpis {

                grid-template-columns:
                    repeat(2,1fr);

            }


            .extended-finance-columns {

                grid-template-columns: 1fr;

            }


            .extended-reports-header {

                flex-direction: column;

            }


            .extended-alert-grid {

                grid-template-columns: 1fr;

            }


            .extended-post-list {

                grid-template-columns: 1fr;

            }

        }


        @media (max-width: 500px) {

            .extended-report-kpis {

                grid-template-columns: 1fr;

            }


            .extended-finance-kpis {

                grid-template-columns: 1fr;

            }


            .extended-legend {

                grid-template-columns: 1fr;

            }


            .extended-report-actions {

                width: 100%;

            }


            .extended-report-actions button {

                flex: 1;

            }


            .extended-person-row {

                align-items: flex-start;

            }


            .extended-person-right {

                min-width: 80px;

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   17. INICIALIZACIÓN
========================================================= */

function initializeHabitAppExtendedAdmin() {

    if (
        window.__habitAppExtendedInitialized
    ) {
        return;
    }


    window.__habitAppExtendedInitialized =
        true;


    addExtendedAdminStyles();

    setupExtendedAdminButtons();

    renderExtendedReports();

    renderExtendedCommunityPosts();

}


/* =========================================================
   18. ARRANQUE
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeHabitAppExtendedAdmin
    );

} else {

    initializeHabitAppExtendedAdmin();

}


/* =========================================================
   19. EXPONER FUNCIONES
========================================================= */

window.habitAppAdmin = {

    ...window.habitAppAdmin,

    openExtendedChargeModal,

    openExtendedPostModal,

    openExtendedCollectionModal,

    renderExtendedReports,

    exportExtendedReportCSV,

    getExtendedFinanceSummary

};


/* =========================================================
   FIN DE EXTENSIÓN
========================================================= */

/* ============================================================
   HABITAPP ADMIN — PRO UPGRADE
   Mejora general del administrador
   NO MODIFICA LA SECCIÓN REPORTES
   ============================================================ */

(() => {
    "use strict";

    const PRO_KEY = "habitapp_admin_pro_upgrade";

    /* ============================================================
       ESTADO PROPIO
    ============================================================ */

    const proDefault = {
        activities: [
            {
                id: 1,
                type: "payment",
                title: "Pago registrado",
                description: "Diego Flores registró el pago de gastos comunes.",
                date: "Hace 15 min"
            },
            {
                id: 2,
                type: "reservation",
                title: "Nueva reserva",
                description: "Quincho 2 reservado por Diego Flores.",
                date: "Hace 32 min"
            },
            {
                id: 3,
                type: "fine",
                title: "Nueva multa registrada",
                description: "Multa asociada al departamento 504.",
                date: "Hace 1 hora"
            },
            {
                id: 4,
                type: "notice",
                title: "Aviso publicado",
                description: "Corte de agua programado.",
                date: "Hace 2 horas"
            }
        ],

        notifications: [
            {
                id: 1,
                title: "Pago pendiente",
                description: "Catalina Rojas mantiene un pago pendiente.",
                type: "warning",
                read: false
            },
            {
                id: 2,
                title: "Nueva reserva",
                description: "Se registró una nueva reserva para hoy.",
                type: "info",
                read: false
            },
            {
                id: 3,
                title: "Multa pendiente",
                description: "Existe una multa pendiente de pago.",
                type: "danger",
                read: false
            }
        ]
    };

    function loadProData() {
        try {
            const saved = JSON.parse(localStorage.getItem(PRO_KEY));

            if (!saved) {
                localStorage.setItem(PRO_KEY, JSON.stringify(proDefault));
                return JSON.parse(JSON.stringify(proDefault));
            }

            return {
                activities: Array.isArray(saved.activities)
                    ? saved.activities
                    : [...proDefault.activities],

                notifications: Array.isArray(saved.notifications)
                    ? saved.notifications
                    : [...proDefault.notifications]
            };
        } catch (error) {
            return JSON.parse(JSON.stringify(proDefault));
        }
    }

    let proData = loadProData();

    function saveProData() {
        localStorage.setItem(PRO_KEY, JSON.stringify(proData));
    }


    /* ============================================================
       UTILIDADES
    ============================================================ */

    function proEscape(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function proMoney(value) {
        return "$" + Number(value || 0).toLocaleString("es-CL");
    }

    function proGetMainData() {
        try {
            const raw = localStorage.getItem("habitapp_admin_data");

            if (!raw) {
                return {
                    residents: [],
                    payments: [],
                    fines: [],
                    reservations: [],
                    posts: [],
                    notices: []
                };
            }

            const data = JSON.parse(raw);

            return {
                residents: Array.isArray(data.residents) ? data.residents : [],
                payments: Array.isArray(data.payments) ? data.payments : [],
                fines: Array.isArray(data.fines) ? data.fines : [],
                reservations: Array.isArray(data.reservations) ? data.reservations : [],
                posts: Array.isArray(data.posts) ? data.posts : [],
                notices: Array.isArray(data.notices) ? data.notices : []
            };
        } catch (error) {
            return {
                residents: [],
                payments: [],
                fines: [],
                reservations: [],
                posts: [],
                notices: []
            };
        }
    }

    function proNotify(title, description, type = "info") {
        proData.notifications.unshift({
            id: Date.now(),
            title,
            description,
            type,
            read: false
        });

        proData.notifications = proData.notifications.slice(0, 15);

        proData.activities.unshift({
            id: Date.now() + 1,
            type,
            title,
            description,
            date: "Ahora"
        });

        proData.activities = proData.activities.slice(0, 20);

        saveProData();

        if (typeof window.showToast === "function") {
            try {
                window.showToast(description);
            } catch (e) {}
        }

        renderProNotificationBadge();
        renderProActivity();
    }


    /* ============================================================
       ESTILOS PROFESIONALES
    ============================================================ */

    function injectProStyles() {

        if (document.getElementById("habitapp-pro-styles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "habitapp-pro-styles";

        style.textContent = `
            /* =====================================================
               HABITAPP PRO UI
            ===================================================== */

            .ha-pro-section {
                margin-top: 24px;
            }

            .ha-pro-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                margin-bottom: 16px;
            }

            .ha-pro-title {
                font-size: 18px;
                font-weight: 800;
                color: #16181d;
                margin: 0;
            }

            .ha-pro-subtitle {
                margin: 5px 0 0;
                color: #64748b;
                font-size: 13px;
            }

            .ha-pro-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 16px;
            }

            .ha-pro-card {
                background: #fff;
                border: 1px solid #e8edf5;
                border-radius: 16px;
                padding: 18px;
                box-shadow: 0 5px 18px rgba(15, 23, 42, .05);
            }

            .ha-pro-card:hover {
                box-shadow: 0 10px 28px rgba(15, 23, 42, .08);
                transform: translateY(-1px);
                transition: .2s ease;
            }

            .ha-pro-card-label {
                color: #64748b;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: .04em;
            }

            .ha-pro-card-value {
                font-size: 25px;
                line-height: 1.2;
                font-weight: 850;
                color: #16181d;
                margin-top: 8px;
            }

            .ha-pro-card-detail {
                font-size: 12px;
                color: #64748b;
                margin-top: 6px;
            }

            .ha-pro-progress {
                height: 8px;
                background: #eef2f7;
                border-radius: 99px;
                overflow: hidden;
                margin-top: 13px;
            }

            .ha-pro-progress span {
                display: block;
                height: 100%;
                border-radius: inherit;
                background: #2563eb;
            }

            .ha-pro-collection {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 14px;
                margin-top: 16px;
            }

            .ha-pro-collection-box {
                padding: 15px;
                border-radius: 13px;
                background: #f8fafc;
                border: 1px solid #edf1f6;
            }

            .ha-pro-collection-box strong {
                display: block;
                font-size: 18px;
                margin-top: 5px;
            }

            .ha-pro-paid {
                color: #15803d;
            }

            .ha-pro-pending {
                color: #dc2626;
            }

            .ha-pro-mini-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 14px;
            }

            .ha-pro-mini-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 11px 12px;
                border: 1px solid #edf1f6;
                border-radius: 12px;
                background: #fff;
            }

            .ha-pro-person {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }

            .ha-pro-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: grid;
                place-items: center;
                background: #eff6ff;
                color: #2563eb;
                font-weight: 800;
                font-size: 12px;
                flex-shrink: 0;
            }

            .ha-pro-person-name {
                font-size: 13px;
                font-weight: 750;
                color: #1e293b;
            }

            .ha-pro-person-meta {
                font-size: 11px;
                color: #64748b;
                margin-top: 2px;
            }

            .ha-pro-status {
                display: inline-flex;
                align-items: center;
                padding: 5px 9px;
                border-radius: 999px;
                font-size: 11px;
                font-weight: 750;
                white-space: nowrap;
            }

            .ha-pro-status-paid {
                background: #dcfce7;
                color: #166534;
            }

            .ha-pro-status-pending {
                background: #fee2e2;
                color: #991b1b;
            }

            .ha-pro-status-info {
                background: #dbeafe;
                color: #1d4ed8;
            }

            .ha-pro-status-warning {
                background: #fef3c7;
                color: #92400e;
            }

            .ha-pro-status-neutral {
                background: #f1f5f9;
                color: #475569;
            }

            .ha-pro-activity {
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            .ha-pro-activity-item {
                display: flex;
                gap: 12px;
                padding: 13px 0;
                border-bottom: 1px solid #eef2f7;
            }

            .ha-pro-activity-item:last-child {
                border-bottom: 0;
            }

            .ha-pro-activity-icon {
                width: 34px;
                height: 34px;
                border-radius: 10px;
                display: grid;
                place-items: center;
                background: #eff6ff;
                color: #2563eb;
                flex-shrink: 0;
                font-size: 15px;
            }

            .ha-pro-activity-title {
                font-size: 13px;
                font-weight: 750;
                color: #1e293b;
            }

            .ha-pro-activity-description {
                font-size: 12px;
                color: #64748b;
                margin-top: 3px;
                line-height: 1.45;
            }

            .ha-pro-activity-time {
                font-size: 10px;
                color: #94a3b8;
                margin-top: 4px;
            }

            .ha-pro-action-row {
                display: flex;
                flex-wrap: wrap;
                gap: 9px;
                margin-top: 15px;
            }

            .ha-pro-action {
                border: 1px solid #dbe3ee;
                background: #fff;
                color: #334155;
                border-radius: 10px;
                padding: 9px 12px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: .18s ease;
            }

            .ha-pro-action:hover {
                border-color: #2563eb;
                color: #2563eb;
                background: #eff6ff;
            }

            .ha-pro-action-primary {
                background: #2563eb;
                color: #fff;
                border-color: #2563eb;
            }

            .ha-pro-action-primary:hover {
                background: #1d4ed8;
                color: #fff;
            }

            .ha-pro-empty {
                text-align: center;
                padding: 24px 10px;
                color: #94a3b8;
                font-size: 13px;
            }

            .ha-pro-notification-panel {
                position: fixed;
                top: 74px;
                right: 24px;
                width: 350px;
                max-width: calc(100vw - 32px);
                background: #fff;
                border: 1px solid #e5eaf1;
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(15,23,42,.18);
                z-index: 9998;
                overflow: hidden;
                display: none;
            }

            .ha-pro-notification-panel.active {
                display: block;
                animation: haProDrop .18s ease;
            }

            @keyframes haProDrop {
                from {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .ha-pro-notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                border-bottom: 1px solid #edf1f6;
            }

            .ha-pro-notification-header strong {
                font-size: 14px;
            }

            .ha-pro-mark-read {
                border: 0;
                background: transparent;
                color: #2563eb;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
            }

            .ha-pro-notification-list {
                max-height: 390px;
                overflow-y: auto;
            }

            .ha-pro-notification {
                display: flex;
                gap: 10px;
                padding: 13px 16px;
                border-bottom: 1px solid #f1f5f9;
            }

            .ha-pro-notification.unread {
                background: #f8fbff;
            }

            .ha-pro-notification-dot {
                width: 8px;
                height: 8px;
                margin-top: 5px;
                border-radius: 50%;
                background: #2563eb;
                flex-shrink: 0;
            }

            .ha-pro-notification-title {
                font-size: 12px;
                font-weight: 750;
                color: #1e293b;
            }

            .ha-pro-notification-text {
                font-size: 11px;
                color: #64748b;
                margin-top: 3px;
                line-height: 1.4;
            }

            .ha-pro-notification-empty {
                padding: 30px 15px;
                text-align: center;
                color: #94a3b8;
                font-size: 12px;
            }

            .ha-pro-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                min-width: 17px;
                height: 17px;
                padding: 0 4px;
                border-radius: 50%;
                display: grid;
                place-items: center;
                background: #ef4444;
                color: #fff;
                font-size: 9px;
                font-weight: 800;
                border: 2px solid #fff;
            }

            .ha-pro-notification-button {
                position: relative !important;
            }

            .ha-pro-detail-modal {
                position: fixed;
                inset: 0;
                background: rgba(15,23,42,.48);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }

            .ha-pro-detail-modal.active {
                display: flex;
            }

            .ha-pro-detail-content {
                width: min(650px, 100%);
                max-height: 85vh;
                overflow-y: auto;
                background: #fff;
                border-radius: 20px;
                box-shadow: 0 25px 70px rgba(15,23,42,.25);
            }

            .ha-pro-detail-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #edf1f6;
            }

            .ha-pro-detail-head h3 {
                margin: 0;
                font-size: 17px;
            }

            .ha-pro-close {
                width: 34px;
                height: 34px;
                border: 0;
                border-radius: 9px;
                background: #f1f5f9;
                cursor: pointer;
                font-size: 17px;
                color: #475569;
            }

            .ha-pro-detail-body {
                padding: 20px;
            }

            .ha-pro-detail-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                padding: 13px 0;
                border-bottom: 1px solid #eef2f7;
            }

            .ha-pro-detail-row:last-child {
                border-bottom: 0;
            }

            .ha-pro-detail-label {
                color: #64748b;
                font-size: 12px;
            }

            .ha-pro-detail-value {
                color: #1e293b;
                font-size: 13px;
                font-weight: 750;
                text-align: right;
            }

            @media (max-width: 1000px) {
                .ha-pro-grid {
                    grid-template-columns: 1fr 1fr;
                }
            }

            @media (max-width: 700px) {
                .ha-pro-grid,
                .ha-pro-collection {
                    grid-template-columns: 1fr;
                }

                .ha-pro-notification-panel {
                    right: 16px;
                    top: 68px;
                }
            }
        `;

        document.head.appendChild(style);
    }


    /* ============================================================
       CALCULAR RECAUDACIÓN
    ============================================================ */

    function getCollectionSummary() {

        const data = proGetMainData();

        let paid = 0;
        let pending = 0;

        data.payments.forEach(payment => {
            const amount = Number(payment.amount || 0);

            if (
                String(payment.status).toLowerCase() === "pagado" ||
                String(payment.status).toLowerCase() === "paid"
            ) {
                paid += amount;
            } else {
                pending += amount;
            }
        });

        const total = paid + pending;

        return {
            paid,
            pending,
            total,
            percentage: total > 0
                ? Math.round((paid / total) * 100)
                : 0
        };
    }


    /* ============================================================
       INSERTAR PANEL PROFESIONAL EN DASHBOARD
    ============================================================ */

    function renderProDashboard() {

        const dashboard =
            document.querySelector("#screen-dashboard") ||
            document.querySelector('[data-screen="dashboard"]');

        if (!dashboard) {
            return;
        }

        let container = document.getElementById("habitapp-pro-dashboard");

        if (!container) {

            container = document.createElement("div");
            container.id = "habitapp-pro-dashboard";
            container.className = "ha-pro-section";

            dashboard.appendChild(container);
        }

        const data = proGetMainData();
        const summary = getCollectionSummary();

        const paidResidents = data.payments.filter(payment =>
            String(payment.status).toLowerCase() === "pagado"
        );

        const pendingResidents = data.payments.filter(payment =>
            String(payment.status).toLowerCase() !== "pagado"
        );

        const today = new Date();
        const todayString =
            today.getFullYear() +
            "-" +
            String(today.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(today.getDate()).padStart(2, "0");

        const reservationsToday = data.reservations.filter(
            reservation => reservation.date === todayString
        ).length;

        const activeFines = data.fines.filter(
            fine => String(fine.status).toLowerCase() !== "pagada"
        ).length;

        container.innerHTML = `
            <div class="ha-pro-header">
                <div>
                    <h3 class="ha-pro-title">Resumen administrativo</h3>
                    <p class="ha-pro-subtitle">
                        Vista general de la gestión del condominio
                    </p>
                </div>

                <div class="ha-pro-action-row" style="margin-top:0;">
                    <button class="ha-pro-action ha-pro-action-primary"
                            data-ha-pro-action="collection">
                        Ver recaudación
                    </button>

                    <button class="ha-pro-action"
                            data-ha-pro-action="activity">
                        Ver actividad
                    </button>
                </div>
            </div>

            <div class="ha-pro-grid">

                <div class="ha-pro-card">
                    <div class="ha-pro-card-label">
                        Recaudación
                    </div>

                    <div class="ha-pro-card-value">
                        ${proMoney(summary.paid)}
                    </div>

                    <div class="ha-pro-card-detail">
                        ${summary.percentage}% del total registrado
                    </div>

                    <div class="ha-pro-progress">
                        <span style="width:${summary.percentage}%"></span>
                    </div>
                </div>

                <div class="ha-pro-card">
                    <div class="ha-pro-card-label">
                        Pendiente de cobro
                    </div>

                    <div class="ha-pro-card-value ha-pro-pending">
                        ${proMoney(summary.pending)}
                    </div>

                    <div class="ha-pro-card-detail">
                        ${pendingResidents.length} registro(s) pendiente(s)
                    </div>
                </div>

                <div class="ha-pro-card">
                    <div class="ha-pro-card-label">
                        Operación del día
                    </div>

                    <div class="ha-pro-card-value">
                        ${reservationsToday}
                    </div>

                    <div class="ha-pro-card-detail">
                        reserva(s) programada(s) para hoy ·
                        ${activeFines} multa(s) pendiente(s)
                    </div>
                </div>

            </div>

            <div class="ha-pro-collection">

                <div class="ha-pro-card">

                    <div class="ha-pro-header">
                        <div>
                            <h3 class="ha-pro-title" style="font-size:15px;">
                                Estado de pagos
                            </h3>

                            <p class="ha-pro-subtitle">
                                Residentes con registros de pago
                            </p>
                        </div>
                    </div>

                    <div class="ha-pro-mini-list">

                        ${
                            paidResidents.length
                                ? paidResidents.slice(0, 5).map(payment => `
                                    <div class="ha-pro-mini-item">

                                        <div class="ha-pro-person">

                                            <div class="ha-pro-avatar">
                                                ${proEscape(
                                                    String(payment.resident || "?")
                                                        .split(" ")
                                                        .map(n => n[0])
                                                        .slice(0, 2)
                                                        .join("")
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div>
                                                <div class="ha-pro-person-name">
                                                    ${proEscape(payment.resident)}
                                                </div>

                                                <div class="ha-pro-person-meta">
                                                    Departamento ${proEscape(payment.apartment)}
                                                    · ${proMoney(payment.amount)}
                                                </div>
                                            </div>

                                        </div>

                                        <span class="ha-pro-status ha-pro-status-paid">
                                            Pagado
                                        </span>

                                    </div>
                                `).join("")
                                : `<div class="ha-pro-empty">
                                    No hay pagos registrados.
                                   </div>`
                        }

                    </div>

                </div>


                <div class="ha-pro-card">

                    <div class="ha-pro-header">
                        <div>
                            <h3 class="ha-pro-title" style="font-size:15px;">
                                Pagos pendientes
                            </h3>

                            <p class="ha-pro-subtitle">
                                Requieren seguimiento administrativo
                            </p>
                        </div>
                    </div>

                    <div class="ha-pro-mini-list">

                        ${
                            pendingResidents.length
                                ? pendingResidents.slice(0, 5).map(payment => `
                                    <div class="ha-pro-mini-item">

                                        <div class="ha-pro-person">

                                            <div class="ha-pro-avatar">
                                                ${proEscape(
                                                    String(payment.resident || "?")
                                                        .split(" ")
                                                        .map(n => n[0])
                                                        .slice(0, 2)
                                                        .join("")
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div>
                                                <div class="ha-pro-person-name">
                                                    ${proEscape(payment.resident)}
                                                </div>

                                                <div class="ha-pro-person-meta">
                                                    Departamento ${proEscape(payment.apartment)}
                                                    · ${proMoney(payment.amount)}
                                                </div>
                                            </div>

                                        </div>

                                        <span class="ha-pro-status ha-pro-status-pending">
                                            Pendiente
                                        </span>

                                    </div>
                                `).join("")
                                : `<div class="ha-pro-empty">
                                    No existen pagos pendientes.
                                   </div>`
                        }

                    </div>

                </div>

            </div>
        `;
    }


    /* ============================================================
       ACTIVIDAD RECIENTE
    ============================================================ */

    function getActivityIcon(type) {

        const icons = {
            payment: "💳",
            reservation: "📅",
            fine: "⚠️",
            notice: "📢",
            warning: "⚠️",
            info: "ℹ️",
            danger: "🚨"
        };

        return icons[type] || "•";
    }

    function renderProActivity() {

        let panel = document.getElementById("habitapp-pro-activity");

        const dashboard = document.querySelector("#screen-dashboard");

        if (!dashboard) {
            return;
        }

        if (!panel) {

            panel = document.createElement("div");
            panel.id = "habitapp-pro-activity";
            panel.className = "ha-pro-card ha-pro-section";

            dashboard.appendChild(panel);
        }

        panel.innerHTML = `
            <div class="ha-pro-header">

                <div>
                    <h3 class="ha-pro-title" style="font-size:15px;">
                        Actividad reciente
                    </h3>

                    <p class="ha-pro-subtitle">
                        Últimos movimientos administrativos
                    </p>
                </div>

                <button class="ha-pro-action"
                        data-ha-pro-action="activity">
                    Actualizar
                </button>

            </div>

            <div class="ha-pro-activity">

                ${
                    proData.activities.length
                        ? proData.activities.slice(0, 7).map(activity => `
                            <div class="ha-pro-activity-item">

                                <div class="ha-pro-activity-icon">
                                    ${getActivityIcon(activity.type)}
                                </div>

                                <div>

                                    <div class="ha-pro-activity-title">
                                        ${proEscape(activity.title)}
                                    </div>

                                    <div class="ha-pro-activity-description">
                                        ${proEscape(activity.description)}
                                    </div>

                                    <div class="ha-pro-activity-time">
                                        ${proEscape(activity.date)}
                                    </div>

                                </div>

                            </div>
                        `).join("")
                        : `
                            <div class="ha-pro-empty">
                                No hay actividad registrada.
                            </div>
                        `
                }

            </div>
        `;
    }


    /* ============================================================
       DETALLE DE RECAUDACIÓN
    ============================================================ */

    function openCollectionDetail() {

        const data = proGetMainData();
        const summary = getCollectionSummary();

        let modal = document.getElementById("ha-pro-detail-modal");

        if (!modal) {

            modal = document.createElement("div");
            modal.id = "ha-pro-detail-modal";
            modal.className = "ha-pro-detail-modal";

            document.body.appendChild(modal);
        }

        const payments = [...data.payments].sort((a, b) => {

            const aPending =
                String(a.status).toLowerCase() !== "pagado";

            const bPending =
                String(b.status).toLowerCase() !== "pagado";

            return Number(bPending) - Number(aPending);
        });

        modal.innerHTML = `
            <div class="ha-pro-detail-content">

                <div class="ha-pro-detail-head">

                    <div>
                        <h3>Detalle de recaudación</h3>

                        <p class="ha-pro-subtitle">
                            Estado de pagos registrados
                        </p>
                    </div>

                    <button class="ha-pro-close"
                            data-ha-pro-close>
                        ×
                    </button>

                </div>

                <div class="ha-pro-detail-body">

                    <div class="ha-pro-grid">

                        <div class="ha-pro-card">
                            <div class="ha-pro-card-label">
                                Recaudado
                            </div>

                            <div class="ha-pro-card-value ha-pro-paid">
                                ${proMoney(summary.paid)}
                            </div>
                        </div>

                        <div class="ha-pro-card">
                            <div class="ha-pro-card-label">
                                Pendiente
                            </div>

                            <div class="ha-pro-card-value ha-pro-pending">
                                ${proMoney(summary.pending)}
                            </div>
                        </div>

                    </div>

                    <div style="margin-top:20px;">

                        ${
                            payments.length
                                ? payments.map(payment => {

                                    const paid =
                                        String(payment.status).toLowerCase() === "pagado";

                                    return `
                                        <div class="ha-pro-detail-row">

                                            <div>
                                                <div class="ha-pro-person-name">
                                                    ${proEscape(payment.resident)}
                                                </div>

                                                <div class="ha-pro-person-meta">
                                                    Departamento ${proEscape(payment.apartment)}
                                                    ${payment.date
                                                        ? ` · ${proEscape(payment.date)}`
                                                        : ""}
                                                </div>
                                            </div>

                                            <div style="text-align:right;">

                                                <div class="ha-pro-detail-value">
                                                    ${proMoney(payment.amount)}
                                                </div>

                                                <span class="
                                                    ha-pro-status
                                                    ${paid
                                                        ? "ha-pro-status-paid"
                                                        : "ha-pro-status-pending"}
                                                ">
                                                    ${paid ? "Pagado" : "Pendiente"}
                                                </span>

                                            </div>

                                        </div>
                                    `;
                                }).join("")
                                : `
                                    <div class="ha-pro-empty">
                                        No existen registros de pago.
                                    </div>
                                `
                        }

                    </div>

                </div>

            </div>
        `;

        modal.classList.add("active");
    }


    /* ============================================================
       PANEL DE NOTIFICACIONES
    ============================================================ */

    function renderProNotificationBadge() {

        const buttons = document.querySelectorAll(
            'button[aria-label*="not"], button[title*="not"], .notification-btn, .notifications-btn'
        );

        let button = buttons[0];

        if (!button) {
            button = [...document.querySelectorAll("button")]
                .find(btn =>
                    /notific/i.test(btn.textContent || "") ||
                    /notific/i.test(btn.getAttribute("aria-label") || "") ||
                    /notific/i.test(btn.getAttribute("title") || "")
                );
        }

        if (!button) {
            return;
        }

        button.classList.add("ha-pro-notification-button");

        let badge = button.querySelector(".ha-pro-badge");

        const unread = proData.notifications.filter(n => !n.read).length;

        if (!badge) {
            badge = document.createElement("span");
            badge.className = "ha-pro-badge";
            button.appendChild(badge);
        }

        if (unread > 0) {
            badge.textContent = unread > 9 ? "9+" : unread;
            badge.style.display = "grid";
        } else {
            badge.style.display = "none";
        }
    }

    function createNotificationPanel() {

        if (document.getElementById("ha-pro-notifications")) {
            return;
        }

        const panel = document.createElement("div");
        panel.id = "ha-pro-notifications";
        panel.className = "ha-pro-notification-panel";

        document.body.appendChild(panel);

        renderNotificationPanel();
    }

    function renderNotificationPanel() {

        const panel = document.getElementById("ha-pro-notifications");

        if (!panel) {
            return;
        }

        const unread = proData.notifications.filter(n => !n.read);

        panel.innerHTML = `
            <div class="ha-pro-notification-header">

                <strong>
                    Notificaciones
                </strong>

                ${
                    unread.length
                        ? `
                            <button class="ha-pro-mark-read"
                                    data-ha-pro-read>
                                Marcar como leídas
                            </button>
                        `
                        : ""
                }

            </div>

            <div class="ha-pro-notification-list">

                ${
                    proData.notifications.length
                        ? proData.notifications.slice(0, 10).map(notification => `
                            <div class="
                                ha-pro-notification
                                ${notification.read ? "" : "unread"}
                            ">

                                ${
                                    !notification.read
                                        ? `<span class="ha-pro-notification-dot"></span>`
                                        : `<span style="width:8px;"></span>`
                                }

                                <div>

                                    <div class="ha-pro-notification-title">
                                        ${proEscape(notification.title)}
                                    </div>

                                    <div class="ha-pro-notification-text">
                                        ${proEscape(notification.description)}
                                    </div>

                                </div>

                            </div>
                        `).join("")
                        : `
                            <div class="ha-pro-notification-empty">
                                No tienes notificaciones.
                            </div>
                        `
                }

            </div>
        `;
    }


    /* ============================================================
       MEJORAS DE BOTONES
    ============================================================ */

    function handleProAction(action) {

        if (action === "collection") {
            openCollectionDetail();
            return;
        }

        if (action === "activity") {

            const activity =
                document.getElementById("habitapp-pro-activity");

            if (activity) {
                activity.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }
    }


    /* ============================================================
       BUSCADOR RÁPIDO DE ADMIN
    ============================================================ */

    function enhanceSearch() {

        const inputs = document.querySelectorAll(
            'input[type="search"], input[placeholder*="Buscar"], input[placeholder*="buscar"]'
        );

        inputs.forEach(input => {

            if (input.dataset.haProSearch) {
                return;
            }

            input.dataset.haProSearch = "true";

            input.addEventListener("input", () => {

                const value = input.value.trim().toLowerCase();

                if (!value) {
                    return;
                }

                const data = proGetMainData();

                const matches = [];

                data.residents.forEach(resident => {

                    const text = `
                        ${resident.name}
                        ${resident.apartment}
                        ${resident.email}
                        ${resident.phone}
                    `.toLowerCase();

                    if (text.includes(value)) {
                        matches.push({
                            type: "Residente",
                            name: resident.name,
                            detail: `Departamento ${resident.apartment}`
                        });
                    }
                });

                data.payments.forEach(payment => {

                    const text = `
                        ${payment.resident}
                        ${payment.apartment}
                    `.toLowerCase();

                    if (text.includes(value)) {
                        matches.push({
                            type: "Pago",
                            name: payment.resident,
                            detail: `${proMoney(payment.amount)} · ${payment.status}`
                        });
                    }
                });

                data.fines.forEach(fine => {

                    const text = `
                        ${fine.resident}
                        ${fine.apartment}
                        ${fine.reason}
                    `.toLowerCase();

                    if (text.includes(value)) {
                        matches.push({
                            type: "Multa",
                            name: fine.resident,
                            detail: fine.reason
                        });
                    }
                });

                input.title =
                    matches.length
                        ? `${matches.length} resultado(s) encontrado(s)`
                        : "Sin resultados";
            });
        });
    }


    /* ============================================================
       ACTIVIDAD AUTOMÁTICA DESDE LOS DATOS
    ============================================================ */

    function detectDataChanges() {

        const data = proGetMainData();

        const snapshot = {
            residents: data.residents.length,
            payments: data.payments.length,
            fines: data.fines.length,
            reservations: data.reservations.length,
            notices: data.notices.length,
            posts: data.posts.length
        };

        const key = "habitapp_admin_pro_snapshot";

        let previous = null;

        try {
            previous = JSON.parse(localStorage.getItem(key));
        } catch (e) {}

        if (previous) {

            if (snapshot.residents > previous.residents) {

                proData.activities.unshift({
                    id: Date.now(),
                    type: "info",
                    title: "Nuevo residente registrado",
                    description: "Se agregó un nuevo residente al sistema.",
                    date: "Recientemente"
                });
            }

            if (snapshot.payments > previous.payments) {

                proData.activities.unshift({
                    id: Date.now() + 1,
                    type: "payment",
                    title: "Nuevo registro de pago",
                    description: "Se agregó un nuevo movimiento de recaudación.",
                    date: "Recientemente"
                });
            }

            if (snapshot.fines > previous.fines) {

                proData.activities.unshift({
                    id: Date.now() + 2,
                    type: "fine",
                    title: "Nueva multa registrada",
                    description: "Se agregó una nueva multa al sistema.",
                    date: "Recientemente"
                });
            }

            if (snapshot.reservations > previous.reservations) {

                proData.activities.unshift({
                    id: Date.now() + 3,
                    type: "reservation",
                    title: "Nueva reserva registrada",
                    description: "Se agregó una nueva reserva de espacio común.",
                    date: "Recientemente"
                });
            }

            proData.activities =
                proData.activities.slice(0, 20);

            saveProData();
        }

        localStorage.setItem(
            key,
            JSON.stringify(snapshot)
        );
    }


    /* ============================================================
       EVENTOS
    ============================================================ */

    document.addEventListener("click", event => {

        const actionButton =
            event.target.closest("[data-ha-pro-action]");

        if (actionButton) {

            handleProAction(
                actionButton.dataset.haProAction
            );

            return;
        }

        const closeButton =
            event.target.closest("[data-ha-pro-close]");

        if (closeButton) {

            const modal =
                document.getElementById("ha-pro-detail-modal");

            if (modal) {
                modal.classList.remove("active");
            }

            return;
        }

        const readButton =
            event.target.closest("[data-ha-pro-read]");

        if (readButton) {

            proData.notifications.forEach(
                notification => notification.read = true
            );

            saveProData();

            renderNotificationPanel();
            renderProNotificationBadge();

            return;
        }

        const notificationButton =
            event.target.closest(
                ".ha-pro-notification-button"
            );

        if (notificationButton) {

            createNotificationPanel();

            const panel =
                document.getElementById("ha-pro-notifications");

            panel.classList.toggle("active");

            renderNotificationPanel();

            return;
        }

        const modal =
            document.getElementById("ha-pro-detail-modal");

        if (
            modal &&
            event.target === modal
        ) {
            modal.classList.remove("active");
        }
    });


    /* ============================================================
       DETECTAR CAMBIOS DE LOCALSTORAGE
    ============================================================ */

    window.addEventListener("storage", () => {

        proData = loadProData();

        renderProDashboard();
        renderProActivity();
        renderProNotificationBadge();
        renderNotificationPanel();

    });


    /* ============================================================
       INICIALIZACIÓN
    ============================================================ */

    function initializeProUpgrade() {

        injectProStyles();

        detectDataChanges();

        renderProDashboard();

        renderProActivity();

        createNotificationPanel();

        renderProNotificationBadge();

        enhanceSearch();
    }


    /* ============================================================
       REINTENTOS SUAVES
       Para esperar a que el dashboard existente termine de cargar.
    ============================================================ */

    let proAttempts = 0;

    const proBoot = setInterval(() => {

        proAttempts++;

        initializeProUpgrade();

        if (proAttempts >= 8) {
            clearInterval(proBoot);
        }

    }, 700);


    /* ============================================================
       ACTUALIZACIÓN PERIÓDICA
    ============================================================ */

    setInterval(() => {

        try {
            detectDataChanges();
            renderProDashboard();
            renderProActivity();
            renderProNotificationBadge();
        } catch (error) {
            // El sistema principal sigue funcionando aunque
            // una mejora secundaria tenga algún problema.
        }

    }, 5000);


    /* ============================================================
       CERRAR NOTIFICACIONES AL HACER CLICK AFUERA
    ============================================================ */

    document.addEventListener("click", event => {

        const panel =
            document.getElementById("ha-pro-notifications");

        if (!panel || !panel.classList.contains("active")) {
            return;
        }

        const insidePanel =
            event.target.closest("#ha-pro-notifications");

        const notificationButton =
            event.target.closest(".ha-pro-notification-button");

        if (!insidePanel && !notificationButton) {
            panel.classList.remove("active");
        }
    });


    /* ============================================================
       EXPOSICIÓN
    ============================================================ */

    window.HabitAppProUpgrade = {
        refresh: initializeProUpgrade,
        getCollectionSummary,
        openCollectionDetail,
        addActivity: (title, description, type = "info") => {
            proNotify(title, description, type);
        }
    };

})();