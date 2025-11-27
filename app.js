const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQOTD');
const shareBtn = document.getElementById('shareQOTD');
const statusElement = document.getElementById('status');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const themeToggle = document.getElementById('themeToggle');

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


async function fetchQOTD() {
    try {
        quoteElement.textContent = 'Loading...';
        authorElement.textContent = '';

        const response = await fetch('https://dummyjson.com/quotes/random');
        
        if (!response.ok) {
            throw new Error('API failed');
        }
        
        const data = await response.json();

        quoteElement.textContent = `"${data.quote}"`;
        authorElement.textContent = `- ${data.author}`;
        
        saveTodaysQuote({
            content: data.quote,
            author: data.author
        });
        updateTimestamp();

    } catch (error) {
        console.error('Error fetching quote, using fallback:', error);
        
        const fallbackQuotes = [
            { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
            { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
            { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
        ];
        
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        
        quoteElement.textContent = `"${randomQuote.content}"`;
        authorElement.textContent = `- ${randomQuote.author}`;
        
        saveTodaysQuote(randomQuote);
        updateTimestamp();
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
    Visit: https://guavz-qotd.vercel.app/`;

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
    initTheme();
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