# GitHub Random Repository

A web application that discovers random GitHub repositories based on selected programming languages.

## Overview

This application allows users to select a programming language from a dropdown menu and discover a random GitHub repository matching that language. It displays repository details including name, description, stars, forks, open issues, and language information.

## Features

- **Language Selection**: Dropdown populated with programming languages from a curated list
- **Random Repository Discovery**: Fetches random repositories using GitHub Search API
- **Repository Details**: Displays name, description, stars, forks, open issues, and language
- **Loading State**: Shows animated spinner while fetching data
- **Error Handling**: Handles API rate limits, network errors, and invalid languages with retry functionality
- **Refresh**: Allows fetching another random repository with the same language
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
github-random-repo/
├── src/              # Implementation
│   ├── index.html    # HTML structure
│   ├── styles.css    # Styling
│   └── app.js        # JavaScript logic
├── tests/            # Verification (behavioral guarantees)
├── README.md         # Project overview
├── .gitignore        # Git ignore policy
└── github-repo-finder.png  # Template image
```

## Getting Started

### Prerequisites

- A modern web browser
- Internet connection (for API calls)

### Running the Application

1. Clone or navigate to the project directory
2. Open `src/index.html` in your browser, or
3. Serve the `src/` directory using a local server:
   ```bash
   python -m http.server 8080
   ```
   Then visit `http://localhost:8080`

## Usage

1. Select a programming language from the dropdown
2. Click "Find Repository" to fetch a random repository
3. View repository details including:
   - Repository name and link
   - Description
   - Star count
   - Fork count
   - Open issues count
   - Language badge
   - Creation date
4. Click "Refresh Repository" to fetch another random repository with the same language

## APIs Used

- **Programming Languages Data**: https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json
- **GitHub Search API**: https://api.github.com/search/repositories

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub REST API

## License

MIT
