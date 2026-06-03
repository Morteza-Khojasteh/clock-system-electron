# Clock System Electron

A modern, secure Electron-based desktop application for managing and displaying clock system information. This application provides a kiosk-mode display interface that communicates with a remote server for real-time clock synchronization and device management.

---

## Overview

Clock System Electron is a robust desktop application built with Electron that serves as a client application for a clock management system. It features a secure setup process, device authentication, and a full-screen kiosk mode for displaying clock information. The application is designed for enterprise environments where reliable, uninterrupted clock display and synchronization is critical.

## Key Features

- **Secure Device Authentication**: Implements token-based device authentication with persistent storage
- **Kiosk Mode**: Full-screen, distraction-free display mode with auto-hiding menu bars
- **Setup Wizard**: Intuitive initial setup process for device registration and configuration
- **Remote Configuration**: Connects to a configured server for dynamic content and synchronization
- **Device Management**: Capabilities to reset device tokens and manage configurations
- **Offline Support**: Displays offline page when server connectivity is unavailable
- **Secure IPC Communication**: Uses Electron's context isolation for secure inter-process communication
- **Cross-Platform**: Designed for Windows with potential for cross-platform expansion

## Architecture

### Project Structure

```
clock-system-electron/
├── main.js                          # Main Electron process entry point
├── package.json                     # Project dependencies and scripts
├── app/
│   ├── assets/                      # Application assets (icons, images)
│   ├── config/
│   │   └── constants.js             # Configuration constants and server URLs
│   ├── ipc/
│   │   └── deviceIpc.js             # IPC handlers for device operations
│   ├── preload/
│   │   ├── overlay-preload.js       # Preload script for overlay window
│   │   └── setup-preload.js         # Preload script for setup window
│   ├── services/
│   │   └── deviceService.js         # Device token and configuration management
│   ├── storage/
│   │   └── configStore.js           # Configuration file storage handler
│   ├── ui/
│   │   ├── close.html               # Close confirmation UI
│   │   ├── offline.html             # Offline fallback UI
│   │   └── setup.html               # Device setup wizard UI
│   └── windows/
│       ├── createMainWindow.js      # Main application window factory
│       ├── createSetupWindow.js     # Setup wizard window factory
│       └── createCloseWindow.js     # Close confirmation window factory
└── README.md                        # This file
```

### Application Flow

1. **Startup**: Main process initializes and checks for stored device token
2. **Setup Path**: If no token exists, the setup window is displayed
3. **Main Path**: If token exists, the main window loads the remote clock application
4. **Device Management**: IPC handlers enable token updates and device resets

## Prerequisites

- **Node.js**: v14.x or higher
- **npm**: v6.x or higher
- **Windows**: Designed for Windows environments (further testing on other platforms may be needed)
- **Server**: A running instance of the clock system server at the configured URL

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Morteza-Khojasteh/clock-system-electron.git
cd clock-system-electron
```

### 2. Install Dependencies

```bash
npm install
```

This will install the following key dependencies:

- **electron**: The Electron framework
- **electron-builder**: For building distribution packages

## Configuration

### Server URL Configuration

The server URL can be configured in [app/config/constants.js](app/config/constants.js):

```javascript
const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173/clockapp"
    : "http://localhost:5173/clockapp";
```

Modify the URLs to point to your clock system server:

- **Development**: Configure the development server URL
- **Production**: Configure the production server URL

### Device Token Storage

Device tokens are stored in:

```
%ProgramData%\ClockSystem\config.json
```

This location can be modified in [app/config/constants.js](app/config/constants.js).

## Usage

### Starting the Application

```bash
npm start
```

This launches the Electron application in development mode.

### Initial Setup

1. Launch the application
2. The setup window appears (if no token is stored)
3. Configure the device through the setup wizard
4. Upon successful configuration, the main clock display window opens

### Device Reset

To reset the device and return to the setup wizard, trigger the reset device event through the setup UI or IPC channel:

```javascript
// This can be called from the renderer process
ipcRenderer.send("reset-device");
```

## Building and Distribution

### Building a Distribution Package

```bash
npm run dist
```

This creates an installable `.exe` file for Windows using electron-builder.

### Build Configuration

The application is configured with the following build settings in [package.json](package.json):

- **appId**: `com.company.clocksystem`
- **Icon**: `icon.ico` (Windows)
- **Output**: Distribution packages in the `dist/` directory

## Security Features

### Context Isolation

The application uses Electron's context isolation to prevent renderer process access to Node.js APIs:

```javascript
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
}
```

### Navigation Protection

The main window restricts navigation to the configured server URL:

- Only URLs starting with `SERVER_URL` are allowed
- Prevents unauthorized external navigation

### Window Control

- Link opening is disabled to prevent external browser windows
- Full-screen kiosk mode prevents user interference with system controls

## Scripts

- `npm start` - Launch the application in development mode
- `npm run dist` - Build distribution package for Windows
- `npm test` - Run tests (currently a placeholder)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests. When contributing, please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Application Won't Start

- Ensure Node.js and npm are correctly installed
- Verify all dependencies are installed: `npm install`
- Check that the clock system server is running and accessible

### Setup Window Appears Every Time

- Verify the device token is being saved correctly
- Check that `%ProgramData%\ClockSystem\config.json` exists and contains a valid token
- Check file permissions in the ClockSystem directory

### Server Connection Issues

- Verify the server URL in [app/config/constants.js](app/config/constants.js)
- Ensure the server is running and accessible from your machine
- Check network connectivity and firewall settings
- The offline page should display if the server is unreachable

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author

**Morteza Khojasteh**

For questions or support, please open an issue on [GitHub Issues](https://github.com/Morteza-Khojasteh/clock-system-electron/issues).

---

**Last Updated**: June 2026
