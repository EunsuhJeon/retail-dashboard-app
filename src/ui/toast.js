// Toast notification utility

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  const typeClass = type === 'success' ? 'toast-success' : 
                    type === 'error' ? 'toast-error' : 
                    'toast-info';
  
  toast.className = `toast ${typeClass}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
