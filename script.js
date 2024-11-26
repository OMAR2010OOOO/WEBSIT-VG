

function initializePage() {
    if (isPageLoaded) return;
    isPageLoaded = true;

    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'en') {
        currentLang = 'en';
        const langBtn = document.querySelector('.lang-btn');
        if (langBtn) {
            langBtn.textContent = 'العربية';
            document.title = 'TITAN';
        }
    }

    updateContent();
    updateDirection();

    initializeProducts();

    initializeScrollEvents();

    initializeModal();

    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }
}

function initializeProducts() {
    document.querySelectorAll('.product').forEach(product => {
        const productName = product.querySelector('h3').textContent;
        const featuresContainer = product.querySelector('.product-features');
        
        if (featuresContainer) {
            const features = translations[currentLang].features[productName];
            if (features) {
                featuresContainer.innerHTML = features.map(feature => 
                    `<span class="feature"><i class="fas fa-check"></i> ${feature}</span>`
                ).join('');
            }
        }

        if (productName === 'TITAN-LOOP') {
            const learnMoreBtn = product.querySelector('.product-hover') || 
                               document.createElement('button');
            learnMoreBtn.className = 'product-hover';
            learnMoreBtn.textContent = translations[currentLang].learnMore;
            
            if (!product.querySelector('.product-hover')) {
                product.appendChild(learnMoreBtn);
            }

            product.addEventListener('click', function(e) {
                if (!e.target.closest('.product-features')) {
                    showProductDetails(productName);
                }
            });
        } else {
            const learnMoreBtn = product.querySelector('.product-hover');
            if (learnMoreBtn) {
                learnMoreBtn.remove();
            }
            showDownloadButton(product);
        }
    });
}

function initializeScrollEvents() {
    const scrollHandler = debounce(() => {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = `${scrolled}%`;
        }

        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        }

        const products = document.querySelectorAll('.product:not(.animate)');
        products.forEach(product => {
            if (isElementInViewport(product)) {
                requestAnimationFrame(() => {
                    product.classList.add('animate');
                });
            }
        });
    }, 16);

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
}

