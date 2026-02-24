// GitHub Random Repository Finder
// This application fetches random repositories from GitHub based on selected programming language

class GitHubRepoFinder {
    constructor() {
        this.languageSelect = document.getElementById('languageSelect');
        this.findRepoBtn = document.getElementById('findRepoBtn');
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.repoCard = document.getElementById('repoCard');
        this.retryBtn = document.getElementById('retryBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.errorMessage = document.getElementById('errorMessage');

        this.languages = [];
        this.retryHandler = null;

        this.init();
    }

    init() {
        // Load languages when the app starts
        this.fetchLanguages();

        // Event listeners
        this.findRepoBtn.addEventListener('click', () => this.findRepository());
        this.retryBtn.addEventListener('click', () => this.handleRetry());
        this.refreshBtn.addEventListener('click', () => this.findRepository());

        // Also allow pressing Enter in select
        this.languageSelect.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.findRepository();
            }
        });
    }

    // Fetch programming languages from the provided JSON
    async fetchLanguages() {
        const LANGUAGES_URL = 'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json';
        
        try {
            const response = await fetch(LANGUAGES_URL);
            if (!response.ok) {
                throw new Error('Failed to load languages');
            }
            const data = await response.json();
            this.languages = data;
            this.populateLanguageSelect();
        } catch (error) {
            console.error('Error loading languages:', error);
            // Use fallback languages
            this.languages = this.getFallbackLanguages();
            this.populateLanguageSelect();
        }
    }

    // Fallback languages in case the API fails
    getFallbackLanguages() {
        return [
            { value: 'javascript', label: 'JavaScript' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'typescript', label: 'TypeScript' },
            { value: 'go', label: 'Go' },
            { value: 'rust', label: 'Rust' },
            { value: 'cpp', label: 'C++' },
            { value: 'csharp', label: 'C#' },
            { value: 'php', label: 'PHP' },
            { value: 'ruby', label: 'Ruby' },
            { value: 'swift', label: 'Swift' },
            { value: 'kotlin', label: 'Kotlin' },
            { value: 'html', label: 'HTML' },
            { value: 'css', label: 'CSS' },
            { value: 'shell', label: 'Shell' }
        ];
    }

    // Populate the language dropdown
    populateLanguageSelect() {
        // Clear existing options (except the placeholder)
        this.languageSelect.innerHTML = '<option value="">Select a language</option>';
        
        this.languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.label;
            this.languageSelect.appendChild(option);
        });
    }

    // Main method to find a random repository
    async findRepository() {
        const selectedLanguage = this.languageSelect.value;
        
        if (!selectedLanguage) {
            this.showError('Please select a programming language first');
            return;
        }

        this.hideAllStates();
        this.showLoading();

        // Store for retry functionality
        this.retryHandler = () => this.fetchRandomRepository(selectedLanguage);

        try {
            const repo = await this.fetchRandomRepository(selectedLanguage);
            this.displayRepository(repo);
        } catch (error) {
            this.showError(error.message || 'Error fetching repository. Please try again.');
        }
    }

    // Fetch a random repository from GitHub
    async fetchRandomRepository(language) {
        // GitHub Search API endpoint
        const GITHUB_API_URL = 'https://api.github.com/search/repositories';
        
        // Use a random sort and page to get different results
        // We use 'stars' as a base sort and add randomness
        const sortOptions = ['stars', 'forks', 'updated'];
        const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
        const randomPage = Math.floor(Math.random() * 10) + 1;
        
        // Build query parameters
        const query = `language:${encodeURIComponent(language)}`;
        const params = new URLSearchParams({
            q: query,
            sort: randomSort,
            order: 'desc',
            per_page: '30',
            page: randomPage.toString()
        });

        try {
            const response = await fetch(`${GITHUB_API_URL}?${params}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                }
            });

            if (response.status === 403) {
                throw new Error('API rate limit exceeded. Please wait a moment and try again.');
            }

            if (response.status === 422) {
                throw new Error('Invalid language selected. Please try another language.');
            }

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                // Pick a random repository from the results
                const randomIndex = Math.floor(Math.random() * data.items.length);
                return data.items[randomIndex];
            } else {
                throw new Error('No repositories found for this language');
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }

    // Display repository information
    displayRepository(repo) {
        this.hideAllStates();

        // Update DOM elements
        document.getElementById('repoName').textContent = repo.name;
        document.getElementById('repoLink').href = repo.html_url;
        
        const description = repo.description || 'No description available';
        document.getElementById('repoDescription').textContent = description;
        
        document.getElementById('starsCount').textContent = this.formatNumber(repo.stargazers_count);
        document.getElementById('forksCount').textContent = this.formatNumber(repo.forks_count);
        document.getElementById('issuesCount').textContent = this.formatNumber(repo.open_issues_count);
        
        document.getElementById('repoLanguage').textContent = repo.language || 'Unknown';
        document.getElementById('repoCreated').textContent = `Created: ${this.formatDate(repo.created_at)}`;

        this.repoCard.classList.remove('hidden');
    }

    // Format large numbers (e.g., 12345 -> 12.3k)
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // Format date to readable string
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // State management methods
    showLoading() {
        this.loadingState.classList.remove('hidden');
        this.findRepoBtn.disabled = true;
    }

    showError(message) {
        this.hideAllStates();
        this.errorMessage.textContent = message;
        this.errorState.classList.remove('hidden');
        this.findRepoBtn.disabled = false;
    }

    hideAllStates() {
        this.loadingState.classList.add('hidden');
        this.errorState.classList.add('hidden');
        this.repoCard.classList.add('hidden');
        this.findRepoBtn.disabled = false;
    }

    // Handle retry button click
    handleRetry() {
        if (this.retryHandler) {
            this.retryHandler();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubRepoFinder();
});
