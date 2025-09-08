// main.js
// Import Firebase + config
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elemen form
const nisSelect = document.getElementById("nis");
const namaInput = document.getElementById("nama");
const kelasInput = document.getElementById("kelas");
const tanggalInput = document.getElementById("tanggal");
const jenisInput = document.getElementById("jenis");
const keteranganInput = document.getElementById("keterangan");
const form = document.getElementById("izinForm");
const status = document.getElementById("status");

// Load data siswa dari koleksi "siswa"
async function loadSiswa() {
  const querySnapshot = await getDocs(collection(db, "siswa")); // huruf kecil sesuai Firestore
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const option = document.createElement("option");
    option.value = data.nis;        // ambil NIS dari field
    option.textContent = data.nama;
    option.dataset.nama = data.nama;
    option.dataset.kelas = data.kelas;
    nisSelect.appendChild(option);
  });
}

// Pilih siswa otomatis isi nama & kelas
nisSelect.addEventListener("change", (e) => {
  const selected = e.target.selectedOptions[0];
  namaInput.value = selected.dataset.nama || "";
  kelasInput.value = selected.dataset.kelas || "";
});

// Submit form ke Firestore
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nis = nisSelect.value;
  const nama = namaInput.value;
  const kelas = kelasInput.value;
  const tanggal = tanggalInput.value;
  const jenis = jenisInput.value;
  const keterangan = keteranganInput.value;

  if (!nis || !tanggal || !jenis || !keterangan) {
    status.style.color = "red";
    status.textContent = "Harap isi semua data!";
    return;
  }

  try {
    await setDoc(doc(db, "Izin_Sakit", tanggal, nis), {
      nama,
      kelas,
      jenis,
      keterangan,
      tanggal
    });

    status.style.color = "green";
    status.textContent = "Data berhasil dikirim!";
    form.reset();
    namaInput.value = "";
    kelasInput.value = "";
  } catch (error) {
    console.error(error);
    status.style.color = "red";
    status.textContent = "Gagal mengirim data!";
  }
});

// Jalankan load siswa saat halaman dibuka
loadSiswa();
