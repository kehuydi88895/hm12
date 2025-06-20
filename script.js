// Global variables
let countdownInterval;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Initialize image gallery
    initializeGallery();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize countdown
    initializeCountdown();
    
    // Add event listeners
    addEventListeners();
    
    // Test popup functionality
    testPopupFunctionality();
}

function initializeGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    if (!mainImage) {
        console.warn('Main image element not found');
        return;
    }
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            mainImage.src = this.src;
            mainImage.alt = this.alt;
            
            // Add loading effect
            mainImage.style.opacity = '0.7';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 200);
        });
    });
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get tab target
            const target = this.getAttribute('data-tab');
            console.log('Tab clicked:', target);
            
            // You can add tab content switching logic here
            switchTabContent(target);
        });
    });
}

function switchTabContent(tab) {
    // This function can be expanded to show/hide different content sections
    console.log('Switching to tab:', tab);
    
    // Example: scroll to relevant section
    switch(tab) {
        case 'overview':
            document.getElementById('SECTION1')?.scrollIntoView({ behavior: 'smooth' });
            break;
        case 'reviews':
            document.getElementById('SECTION3')?.scrollIntoView({ behavior: 'smooth' });
            break;
        case 'description':
            // Scroll to description section if it exists
            break;
        case 'suggestions':
            // Scroll to suggestions section if it exists
            break;
    }
}

function initializeCountdown() {
    // Set target date (24 hours from now)
    const targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    countdownInterval = setInterval(() => {
        updateCountdown(targetDate);
    }, 1000);
    
    // Initial update
    updateCountdown(targetDate);
}

function updateCountdown(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        clearInterval(countdownInterval);
        console.log('Countdown finished');
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update countdown display
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
}

function addEventListeners() {
    // Review image lightbox
    const reviewImages = document.querySelectorAll('.review-image');
    reviewImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageLightbox(this.src, this.alt);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hidePopup();
        }
    });
    
    // Prevent form submission on Enter key in input fields (except submit button)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
            e.preventDefault();
        }
    });
}

function openImageLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -15px;
        right: -15px;
        background: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(lightbox);
    
    // Close on overlay click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Store reference for closing
    window.currentLightbox = lightbox;
}

function closeLightbox() {
    if (window.currentLightbox) {
        document.body.removeChild(window.currentLightbox);
        window.currentLightbox = null;
    }
}

// Main popup functions
function showPopup() {
    console.log('showPopup called');
    
    const popup = document.getElementById('popupOverlay');
    if (!popup) {
        console.error('Popup element not found!');
        createPopupAlert();
        return;
    }
    
    console.log('Showing popup...');
    popup.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstInput = popup.querySelector('input[name="name"]');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }
    
    // Analytics or tracking
    trackEvent('popup_opened', 'product_purchase');
}

function hidePopup() {
    console.log('hidePopup called');
    
    const popup = document.getElementById('popupOverlay');
    if (!popup) {
        console.error('Popup element not found!');
        return;
    }
    
    popup.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear form if needed
    const form = document.getElementById('orderForm');
    if (form) {
        clearFormErrors(form);
    }
}

function createPopupAlert() {
    // Fallback if popup element is missing
    const userConfirmed = confirm('Bạn muốn đặt hàng sản phẩm này?\n\nVui lòng cung cấp thông tin:\n- Họ tên\n- Số điện thoại\n- Địa chỉ');
    
    if (userConfirmed) {
        const name = prompt('Họ và tên:');
        const phone = prompt('Số điện thoại:');
        const address = prompt('Địa chỉ:');
        
        if (name && phone && address) {
            alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
            
            // Send data to server
            submitOrder({
                name: name,
                phone: phone,
                address: address,
                quantity: 1,
                size: 'M',
                color: 'combo-white-black'
            });
        }
    }
}

function handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        console.log('Form validation failed');
        return;
    }
    
    // Convert FormData to object
    const orderData = {};
    formData.forEach((value, key) => {
        orderData[key] = value;
    });
    
    console.log('Order data:', orderData);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Đang xử lý...';
    submitBtn.disabled = true;
    
    // Submit order
    submitOrder(orderData)
        .then(response => {
            console.log('Order submitted successfully:', response);
            showSuccessMessage();
            form.reset();
            hidePopup();
        })
        .catch(error => {
            console.error('Order submission failed:', error);
            showErrorMessage('Có lỗi xảy ra. Vui lòng thử lại!');
        })
        .finally(() => {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

function validateForm(form) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors(form);
    
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldName = field.name;
        let errorMessage = '';
        
        if (!value) {
            errorMessage = 'Trường này là bắt buộc';
            isValid = false;
        } else {
            // Specific validations
            switch(fieldName) {
                case 'phone':
                    if (!validatePhone(value)) {
                        errorMessage = 'Số điện thoại không hợp lệ';
                        isValid = false;
                    }
                    break;
                case 'quantity':
                    if (parseInt(value) < 1) {
                        errorMessage = 'Số lượng phải lớn hơn 0';
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (errorMessage) {
            showFieldError(field, errorMessage);
        }
    });
    
    return isValid;
}

function validatePhone(phone) {
    const phoneRegex = /^(\+84|0)(9|8|7|5|3)[0-9]{8}$/;
    return phoneRegex.test(phone);
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    // Create or update error message
    let errorElement = formGroup.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFormErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

function submitOrder(orderData) {
    return new Promise((resolve, reject) => {
        // Simulate API call
        console.log('Submitting order to server:', orderData);
        
        // Add timestamp and ID
        orderData.timestamp = new Date().toISOString();
        orderData.orderId = 'ORD-' + Date.now();
        
        // Simulate network delay
        setTimeout(() => {
            // Randomly simulate success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate
                resolve({
                    success: true,
                    orderId: orderData.orderId,
                    message: 'Đơn hàng đã được tạo thành công!'
                });
            } else {
                reject(new Error('Server error'));
            }
        }, 1500);
    });
}

function showSuccessMessage() {
    // Create success popup
    const successPopup = document.createElement('div');
    successPopup.className = 'success-popup';
    successPopup.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3>Đặt hàng thành công!</h3>
            <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
            <button onclick="closeSuccessPopup()" class="success-btn">Đóng</button>
        </div>
    `;
    
    // Add styles
    successPopup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
    `;
    
    document.body.appendChild(successPopup);
    window.currentSuccessPopup = successPopup;
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeSuccessPopup();
    }, 3000);
}

function closeSuccessPopup() {
    if (window.currentSuccessPopup) {
        document.body.removeChild(window.currentSuccessPopup);
        window.currentSuccessPopup = null;
    }
}

function showErrorMessage(message) {
    alert(message); // Simple error display
}

function trackEvent(eventName, category) {
    // Analytics tracking
    console.log('Event tracked:', eventName, category);
    
    // Here you would integrate with Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category,
            event_label: 'product_page'
        });
    }
}

function testPopupFunctionality() {
    // Test if popup elements exist
    const popup = document.getElementById('popupOverlay');
    const form = document.getElementById('orderForm');
    
    console.log('Popup element exists:', !!popup);
    console.log('Form element exists:', !!form);
    
    if (!popup) {
        console.error('CRITICAL: Popup overlay element is missing!');
    }
    
    if (!form) {
        console.error('CRITICAL: Order form element is missing!');
    }
    
    // Test if buttons have click handlers
    const buyButtons = document.querySelectorAll('[onclick*="showPopup"]');
    console.log('Buy buttons found:', buyButtons.length);
    
    if (buyButtons.length === 0) {
        console.warn('No buy buttons found with showPopup onclick handler');
    }
}

// Export functions to global scope for onclick handlers
window.showPopup = showPopup;
window.hidePopup = hidePopup;
window.handleSubmit = handleSubmit;
window.closeLightbox = closeLightbox;
window.closeSuccessPopup = closeSuccessPopup;

// Additional utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause countdown if needed
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    } else {
        // Page is visible, resume countdown
        initializeCountdown();
    }
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

console.log('Script loaded successfully');