function initializeModal() {
    const modal = document.getElementById('priceModal');
    const closeBtn = document.querySelector('.close-modal');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('load', () => {
    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


function updateAllTranslations() {
    // تحديث العناوين
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // تحديث الميزات
    document.querySelectorAll('.product').forEach(product => {
        const productName = product.querySelector('h3').textContent;
        const featuresContainer = product.querySelector('.product-features');
        if (featuresContainer && translations[currentLang].features[productName]) {
            featuresContainer.innerHTML = translations[currentLang].features[productName]
                .map(feature => `<span class="feature"><i class="fas fa-check"></i> ${feature}</span>`)
                .join('');
        }
    });

    // تحديث أزرار التحميل
    document.querySelectorAll('.download-button span').forEach(button => {
        button.textContent = translations[currentLang].download;
    });

    // تحديث عناوين الأكواد المجانية
    document.querySelectorAll('.free-code-label').forEach(label => {
        label.textContent = translations[currentLang].freeCode;
    });

    // تحديث زر اضغط للمزيد
    document.querySelectorAll('.product-hover').forEach(button => {
        button.textContent = translations[currentLang].learnMore;
    });

    // تحديث نصوص النافذة المنبثقة
    const modal = document.getElementById('priceModal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            const productName = modalTitle.dataset.product;
            if (productName) {
                modalTitle.textContent = translations[currentLang].products[productName];
            }
        }

        // تحديث نصوص الأسعار
        modal.querySelectorAll('.duration').forEach(duration => {
            const key = duration.dataset.duration;
            if (key && translations[currentLang].modal[key]) {
                duration.textContent = translations[currentLang].modal[key];
            }
        });
    }
}

function updateDirection() {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function typeEffect(element, text, speed = 100) {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isDark = !document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    requestAnimationFrame(() => {
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function contactDev() {
    if (currentLang === 'ar') {
        const contactSection = document.querySelector('.contact-dev');
        contactSection.style.display = 'block';
        
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showProductDetails(productName) {
    const modal = document.getElementById('priceModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = translations[currentLang].products[productName];
    }

    modal.style.display = 'block';
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(0)';
            modalContent.style.opacity = '1';
        }
    }, 10);

    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(-20px)';
                modalContent.style.opacity = '0';
            }
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(-20px)';
                modalContent.style.opacity = '0';
            }
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    };
}

const style = document.createElement('style');
style.textContent = `
.toast {
    position: fixed;
    bottom: 20px;j
    right: 20px;
    padding: 1rem 2rem;
    background: rgba(17, 34, 64, 0.9);
    color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(100, 255, 218, 0.2);
    font-family: 'Cairo', sans-serif;
}

.toast.show {
    transform: translateY(0);
    opacity: 1;
}

.toast i {
    font-size: 1.2em;
    color: #64ffda;
}

[lang="ar"] .toast {
    right: auto;
    left: 20px;
}
`;
document.head.appendChild(style);

function showDownloadButton(product) {
    const existingButton = product.querySelector('.download-button-container');
    if (existingButton) {
        existingButton.remove();
    }

    const productName = product.querySelector('h3').textContent;
    let downloadLink = '';
    if (productName === 'TITAN-HK') {
        downloadLink = 'https://www.mediafire.com/file/olri221sle1zj1i/Titan-3.5.rar/file';
    } else if (productName === 'TITAN-BP') {
        downloadLink = 'https://www.mediafire.com/file/q8lmpgy2t60g4zn/Titan_BP.rar/file';
    }

    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'download-button-container show';
    
    const freeCodeHtml = productName === 'TITAN-HK' || productName === 'TITAN-BP' ? `
        <div class="free-code">
            <span class="free-code-label">${translations[currentLang].freeCode}</span>
            <div class="code-text">${productName === 'TITAN-HK' ? 'TITAN-213RL-WSDAC' : 'TITAN-BP-3DAYS'}</div>
        </div>
    ` : '';

    downloadContainer.innerHTML = `
        ${freeCodeHtml}
        <a href="${downloadLink}" 
           class="download-button" 
           target="_blank">
            <i class="fas fa-download"></i>
            <span>${translations[currentLang].download}</span>
            <div class="button-glow"></div>
        </a>
    `;

    const featuresContainer = product.querySelector('.product-features');
    if (featuresContainer) {
        featuresContainer.after(downloadContainer);
    }
}

function updateDownloadButtons() {
    document.querySelectorAll('.download-button-container').forEach(container => {
        const downloadButton = container.querySelector('.download-button span');
        const freeCodeLabel = container.querySelector('.free-code-label');
        
        if (downloadButton) {
            downloadButton.textContent = translations[currentLang].download;
        }
        if (freeCodeLabel) {
            freeCodeLabel.textContent = translations[currentLang].freeCode;
        }
    });
}

// تحسين أداء التمرير
const optimizedScroll = (() => {
    let ticking = false;
    return (callback) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
    };
})();

// تحسين أداء تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأجيل تحميل الصور والأيقونات
    const lazyElements = document.querySelectorAll('.product-icon i, img[data-src]');
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.dataset.src) {
                    entry.target.src = entry.target.dataset.src;
                }
                entry.target.classList.add('loaded');
                lazyLoadObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '50px' });

    lazyElements.forEach(el => lazyLoadObserver.observe(el));

    // تحسين أداء التمرير
    window.addEventListener('scroll', () => {
        optimizedScroll(() => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            requestAnimationFrame(() => {
                document.querySelector('.scroll-progress').style.width = `${scrolled}%`;
            });
        });
    }, { passive: true });
});

// تحسين أداء التأثيرات الحركية
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    document.documentElement.style.setProperty('--transition-duration', '0.1s');
}

// إضافة معالجة تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // إخفاء شاشة التحميل بعد تحميل الصفحة
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500);
        }, 500);
    }

    // تهيئة باقي الصفحة
    initializeApp();
});



