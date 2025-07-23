# SilvaCuore

SilvaCuore is an open-source application designed to facilitate the collection, management, and sharing of field survey data, with a strong emphasis on forestry and environmental monitoring. It is developed in TypeScript using Angular and Ionic, and is designed for both mobile and web platforms.

## Project Goals

- **Data Collection in the Field:** SilvaCuore allows users to easily collect georeferenced data and surveys, supporting forestry and environmental research.
- **Data Management:** Users can store, update, and manage survey data locally or sync with remote storage (e.g., Firebase).
- **Open Data Sharing:** The app supports sharing of public survey datasets, promoting open science and collaboration, in line with the mission of [SilvaCuore](https://www.silvacuore.org/) to share knowledge and tools for sustainable forest management.

## Features

- **Survey Management:** Create, edit, and remove user surveys, including geospatial data.
- **Storage Integration:** Data is stored locally (using Capacitor Storage) and can be synced to remote backends (Firebase).
- **Public Surveys:** Access and contribute to a repository of open, public environmental surveys, available as GeoJSON.
- **User Profiles:** Secure authentication and user-specific data management.
- **Offline Operation:** Designed to work in field conditions with intermittent connectivity.

## Technologies

- **Frontend:** TypeScript, Angular, Ionic
- **Backend/Storage:** Firebase, Capacitor Storage
- **Other:** SCSS for styling, Docker for development environments

## Getting Started

### Prerequisites

- Node.js (v18 recommended)
- npm
- Ionic CLI (`npm install -g @ionic/cli`)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

Clone the repository:

```bash
git clone https://github.com/effetreseizero/treenote.git
cd treenote
npm install
```

Run in development mode:

```bash
ionic serve
```

### Docker (Development Container)

A ready-to-use development container is available. See `.devcontainer/Dockerfile` for more details.

## Contributing

Contributions are welcome! Please open issues or pull requests to discuss new features, bug fixes, or improvements.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Credits

SilvaCuore is inspired by and supports the mission of [SilvaCuore](https://www.silvacuore.org/), a project dedicated to open data and open tools for sustainable forestry.

---

Let me know if you want any further customization or if you need it in a specific format!
