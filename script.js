const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const iterationElement = document.querySelector(".iteration");
const clusterBtn = document.querySelector("#startClusteringBtn");
const toggleTblBtn = document.querySelector("#toggleTblBtn");
const expTrigger = document.querySelector(".exp_trigger");
const explanation = document.querySelector(".explanation");
const downArrow = expTrigger.querySelector(".fa-chevron-down");
const upArrow = expTrigger.querySelector(".fa-chevron-up");

expTrigger.addEventListener("click", function () {
	// Toggle the 'open' class on explanation
	explanation.classList.toggle("open");

	// Toggle visibility of arrows
	if (explanation.classList.contains("open")) {
		downArrow.style.display = "none";
		upArrow.style.display = "inline-block";
	} else {
		downArrow.style.display = "inline-block";
		upArrow.style.display = "none";
	}
});

toggleTblBtn.addEventListener("click", function () {
	toggleTableVisibility();
});

clusterBtn.addEventListener("click", function () {
	startVisualization();
});
// Define colors for centroids
const centroidColors = [
	"#fbb4ae", // pastel red
	"#b3cde3", // pastel blue
	"#ccebc5", // pastel green
	"#decbe4", // pastel purple
	"#fed9a6", // pastel orange
	"#ffffcc", // pastel yellow
	"#e5d8bd", // pastel brown
	"#fddaec", // pastel pink
	"#f2f2f2", // very light grey
	"#b3e2cd", // pastel teal
	"#fdcdac", // pastel peach
	"#cbd5e8", // light periwinkle
	"#f4cae4", // light mauve
	"#e6f5c9", // light lime green
	"#fff2ae", // light lemon
	"#f1e2cc", // light beige
	"#cccccc", // light grey
	"#e6f5d0", // very pale green
	"#f3e5ab", // very pale yellow
	"#e3cde4", // soft violet
];

