const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQOTD');
const shareBtn = document.getElementById('shareQOTD');
const statusElement = document.getElementById('status');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');


async function fetchQOTD() {
    try {
        quoteElement.textContent = 'Loading...';
        authorElement.textContent = '';

        const response = await fetch('https://zenquotes.io/api/random');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const quote = data[0]; 

        quoteElement.textContent = `"${quote.q}"`;
        authorElement.textContent = `- ${quote.a}`;
        
        saveTodaysQuote({
            content: quote.q,
            author: quote.a
        });
        updateTimestamp();

    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteElement.textContent = 'Could not load quote. Please try again.';
        authorElement.textContent = '';
    }
}

function saveTodaysQuote(quoteData) {
  const today = new Date().toDateString();
  
  const quoteToSave = {
    content: quoteData.content,
    author: quoteData.author,
    date: today
  };
  
  localStorage.setItem('todaysQuote', JSON.stringify(quoteToSave));
}

function getTodaysQuote() {
  const savedQuote = localStorage.getItem('todaysQuote');
  
  if (!savedQuote) {
    return null;
  }
  
  const quoteData = JSON.parse(savedQuote);
  const today = new Date().toDateString();
  
  if (quoteData.date === today) {
    return quoteData;
  } else {
    return null;
  }
}

function displayQOTD(){
    const todaysQuote = getTodaysQuote();
    
    if (todaysQuote) {
        quoteElement.textContent = `"${todaysQuote.content}"`;
        authorElement.textContent = `- ${todaysQuote.author}`;
    } else {
        fetchQOTD();
    }
}

newQuoteBtn.addEventListener('click', function() {
    fetchQOTD();
});

shareBtn.addEventListener('click', function() {
    const quoteText = quoteElement.textContent;
    const authorText = authorElement.textContent;

    const message = `${quoteText} ${authorText}
    
    Get daily quotes from guavz QOTD
    Visit: [YOUR_APP_URL_HERE]`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
});

function updateStatus(){
    if(navigator.onLine){
        statusElement.textContent = '• Online';
        statusElement.style.color = 'green';
    } else {
        statusElement.textContent = '• Offline';
        statusElement.style.color = 'red';
    }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                scheduleQuoteNotification();
            } else {
                console.log('Notification permission denied.');
            }
        });
    }
}

function scheduleQuoteNotification() {
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    const today = new Date().toDateString();
    
    if (lastNotificationDate === today) {
        console.log('Already showed notification today');
        return; 
    }
    
    const todaysQuote = getTodaysQuote();
    
    if (todaysQuote && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('guavz Quote of the Day', {
                body: `${todaysQuote.content} — ${todaysQuote.author}`,
                icon: 'double-quotes.png',
                badge: 'double-quotes.png',
                tag: 'daily-quote',
                requireInteraction: false
            });
            
            localStorage.setItem('lastNotificationDate', today);
        });
    }
}

function updateTimestamp() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time24 = `${hours}:${minutes}`;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const dateYYYYMMDD = `${year}/${month}/${day}`;

    document.getElementById('time').textContent = time24;
    document.getElementById('date').textContent = dateYYYYMMDD;
}

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);   

window.addEventListener('load', () => {
    updateStatus();
    updateTimestamp();        
    displayQOTD();   
    
    setInterval(updateTimestamp, 1000);
});            

updateTimestamp();        
displayQOTD();

setInterval(updateTimestamp, 1000);

setTimeout(() => {
    requestNotificationPermission();
}, 3000);