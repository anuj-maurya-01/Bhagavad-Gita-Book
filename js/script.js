document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chapterListEl = document.getElementById('chapter-list');
    const verseListEl = document.getElementById('verse-list');
    const shlokaContainerEl = document.getElementById('shloka-container');
    const currentVerseTitleEl = document.getElementById('current-verse-title');
    const leftChapterTitleEl = document.getElementById('left-chapter-title');
    
    const searchInput = document.getElementById('search-input');
    const languageToggle = document.getElementById('language-toggle');
    const progressBar = document.getElementById('progress-bar');
    
    // Sections
    const aboutSection = document.getElementById('about-section');
    const verseListSection = document.getElementById('verse-list-section');
    const indexSection = document.getElementById('index-section');
    const shlokaSection = document.getElementById('shloka-section');
    
    const backToIndexBtn = document.getElementById('back-to-index');
    
    // Intro Screen elements
    const introScreen = document.getElementById('intro-screen');
    const introCover = document.getElementById('intro-cover');

    if (introCover) {
        introCover.addEventListener('click', () => {
            introCover.classList.add('open');
            setTimeout(() => {
                introScreen.classList.add('hidden');
            }, 800);
        });
    }

    let allVerses = [];
    let currentChapter = null;
    let bookmarks = JSON.parse(localStorage.getItem('bgBookmarks')) || [];
    let currentDataset = []; 
    let currentPageIndex = 0;

    const fetchData = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Network response was not ok');
            allVerses = await response.json();
            renderIndex();
            goHome(); // Start at Home State
        } catch (error) {
            console.error('Failed to load verses:', error);
            shlokaContainerEl.innerHTML = '<p style="text-align:center;">Could not load the scriptures. Please check your data source.</p>';
        }
    };

    const goHome = () => {
        aboutSection.classList.remove('hidden');
        indexSection.classList.remove('hidden');
        verseListSection.classList.add('hidden');
        shlokaSection.classList.add('hidden');
        currentChapter = null;
        if (progressBar) progressBar.style.width = '0%';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToReadingState = () => {
        aboutSection.classList.add('hidden');
        indexSection.classList.add('hidden');
        verseListSection.classList.remove('hidden');
        shlokaSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (backToIndexBtn) {
        backToIndexBtn.addEventListener('click', goHome);
    }

    const renderIndex = () => {
        chapterListEl.innerHTML = '';
        const chaptersSet = new Set(allVerses.map(v => v.chapter));
        const chapters = Array.from(chaptersSet).sort((a,b) => a - b);
        
        chapters.forEach(ch => {
            const chapV = allVerses.filter(v => v.chapter === ch);
            if(chapV.length === 0) return;
            const chapterTitle = chapV[0].chapterTitle;
            
            const li = document.createElement('li');
            li.textContent = `Chapter ${ch}: ${chapterTitle}`;
            
            li.addEventListener('click', () => {
                loadChapter(ch);
            });
            chapterListEl.appendChild(li);
        });
    };

    const loadChapter = (chapterNum) => {
        currentChapter = chapterNum;
        currentDataset = allVerses.filter(v => v.chapter === chapterNum);
        currentPageIndex = 0;
        
        if (currentDataset.length > 0) {
            leftChapterTitleEl.textContent = `Chapter ${chapterNum} Verses`;
            renderVerseList();
            goToReadingState();
            renderCurrentPage();
        } else {
            leftChapterTitleEl.textContent = `Chapter ${chapterNum}`;
            verseListEl.innerHTML = '';
            shlokaContainerEl.innerHTML = '<p style="text-align:center;">No verses available for this chapter.</p>';
        }
    };

    const renderVerseList = () => {
        verseListEl.innerHTML = '';
        currentDataset.forEach((v, idx) => {
            const li = document.createElement('li');
            li.textContent = `Verse ${v.chapter}.${v.verse}`;
            if (idx === currentPageIndex) li.classList.add('active');
            
            li.addEventListener('click', () => {
                turnToPage(idx);
            });
            verseListEl.appendChild(li);
        });
    };

    const turnToPage = (index) => {
        if(index < 0 || index >= currentDataset.length) return;
        
        const rightPage = document.getElementById('right-page');
        if (rightPage) rightPage.classList.add('page-turn-effect');
        
        setTimeout(() => {
            currentPageIndex = index;
            renderCurrentPage();
            
            // Update active state in verse list
            document.querySelectorAll('#verse-list li').forEach((el, idx) => {
                if (idx === currentPageIndex) el.classList.add('active');
                else el.classList.remove('active');
            });

            if (rightPage) {
                rightPage.classList.remove('page-turn-effect');
                rightPage.classList.add('page-turn-in');
                setTimeout(() => rightPage.classList.remove('page-turn-in'), 500);
            }
            
            // On mobile, scroll to right page
            if (window.innerWidth <= 900) {
                document.getElementById('right-page').scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    const renderCurrentPage = () => {
        shlokaContainerEl.innerHTML = '';
        
        if (currentDataset.length === 0) {
            currentVerseTitleEl.textContent = "No Match";
            shlokaContainerEl.innerHTML = '<p style="text-align:center;">No matching verses found.</p>';
            if (progressBar) progressBar.style.width = '0%';
            return;
        }

        const langPref = languageToggle ? languageToggle.value : 'both';
        const v = currentDataset[currentPageIndex];

        currentVerseTitleEl.textContent = `Verse ${v.chapter}.${v.verse}`;

        // Ensure verse number is removed since we have currentVerseTitle now representing it.
        const id = `${v.chapter}-${v.verse}`;
        const isBookmarked = bookmarks.includes(id);
        const card = document.createElement('div');
        card.className = 'shloka-card';
        
        const hindiHidden = langPref === 'english' ? 'hidden' : '';
        const englishHidden = langPref === 'hindi' ? 'hidden' : '';

        const sanskritHtml = v.sanskrit ? v.sanskrit.replace(/\n|\|\||\s\|\s/g, '<br>') : '';
        const transliterationHtml = v.transliteration ? v.transliteration.replace(/\n/g, '<br>') : '';

        card.innerHTML = `
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${id}" aria-label="Bookmark verse">
                ${isBookmarked ? '★' : '☆'}
            </button>
            <div class="sanskrit-text">${sanskritHtml}</div>
            <div class="transliteration">${transliterationHtml}</div>
            <div class="translation">
                <div class="translation-block hindi-trans ${hindiHidden}">
                    <span class="translation-label">Hindi</span>
                    <p>${v.hindi}</p>
                </div>
                <div class="translation-block english-trans ${englishHidden}">
                    <span class="translation-label">English</span>
                    <p>${v.english}</p>
                </div>
            </div>
        `;

        const btn = card.querySelector('.bookmark-btn');
        btn.addEventListener('click', (e) => toggleBookmark(e, id));
        shlokaContainerEl.appendChild(card);

        // Render Pagination Controls inside Right Page
        const pagination = document.createElement('div');
        pagination.className = 'pagination-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.textContent = '⟵ Previous';
        prevBtn.disabled = currentPageIndex === 0;
        prevBtn.addEventListener('click', () => turnToPage(currentPageIndex - 1));

        const pageIndicator = document.createElement('span');
        pageIndicator.className = 'page-indicator';
        pageIndicator.textContent = `Page ${currentPageIndex + 1} of ${currentDataset.length}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.textContent = 'Next ⟶';
        nextBtn.disabled = currentPageIndex === currentDataset.length - 1;
        nextBtn.addEventListener('click', () => turnToPage(currentPageIndex + 1));

        pagination.appendChild(prevBtn);
        pagination.appendChild(pageIndicator);
        pagination.appendChild(nextBtn);

        shlokaContainerEl.appendChild(pagination);
        
        if(progressBar) {
            const progress = ((currentPageIndex + 1) / currentDataset.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    };

    const toggleBookmark = (e, id) => {
        const btn = e.target;
        if (bookmarks.includes(id)) {
            bookmarks = bookmarks.filter(b => b !== id);
            btn.classList.remove('active');
            btn.innerHTML = '☆';
        } else {
            bookmarks.push(id);
            btn.classList.add('active');
            btn.innerHTML = '★';
        }
        localStorage.setItem('bgBookmarks', JSON.stringify(bookmarks));
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (!query) {
                if (currentChapter) {
                    loadChapter(currentChapter);
                } else {
                    goHome();
                }
                return;
            }
            
            goToReadingState();
            leftChapterTitleEl.textContent = 'Search Results';
            
            currentDataset = allVerses.filter(v => 
                (v.sanskrit && v.sanskrit.toLowerCase().includes(query)) ||
                (v.transliteration && v.transliteration.toLowerCase().includes(query)) ||
                (v.hindi && v.hindi.toLowerCase().includes(query)) ||
                (v.english && v.english.toLowerCase().includes(query))
            );
            currentPageIndex = 0;
            renderVerseList();
            renderCurrentPage();
        });
    }

    if(languageToggle) {
        languageToggle.addEventListener('change', () => {
            renderCurrentPage();
        });
    }

    fetchData();
});
