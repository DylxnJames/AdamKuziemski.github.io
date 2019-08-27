class TabComponent {
    constructor() {
        /** @private {number} */ this.currentlyOpenTab = 0;
        /** @private {number} */ this.tabSwipeStart = 0;
        /** @private {number} */ this.tabSwipePosition = 0;

        /** @private {HTMLDivElement} */ this.tabBar = document.getElementById('tab-bar');
        /** @private {HTMLDivElement} */ this.tabsContainer = document.getElementById('tab-container');
        /** @private {HTMLDivElement[]} */ this.tabs = [...document.getElementsByClassName('tab')];
        /** @private {HTMLDivElement[]} */ this.content = [...document.getElementsByClassName('tab-body')];

	    this.tabsContainer.addEventListener('touchstart', (event) => this.startSwipe(event), {passive: true});
	    this.tabsContainer.addEventListener('touchmove', (event) => this.moveSwipe(event), {passive: true});
        this.tabsContainer.addEventListener('touchend', () => this.endSwipe(), {passive: true});

        this.tabsContainer.addEventListener('scroll', () => this.hideOrDisplayScrollShadow());
        
        this.tabs.forEach(tab => tab.addEventListener('click', (event) => this.openClicked(event)));

        this.openTab(0);
    }

    /**
     * Opens a tab at the given index.
     * If the index is out of bounds, does nothing.
     * 
     * @param {number} index of the chosen tab
     */
    openTab(index) {
        if (index < 0 || index >= this.tabs.length) {
            return;
        }

        this.setIndicator(index);
        this.displayChild(index);

        this.tabsContainer.scrollTop = 0;
        this.hideOrDisplayScrollShadow();
    
        this.currentlyOpenTab = index;
    };

    /**
     * Sets display: block to all tabs to display them all at the same time.
     */
    linearizeTabs() {
        this.content.forEach(tab => tab.style.display = 'block');
    }

    /**
     * Returns to tab display mode after printing.
     */
    displayTabs() {
        this.openTab(this.currentlyOpenTab);
    }
    
    /**
     * @private
     * Saves the start position of the swipe event.
     * Resets current swipe position.
     * 
     * @param {TouchEvent} event 
     */
    startSwipe(event) {
        this.tabSwipeStart = event.touches[0].pageX;
        this.tabSwipePosition = 0;
    }

    /**
     * @private
     * Saves the current position of the swipe event.
     * 
     * @param {TouchEvent} event 
     */
    moveSwipe(event) {
        this.tabSwipePosition = event.touches[0].pageX;
    }
    
    /**
     * @private
     * Calculates the direction of the swipe and opens the appropriate tab.
     */
    endSwipe() {
        const tabSwipeThreshold = 50;
        const swipeChange = this.tabSwipeStart - this.tabSwipePosition;
        
        if (swipeChange < -tabSwipeThreshold && this.currentlyOpenTab > 0) {
            this.openTab(this.currentlyOpenTab - 1);
        } else if (swipeChange > tabSwipeThreshold && this.currentlyOpenTab < this.tabs.length - 1) {
            this.openTab(this.currentlyOpenTab + 1);
        }
    }

    /**
     * @private
     * Sets a tab indicator on a tab with given index
     * 
     * @param {number} index of the tab to indicate
     */
    setIndicator(index) {
        this.tabs.forEach(tab => tab.classList.remove('tab-open'));
        this.tabs[index].classList.add('tab-open');
    }

    /**
     * @private
     * Opens a tab at the given index
     *      
     * @param {number} index of the tab to display
     */
    displayChild(index) {
        this.content.forEach((tab, i) => {
            tab.style.display = i === index ? 'block' : 'none';
            tab.classList.remove('animate-left');
            tab.classList.remove('animate-right');
        });
        this.content[index].className += this.getTabAnimationClass(index);
    }

    /**
     * @private
     * Hides/displays inset shadows on top/bottom according to scroll position
     */
    hideOrDisplayScrollShadow() {
        if (this.tabsContainer.scrollTop === 0) {
            this.tabsContainer.classList.remove('tab-scrolled-top');
        } else {
            this.tabsContainer.classList.add('tab-scrolled-top');
        }

        if (this.tabsContainer.scrollTop + this.tabsContainer.clientHeight === this.tabsContainer.scrollHeight) {
            this.tabsContainer.classList.remove('tab-scrolled-bottom');
        } else {
            this.tabsContainer.classList.add('tab-scrolled-bottom');
        }
    }
    
    /**
     * @private
     * Opens the tab that raised the click event.
     * 
     * @param {MouseEvent} event coming from the clicked tab
     */
    openClicked(event) {
        this.openTab(this.tabs.findIndex(tab => tab.innerText === event.srcElement.innerText));
    }

    /**
     * @private
     * Resolves an animation type to use after a tab changes
     * 
     * @param {number} index of the tab to animate
     * @returns {string} css class to add to the element
     */
    getTabAnimationClass(index) {
        if (index > this.currentlyOpenTab) {
            return ' animate-right';
        } else if (index < this.currentlyOpenTab) {
            return ' animate-left';
        } else {
            return '';
        }
    };
}