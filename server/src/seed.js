import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import Theatre from './models/Theatre.js';
import Show from './models/Show.js';

const movies = [
  { title: 'Neon Horizon', synopsis: 'A fearless pilot discovers a signal that could change humanity forever.', genres: ['Sci-Fi', 'Adventure'], language: 'English', durationMinutes: 132, rating: 8.4, certificate: 'UA', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', cast: ['Ava Stone', 'Leo Hart'] },
  { title: 'The Last Monsoon', synopsis: 'Two strangers cross paths in a small town during an unforgettable monsoon.', genres: ['Drama', 'Romance'], language: 'Hindi', durationMinutes: 124, rating: 7.8, certificate: 'UA', posterUrl: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg', cast: ['Mira Rao', 'Arjun Mehta'] },
  { title: 'Midnight Protocol', synopsis: 'An analyst has one night to stop a city-wide cyber attack.', genres: ['Thriller', 'Action'], language: 'English', durationMinutes: 116, rating: 8.1, certificate: 'A', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', cast: ['Nina Cole', 'Dev Malik'] },
  { title: 'Laughing Matters', synopsis: 'A family road trip spirals into a comedy of delightful disasters.', genres: ['Comedy', 'Family'], language: 'Hindi', durationMinutes: 108, rating: 7.2, certificate: 'U', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', cast: ['Kabir Shah', 'Riya Sen'] },
  { title: 'Kingdom of Ash', synopsis: 'A fallen kingdom rises when an unlikely hero finds an ancient secret.', genres: ['Fantasy', 'Adventure'], language: 'English', durationMinutes: 145, rating: 8.6, certificate: 'UA', posterUrl: 'https://image.tmdb.org/t/p/w500/5aXG0B3TYTpQsodXzvYCk7k1xX.jpg', cast: ['Ishan Verma', 'Tara Blake'] },
  { title: 'Blue Frequency', synopsis: 'A musician hears a mysterious melody connected to a missing person.', genres: ['Mystery', 'Drama'], language: 'English', durationMinutes: 119, rating: 7.9, certificate: 'UA', posterUrl: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', cast: ['Zoe Kim', 'Rohan Das'] }
];
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
  await Movie.deleteMany({});
  const inserted = await Movie.insertMany(movies);
  let theatre = await Theatre.findOne({ name: 'iMovies Central' });
  if (!theatre) theatre = await Theatre.create({ name: 'iMovies Central', city: 'Indore', address: 'Central Avenue, Indore', screens: 3 });
  await Show.deleteMany({});
  const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(18, 30, 0, 0);
  const showDocs = [];
  for (const [index, movie] of inserted.entries()) {
    for (const offset of [0, 2, 4]) {
      const startsAt = new Date(start); startsAt.setDate(start.getDate() + offset);
      startsAt.setHours(12 + (index % 5), index % 2 ? 0 : 30, 0, 0);
      showDocs.push({ movie: movie._id, theatre: theatre._id, startsAt, screen: (index % 3) + 1, seatCount: 60, price: 180 + (index % 3) * 40 });
    }
  }
  await Show.insertMany(showDocs);
  console.log(`Seeded ${inserted.length} movies, 1 theatre and ${showDocs.length} shows.`);
} catch (e) { console.error(e.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
