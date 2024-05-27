const nationalities = ["AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE", "IN", "IR", "MX", "NL", "NO", "NZ", "RS", "TR", "UA", "US"];

document.getElementById('generate-random').addEventListener('click', () => generateUser());
document.getElementById('choose-nationality').addEventListener('click', () => showNationalities());
document.getElementById('generate-again').addEventListener('click', () => generateUser(lastNationality));
document.getElementById('choose-again').addEventListener('click', () => resetView());
document.getElementById('download-details').addEventListener('click', () => downloadDetails());
document.getElementById('random-nationality').addEventListener('click', () => generateUser(getRandomNationality()));

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', toggleTheme);

let lastNationality = '';
let currentUser = null;
let isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

// Set the initial theme
setTheme(isDarkTheme);

function generateUser(nat = '') {
    const url = nat ? `https://randomuser.me/api/?nat=${nat}` : 'https://randomuser.me/api/';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            currentUser = data.results[0];
            displayUser(currentUser);
        })
        .catch(error => console.error('Error:', error));

    document.getElementById('initial-buttons').classList.add('hidden');
    document.getElementById('nationality-grid').classList.add('hidden');
    lastNationality = nat;
}

function displayUser(user) {
    document.getElementById('user-image').src = user.picture.large;
    document.getElementById('user-info').innerHTML = `
        <strong>Name:</strong> ${user.name.title} ${user.name.first} ${user.name.last}<br>
        <strong>Gender:</strong> ${user.gender}<br>
        <strong>Email:</strong> ${user.email}<br>
        <strong>Username:</strong> ${user.login.username}<br>
        <strong>Password:</strong> ${user.login.password}<br>
        <strong>DOB:</strong> ${new Date(user.dob.date).toLocaleDateString()} (Age: ${user.dob.age})<br>
        <strong>Registered:</strong> ${new Date(user.registered.date).toLocaleDateString()} (Age: ${user.registered.age})<br>
        <strong>Phone:</strong> ${user.phone}<br>
        <strong>Cell:</strong> ${user.cell}<br>
        <strong>ID:</strong> ${user.id.name}: ${user.id.value}<br>
        <strong>Address:</strong> ${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}<br>
        <strong>Coordinates:</strong> Latitude ${user.location.coordinates.latitude}, Longitude ${user.location.coordinates.longitude}<br>
        <strong>Timezone:</strong> ${user.location.timezone.description} (${user.location.timezone.offset})<br>
        <strong>Nationality:</strong> ${user.nat}
    `;
    document.getElementById('user-details').classList.remove('hidden');
}

function showNationalities() {
    const grid = document.getElementById('nationalities');
    grid.innerHTML = '';
    nationalities.forEach(nat => {
        const button = document.createElement('button');
        button.textContent = nat;
        button.addEventListener('click', () => generateUser(nat));
        grid.appendChild(button);
    });
    document.getElementById('nationality-grid').classList.remove('hidden');
    document.getElementById('initial-buttons').classList.add('hidden');
}

function resetView() {
    document.getElementById('user-details').classList.add('hidden');
    document.getElementById('initial-buttons').classList.remove('hidden');
}

function getRandomNationality() {
    const randomIndex = Math.floor(Math.random() * nationalities.length);
    return nationalities[randomIndex];
}

function downloadDetails() {
    if (!currentUser) return;

    const zip = new JSZip();
    const img = zip.folder("image");
    const details = zip.folder("details");

    // Fetch the image and add it to the ZIP file
    fetch(currentUser.picture.large)
        .then(response => response.blob())
        .then(blob => {
            img.file("user-image.jpg", blob);

            // Create the details.txt file content
            const detailsContent = `
                Name: ${currentUser.name.title} ${currentUser.name.first} ${currentUser.name.last}
                Gender: ${currentUser.gender}
                Email: ${currentUser.email}
                Username: ${currentUser.login.username}
                Password: ${currentUser.login.password}
                DOB: ${new Date(currentUser.dob.date).toLocaleDateString()} (Age: ${currentUser.dob.age})
                Registered: ${new Date(currentUser.registered.date).toLocaleDateString()} (Age: ${currentUser.registered.age})
                Phone: ${currentUser.phone}
                Cell: ${currentUser.cell}
                ID: ${currentUser.id.name}: ${currentUser.id.value}
                Address: ${currentUser.location.street.number} ${currentUser.location.street.name}, ${currentUser.location.city}, ${currentUser.location.state}, ${currentUser.location.country}, ${currentUser.location.postcode}
                Coordinates: Latitude ${currentUser.location.coordinates.latitude}, Longitude ${currentUser.location.coordinates.longitude}
                Timezone: ${currentUser.location.timezone.description} (${currentUser.location.timezone.offset})
                Nationality: ${currentUser.nat}
            `;
            details.file("details.txt", detailsContent.trim());

            // Generate the ZIP file and trigger the download
            zip.generateAsync({ type: "blob" }).then(content => {
                saveAs(content, "user-details.zip");
            });
        })
        .catch(error => console.error('Error:', error));
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    setTheme(isDarkTheme);
    localStorage.setItem('isDarkTheme', isDarkTheme);
}

function setTheme(isDark) {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    if (isDark) {
        body.style.backgroundColor = '#333';
        body.style.color = '#fff';
        themeToggle.checked = true;
    } else {
        body.style.backgroundColor = '#f0f0f0';
        body.style.color = '#000';
        themeToggle.checked = false;
    }
}