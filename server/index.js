const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8001;
const CARS_FILE_PATH = './data/cars.json'; // Path ke file JSON untuk menyimpan data mobil

// Middleware untuk mengizinkan express memahami body dari request dalam format JSON
app.use(express.json());

// Baca data mobil dari file saat server dimulai
let cars = [];
fs.readFile(CARS_FILE_PATH, (err, data) => {
	if (err) {
		console.error('Error reading cars file:', err);
	} else {
		cars = JSON.parse(data);
	}
});

// Endpoint untuk handling request / (ping)
app.get('/', (req, res) => {
	res.json({ message: 'Ping successfully' });
});

// Endpoint untuk mendapatkan seluruh data mobil
app.get('/list-cars', (req, res) => {
	res.json(cars);
});

// Endpoint untuk mendapatkan detail mobil berdasarkan ID
app.get('/detail-car/:id', (req, res) => {
	const id = req.params.id;
	const car = cars.find((car) => car.id === id);
	if (!car) {
		res.status(404).json({ message: 'Car not found' });
	} else {
		res.json(car);
	}
});

// Endpoint untuk menambahkan data mobil baru
app.post('/create-car', (req, res) => {
	const newCar = req.body;
	cars.push(newCar);
	// Tulis kembali data mobil ke file
	fs.writeFile(CARS_FILE_PATH, JSON.stringify(cars), (err) => {
		if (err) {
			console.error('Error writing cars file:', err);
		}
	});
	res.status(201).json(newCar);
});

// Endpoint untuk memperbarui data mobil berdasarkan ID
app.put('/update-car/:id', (req, res) => {
	const id = req.params.id;
	const updatedCar = req.body;
	let index = cars.findIndex((car) => car.id === id);
	if (index === -1) {
		res.status(404).json({ message: 'Car not found' });
	} else {
		cars[index] = { ...cars[index], ...updatedCar };
		// Tulis kembali data mobil ke file
		fs.writeFile(CARS_FILE_PATH, JSON.stringify(cars), (err) => {
			if (err) {
				console.error('Error writing cars file:', err);
			}
		});
		res.json(cars[index]);
	}
});

// Endpoint untuk menghapus data mobil berdasarkan ID
app.delete('/delete-car/:id', (req, res) => {
	const id = req.params.id;
	const deletedCar = cars.find((car) => car.id === id);
	if (!deletedCar) {
		res.status(404).json({ message: 'Car not found' });
	} else {
		cars = cars.filter((car) => car.id !== id);
		// Tulis kembali data mobil ke file
		fs.writeFile(CARS_FILE_PATH, JSON.stringify(cars), (err) => {
			if (err) {
				console.error('Error writing cars file:', err);
			}
		});
		res.json(deletedCar);
	}
});

// Menghandle kesalahan jika endpoint tidak ditemukan
app.use((req, res) => {
	res.status(404).json({ message: 'Endpoint not found' });
});

// Menjalankan server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});