import { db } from '@/lib/firebase.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Fetches all movies from the 'movies' collection in Firestore.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 * @throws {Error} Throws an error to be handled by the caller if fetching fails.
 */
export const getAllMovies = async () => {
	try {
		const moviesCollection = collection(db, 'movies');
		const querySnapshot = await getDocs(moviesCollection);
		const moviesData = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return moviesData;
	} catch (err) {
		console.error('Error fetching all movies: ', err);
		throw new Error('ไม่สามารถดึงข้อมูลหนังทั้งหมดได้');
	}
};

/**
 * Fetches a single movie by its ID from Firestore.
 * @param {string} id The ID of the movie to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the movie object if found, otherwise null.
 * @throws {Error} Throws an error to be handled by the caller if fetching fails.
 */
export const getMovieById = async (id) => {
	const docRef = doc(db, 'movies', id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	} else {
		return null;
	}
};