function startVisualization() {
	const dataFile = document.getElementById("data-file").files[0];
	const generateRandom = document.getElementById("generate-random").checked;
	const numCentroids = parseInt(document.getElementById("num-centroids").value);

	// if gernerate random data is not checked and no file is uploaded the we throw an error message and exit
	if (!generateRandom && !dataFile) {
		alert("Please upload a data file or select 'Generate Random Data'.");
		return;
	}
	// prepare formData object to be sent to the backend
	const formData = new FormData();
	if (generateRandom) {
		formData.append("generate_random", true);
	} else {
		formData.append("data_file", dataFile);
	}
	formData.append("num_centroids", numCentroids);

	// use fetch to call the backend request handler and send the formData
	fetch("http://127.0.0.1:5001/kmeans", {
		method: "POST",
		body: formData,
	})
		.then((response) => response.json()) // convert response into json format
		.then((iterations) => {
			// Clear the file input field
			document.getElementById("data-file").value = "";

			let currentIteration = 0;

			function drawIteration() {
				// Display algorithm steps
				const iteration = iterations[currentIteration];
				const stepTable = document.querySelector("#step-table");
				const stepTableHeader = stepTable.querySelector("thead tr");
				const stepTableBody = stepTable.querySelector("tbody");
				const newCentroidsTable = document.querySelector(
					"#new-centroids-table tbody"
				);

				// Clear previous data
				stepTableHeader.innerHTML = "<th>Point</th>";
				stepTableBody.innerHTML = "";
				newCentroidsTable.innerHTML = "";

				// Generate centroid distance columns dynamically
				for (let i = 0; i < numCentroids; i++) {
					stepTableHeader.innerHTML += `<th>Centroid ${i + 1} Distance</th>`;
				}
				stepTableHeader.innerHTML += "<th>Assigned Centroid</th>";
				// w
				iteration.distances.forEach((distanceRow, pointIndex) => {
					const row = document.createElement("tr");
					const pointColor =
						currentIteration === 0
							? "gray"
							: centroidColors[iteration.assignments[pointIndex]];
					row.innerHTML = `<td style="background-color: ${pointColor};">Point ${
						pointIndex + 1
					}</td>`;
					distanceRow.forEach((distance) => {
						row.innerHTML += `<td>${distance.toFixed(2)}</td>`;
					});
					row.innerHTML += `<td>Centroid ${
						iteration.assignments[pointIndex] + 1
					}</td>`;
					stepTableBody.appendChild(row);
				});
				// New Centroids
				iteration.centroids.forEach((centroid, index) => {
					const row = document.createElement("tr");
					const centroidColor = centroidColors[index];
					row.innerHTML = `
			                     <td style="background-color: ${centroidColor};">Centroid ${
						index + 1
					}</td>
			                     <td>${centroid[0].toFixed(2)}</td>
			                     <td>${centroid[1].toFixed(2)}</td>
			                 `;
					newCentroidsTable.appendChild(row);
				});

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Find the minimum and maximum values for scaling
				const xValues = iteration.points.map((point) => point[0]);
				const yValues = iteration.points.map((point) => point[1]);
				const minX = Math.min(...xValues);
				const maxX = Math.max(...xValues);
				const minY = Math.min(...yValues);
				const maxY = Math.max(...yValues);

				// Calculate the range of the data
				const rangeX = maxX - minX;
				const rangeY = maxY - minY;

				// Calculate the scaling factors to fit the data within 80% of the canvas
				const scaleX = (0.8 * canvas.width) / rangeX;
				const scaleY = (0.8 * canvas.height) / rangeY;

				// Calculate the offset to center the visualization
				const offsetX = (canvas.width - rangeX * scaleX) / 2;
				const offsetY = (canvas.height - rangeY * scaleY) / 2;

				// Draw Voronoi diagram lines
				if (currentIteration > 0) {
					ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
					ctx.beginPath();
					for (let i = 0; i < iteration.points.length; i++) {
						const [x, y] = iteration.points[i];
						const assignment = iteration.assignments[i];
						const [centroidX, centroidY] = iteration.centroids[assignment];

						ctx.moveTo(
							(x - minX) * scaleX + offsetX,
							(y - minY) * scaleY + offsetY
						);
						ctx.lineTo(
							(centroidX - minX) * scaleX + offsetX,
							(centroidY - minY) * scaleY + offsetY
						);
					}
					ctx.lineWidth = 1;
					ctx.stroke();
				}

				// Draw points with labels
				iteration.points.forEach((point, index) => {
					const [x, y] = point;
					const assignment = iteration.assignments[index];
					const label = iteration.labels[index];
					const pointColor =
						currentIteration === 0 ? "gray" : centroidColors[assignment];

					ctx.beginPath();
					ctx.arc(
						(x - minX) * scaleX + offsetX,
						(y - minY) * scaleY + offsetY,
						4,
						0,
						2 * Math.PI
					);
					ctx.fillStyle = pointColor;
					ctx.fill();

					// ctx.fillStyle = "black";
					// ctx.font = "12px Arial";
					// ctx.fillText(
					// 	label,
					// 	(x - minX) * scaleX + offsetX + 8,
					// 	(y - minY) * scaleY + offsetY
					// );
				});

				// Draw centroids
				if (currentIteration > 0) {
					iteration.centroids.forEach((centroid, index) => {
						const [x, y] = centroid;
						ctx.beginPath();
						ctx.arc(
							(x - minX) * scaleX + offsetX,
							(y - minY) * scaleY + offsetY,
							16,
							0,
							2 * Math.PI
						);
						ctx.fillStyle = centroidColors[index];
						ctx.fill();
						ctx.lineWidth = 5;
						ctx.strokeStyle = "white";
						ctx.stroke();
						ctx.fillStyle = "Purple";
						ctx.strokeStyle = "white";
						ctx.font = "16px Arial";
						ctx.fillText(
							"Centroid" + (index + 1),
							(x - minX) * scaleX + offsetX,
							(y - minY) * scaleY + offsetY
						);
					});
				}

				iterationElement.textContent = `Iteration: ${currentIteration + 1}`;

				currentIteration++;
				if (currentIteration < iterations.length) {
					setTimeout(drawIteration, 1000);
				}
			}

			drawIteration();
		});
}

function toggleTableVisibility() {
	const tableContainer = document.querySelector(".table-container");
	tableContainer.style.display =
		tableContainer.style.display === "none" ? "block" : "none";
}
