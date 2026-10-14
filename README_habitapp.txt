# HabitApp

## 1. Nombre del proyecto

**HabitApp --- Aplicación para la gestión de condominios y edificios
residenciales**

## 2. Descripción del proyecto

HabitApp es una propuesta de aplicación orientada a facilitar la
administración y la vida cotidiana en condominios y edificios
residenciales. La plataforma busca reunir en un solo lugar funciones
relacionadas con la reserva de espacios comunes y la gestión de pagos,
gastos comunes y multas.

### ¿Qué hace?

La solución está enfocada en permitir que los residentes puedan
consultar y reservar espacios comunes, además de revisar información
relacionada con sus gastos comunes y multas. A su vez, busca apoyar la
gestión de la administración del condominio, centralizando información y
haciendo más claros los procesos para residentes y administradores.

> El alcance funcional puede ampliarse a medida que avance el
> desarrollo. Este README describe el propósito general del proyecto y
> no implica que todas las funcionalidades estén implementadas
> actualmente.

### ¿A quién va dirigido?

-   **Residentes:** personas que viven en condominios o edificios y
    necesitan gestionar reservas y consultar información de pagos.
-   **Administradores de condominios:** personas encargadas de organizar
    los espacios comunes y apoyar la gestión de gastos y multas.
-   **Comunidades residenciales:** edificios y condominios que buscan
    centralizar estos procesos en una plataforma.

### ¿Qué problema resuelve?

En algunos condominios, la coordinación de reservas, la comunicación de
información y el seguimiento de pagos se realizan mediante canales
separados o procedimientos manuales. Esto puede dificultar el acceso a
la información, generar confusiones y aumentar el tiempo dedicado a
tareas administrativas.

HabitApp busca reducir esa fragmentación al ofrecer un punto central de
consulta y gestión, con el objetivo de mejorar la organización, la
transparencia y la experiencia de residentes y administradores.

## 3. Tecnologías y herramientas

Las tecnologías definitivas deben coincidir con las que estén
implementadas en el repositorio del proyecto. Con la información
disponible, se identifican las siguientes herramientas de trabajo:

-   **Git:** control de versiones del código fuente.
-   **GitHub:** alojamiento del repositorio y colaboración entre
    integrantes.
-   **Herramientas de diagramación y prototipado:** apoyo para
    representar y validar la solución antes o durante su implementación.

**Completar esta sección antes de publicar el README:** indicar el
lenguaje de programación, framework o biblioteca del frontend,
tecnología del backend, motor de base de datos y herramientas de pruebas
que efectivamente utilice la versión actual de HabitApp. No se enumeran
aquí tecnologías de desarrollo que todavía no han sido confirmadas.

## 4. Instrucciones para ejecutar el proyecto localmente

Los comandos exactos dependen de las tecnologías y la estructura
presentes en el repositorio. Para obtener una copia local:

1.  Instalar Git y las herramientas requeridas por el stack tecnológico
    del proyecto.

2.  Clonar el repositorio:

    ``` bash
    git clone URL_DEL_REPOSITORIO
    ```

3.  Entrar a la carpeta del proyecto:

    ``` bash
    cd NOMBRE_DE_LA_CARPETA
    ```

4.  Revisar las instrucciones específicas de instalación y ejecución
    correspondientes al framework utilizado.

5.  Configurar las variables de entorno o credenciales necesarias, si
    existen. Utilizar un archivo de ejemplo como `.env.example` cuando
    esté disponible y no publicar contraseñas, tokens ni claves
    privadas.

6.  Instalar las dependencias y ejecutar la aplicación con los comandos
    propios del proyecto.

### Comandos de ejecución

**Pendiente de completar con los comandos reales del repositorio.** Por
ejemplo, proyectos basados en Node.js suelen definir los comandos
disponibles en `package.json`; otros stacks utilizan sus propios
archivos de dependencias y comandos. Se recomienda agregar aquí los
pasos exactos para instalar dependencias, configurar la base de datos e
iniciar el frontend y el backend, según corresponda.

## 5. Metodología de trabajo en equipo

El proyecto se desarrolla en equipo con metodología Scrum, con participación de **Ignacio
Larraín, Diego Flores y Cristian Valenzuela**. La organización del
trabajo considera colaboración durante las distintas etapas, procurando
que los tres integrantes participen en el análisis, diseño, desarrollo,
revisión y documentación, en lugar de asignar todo un proceso
exclusivamente a una persona.

Como pauta de trabajo, se propone:

1.  **Planificación:** definir tareas, prioridades y objetivos de cada
    etapa.
2.  **Análisis y diseño:** revisar las necesidades de los usuarios y
    acordar la solución antes de implementar cambios.
3.  **Desarrollo colaborativo:** dividir las tareas de manera coordinada
    y mantener el código en un repositorio compartido.
4.  **Control de versiones:** utilizar Git y GitHub para registrar
    avances y facilitar la integración de cambios.
5.  **Revisión y pruebas:** comprobar las funcionalidades desarrolladas,
    detectar errores y corregirlos antes de dar una tarea por terminada.
6.  **Documentación y seguimiento:** registrar decisiones, avances,
    dificultades y tareas pendientes para mantener al equipo alineado.

La distribución específica de tareas puede ajustarse según las
necesidades y los avances del proyecto. Las decisiones relevantes deben
comunicarse al equipo para favorecer la continuidad del trabajo.

## 6. Arquitectura de la solución

A nivel conceptual, HabitApp se plantea como una solución organizada por
responsabilidades. La arquitectura definitiva dependerá de las
tecnologías que se implementen en el repositorio.

-   **Interfaz de usuario:** espacio desde el que residentes y
    administradores interactúan con las funciones disponibles, como las
    reservas y la consulta de información.
-   **Lógica de negocio:** componente encargado de aplicar las reglas de
    funcionamiento, validar operaciones y coordinar los procesos de la
    aplicación.
-   **Persistencia de datos:** componente destinado a almacenar y
    recuperar la información necesaria para gestionar usuarios, espacios
    comunes, reservas, gastos comunes y multas, de acuerdo con el
    alcance implementado.
-   **Control de acceso y seguridad:** debe contemplar la autenticación,
    los permisos según el tipo de usuario y la protección de la
    información.
-   **Integración entre componentes:** cuando la solución utilice un
    frontend y un backend separados, la comunicación se realizará
    mediante la interfaz de integración definida para el proyecto, por
    ejemplo una API.

Esta descripción representa una **arquitectura conceptual**, no una
confirmación de que todos estos componentes estén implementados. Al
consolidar la estructura técnica, se recomienda actualizar esta sección
con un diagrama y con las tecnologías reales de cada componente.

## 7. Estado del documento

Este README presenta el propósito, los usuarios objetivo, el problema
que aborda y la organización general de HabitApp. Antes de considerarlo
definitivo, se deben confirmar las tecnologías utilizadas, la estructura
del repositorio y los comandos exactos de ejecución local para que las
instrucciones puedan seguirse sin supuestos.
