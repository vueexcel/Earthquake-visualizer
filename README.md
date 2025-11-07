# USGS Earthquake Data Dashboard

A feature-rich, responsive data dashboard built to visualize weekly earthquake data from the public USGS API. This project was created as a frontend test task to demonstrate proficiency with a modern web stack.

## ✨ Key Features

This dashboard isn't just a simple data display; it's a fully interactive and reactive application with a focus on user experience.

*   🌐 **Live Data:** Fetches the latest weekly earthquake data directly from the USGS API on load.
*   🔍 **Powerful Filtering:** Instantly filter all views by **magnitude range** and **location text**.
*   💾 **Persistent Filters:** The application remembers your last filter settings using `localStorage`, so your view is just as you left it.
*   🗂️ **Tabbed Interface:** A clean, tabbed layout to seamlessly switch between three different data views.
*   📊 **Interactive Table:** A sortable and searchable table with custom styling for clarity. Click any row to open a detailed information drawer.
*   📈 **Dynamic Chart:** A beautiful bar chart from ECharts that visualizes earthquake counts by magnitude and animates smoothly as you filter.
*   🗺️ **Intelligent Map:** An interactive world map from OpenLayers that plots all filtered earthquakes. It intelligently **pans and zooms** to fit the results of your search, and you can click any marker to see a popup with its details.
*   📱 **Fully Responsive:** The layout and components are designed to work beautifully on both desktop and mobile devices.
*   ⚙️ **Robust State Management:** All application data is managed centrally with Pinia, ensuring all components are always in sync.

---

## 🛠️ Tech Stack

This project was built using a modern and powerful set of technologies.

*   **Framework:** [Vue 3](https://vuejs.org/) (using the Composition API)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Framework:** [Quasar Framework](https://quasar.dev/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Charting:** [Apache ECharts](https://echarts.apache.org/) (via `vue-echarts`)
*   **Mapping:** [OpenLayers](https://openlayers.org/) (via `vue3-openlayers`)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Code Quality:** ESLint & Prettier

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine (v20+ is recommended). This will also install `npm`.

### Installation & Setup

1.  **Clone the repository** to your local machine:
    ```sh
    git clone "url"
    ```

2.  **Navigate into the project directory:**
    ```sh
    cd Quasar-project
    ```

3.  **Install all the necessary dependencies.** This command reads the `package.json` file and downloads all the required libraries into the `node_modules` folder.
    ```sh
    npm install
    ```

4.  **Run the development server.** This will compile the project and host it on a local server, usually at `http://localhost:9000`. The server will also automatically reload the page whenever you make a change to the code.
    ```sh
    npm run dev
    ```

5.  **Open your browser** and navigate to `http://localhost:9000`. You should see the application running!

---

## 🏛️ Architectural Approach

The application follows a modern, centralized state management pattern.

1.  **Data Fetch & Store:** On startup, the app makes a single API call to fetch all earthquake data for the week and stores this raw, unfiltered data in a central **Pinia store**. This store acts as the "single source of truth".
2.  **Reactive Filtering:** The UI filter controls (in the header) do not directly manipulate the data. Instead, they update filter values (e.g., `magnitudeRange`, `locationText`) within the Pinia store.
3.  **Computed Getters:** A Pinia `getter` then reactively computes a *filtered* list of earthquakes based on the current state and the active filters.
4.  **One-Way Data Flow:** This filtered list is then passed down as props to the UI components (Table, Chart, Map), which simply render the data they are given.

This approach ensures that our data logic is decoupled from our UI, making the application highly efficient, predictable, and easy to maintain.
