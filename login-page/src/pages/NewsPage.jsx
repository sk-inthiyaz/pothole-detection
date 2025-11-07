import React, { useMemo, useState } from 'react';
import './NewsPage.css';

// Helper: get greeting by local time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getUserFirstName() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    const u = JSON.parse(raw);
    return u?.name ? u.name.split(' ')[0] : '';
  } catch {
    return '';
  }
}

const placeholderSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1f2a44"/>
        <stop offset="100%" stop-color="#3b2a5b"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9aa4b2" font-size="28" font-family="Inter, Roboto, system-ui">News image</text>
  </svg>`);

// Static news data
const newsData = [
  {
    id: 1,
    date: 'Nov 06, 2025, 12:35 IST',
    source: '[TOI]',
    image: '/news/newsimage-1.jpg',
    title:
      'Drunk driving, dozing off at wheel, or dodging pothole? What caused Telangana bus tragedy that killed 19?',
    description:
      'Investigators are probing three possible causes in the Chevella bus tragedy that killed 19 people and injured 25: drunk driving, driver fatigue, and the possibility that the tipper swerved to avoid a pothole...'
  },
  {
    id: 2,
    date: 'Oct 16, 2025, 16:41 IST',
    source: '[NDTV]',
    image: '/news/newsimage-2.jpg',
    title:
      '10 Students Injured As Bus Falls Off Maharashtra Bridge Because Of Potholes',
    description:
      'A school bus in Maharashtra reportedly fell off a bridge after hitting deep potholes. Ten students were injured; officials are assessing road maintenance lapses...'
  },
  {
    id: 3,
    date: 'Oct 21, 2025, 18:26 IST',
    source: '[Hindustan Times]',
    image: '/news/newsimage-3.jpg',
    title:
      'Bengaluru to get pothole-free? Siddaramaiah gives ultimatum, his deputy shares update',
    description:
      'Karnataka CM Siddaramaiah issued a deadline to fix city potholes as civic authorities share progress; residents await lasting solutions...'
  },
  {
    id: 4,
    date: 'Oct 25, 2025, 13:28 IST',
    source: '[NDTV]',
    image: '/news/newsimage-4.jpg',
    title:
      'Bengaluru Pothole Claims Another Life, 26-Year-Old Banker Run Over By Truck',
    description:
      'A tragic incident in Bengaluru as a 26-year-old banker was run over after a fall allegedly caused by a pothole. Calls grow for urgent road safety action...'
  },
  {
    id: 5,
    date: 'Oct 14, 2025, 05:40 IST',
    source: '[Hindustan Times]',
    image: '/news/newsimage-5.jpg',
    title:
      'Pay ₹6 lakh to families of pothole-death victims: HC to civic bodies',
    description:
      'The High Court directed civic bodies to compensate families of pothole-related death victims with ₹6 lakh, stressing accountability and timely repairs...'
  },
  {
    id: 6,
    date: 'Nov 02, 2024, 22:25 IST',
    source: '[TOI]',
    image: '/news/newsimage-6.jpg',
    title:
      'Andhra Pradesh CM Naidu vows pothole-free roads by Sankranti, announces infrastructure plans',
    description:
      'AP CM Chandrababu Naidu promised pothole-free roads by Sankranti with accelerated infra projects and strict monitoring mechanisms...'
  },
  {
    id: 7,
    date: 'Apr 21, 2025',
    source: '[BBC]',
    image: '/news/newsimage-7.jpg',
    title: "Why India's roads are among the world's deadliest",
    description:
      "A deep dive into road safety challenges in India — from speeding to infrastructure gaps — and what it takes to reverse the trend..."
  },
  {
    id: 8,
    date: 'Feb 28, 2025, 11:58 IST',
    source: '[Business Standard]',
    image: '/news/newsimage-8.jpg',
    title:
      'Over-speeding to potholes: The many reasons Indian roads are unsafe',
    description:
      'An analysis of the key factors behind India’s unsafe roads — speeding, poor enforcement, and deteriorating road quality including potholes...'
  }
];

const NewsPage = () => {
  const [likes, setLikes] = useState(() => new Set());
  const name = useMemo(() => getUserFirstName(), []);
  const greeting = useMemo(() => getGreeting(), []);

  const toggleLike = (id) => {
    setLikes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="news-page">
      <div className="news-topbar">
        <h1 className="news-greeting">{greeting}{name ? `, ${name}` : ''}</h1>
        <div className="news-infobox" title="Annual road safety stats (indicative)">
          Around 6,800 pothole accidents and 2,300 fatalities occur every year in India.
        </div>
      </div>

      <div className="news-grid">
        {newsData.map((n, idx) => (
          <article
            key={n.id}
            className="news-card"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <div className="news-imageWrap">
              <img
                src={n.image}
                alt={n.title}
                onError={(e) => {
                  if (e.currentTarget.src !== placeholderSvg) {
                    e.currentTarget.src = placeholderSvg;
                  }
                }}
              />
              <span className="news-date">{n.date}</span>
            </div>
            <div className="news-content">
              <div className="news-source">{n.source}</div>
              <h3 className="news-title">{n.title}</h3>
              <p className="news-description">{n.description}</p>
            </div>
            <button
              className={`like-btn ${likes.has(n.id) ? 'liked' : ''}`}
              aria-label={likes.has(n.id) ? 'Unlike' : 'Like'}
              onClick={() => toggleLike(n.id)}
            >
              <span>❤</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
