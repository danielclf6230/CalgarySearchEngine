document.myform.datasetButton.onclick = async function (e){
    e.preventDefault();

    const datasetEl = document.myform.dataset;
    const dataset = datasetEl.value;

    if(dataset === 'incidents'){
        const response = await fetch('inputs/incidents.html');
        const html = await response.text();
        formInputs.innerHTML = html;

    }else if(dataset === 'cameras'){
        const response = await fetch('inputs/cameras.html');
        const html = await response.text();
        formInputs.innerHTML = html;

    }else if(dataset === 'crime'){
        const response = await fetch('inputs/crime.html');
        const html = await response.text();
        formInputs.innerHTML = html;

    }else if(dataset === 'building'){
        const response = await fetch('inputs/building.html');
        const html = await response.text();
        formInputs.innerHTML = html;
    }
    submit.style.display = 'inline';

    title.style.display = 'inline';
    finalResultsHead.innerHTML = '';
    finalResultsBody.innerHTML = '';

};

document.myform.onsubmit = async function(e){
    e.preventDefault();

    const datasetEl = document.myform.dataset;
    const dataset = datasetEl.value;

    if(dataset === 'incidents'){
        document.getElementById('finalResults').style.display = 'block';
        document.getElementById('title').style.display = 'block';

        const quadrantValue = document.myform.quadrant.value;
        const monthValue = document.myform.month.value;
        const idValue = document.myform.idNumber.value;

        const response = await fetch('datasets/traffic_incidents.json');

        const resultsAry =  await response.json();

        finalResultsHead.innerHTML = `
            <tr>
                <th>Description</th>
                <th>Quadrant</th>
                <th>Month</th>
                <th>Location</th>
                <th>ID Number</th>
            </tr>
        `;

        finalResultsBody.innerHTML = '';

        for(const result of resultsAry){
            const{ description, quadrant, start_dt, latitude, longitude, id} = result;
            const month = start_dt.substring(5,7)
            const idNumber = id.substring(14,16);

            if(quadrant === quadrantValue && month === monthValue){
                if(idNumber === idValue || idValue === ""){
                    const googleMapsLink = `https://maps.google.com?q=${latitude},${longitude}`;

                    finalResultsBody.innerHTML += `
                    <tr>
                        <td>${description}</td>
                        <td>${quadrant}</td>
                        <td>${month}</td>
                        <td>
                        <a href="${googleMapsLink}" target="_blank"</a>Open Map
                        </td>
                        <td>${idNumber}</td>
                    </tr>`
                }
            }
        }

    }else if(dataset === 'cameras'){
        document.getElementById('finalResults').style.display = 'block';
        document.getElementById('title').style.display = 'block';

        const quadrantValue = document.myform.quadrant.value;
        const cameraValue = document.myform.cameraId.value;
        const typeValue = document.myform.pointType.value;

        const response = await fetch('datasets/traffic_cameras.json');

        const resultsAry =  await response.json();

        console.log(resultsAry)

        finalResultsHead.innerHTML = `
            <tr>
                <th>Camera</th>
                <th>Quadrant</th>
                <th>Address</th>
                <th>Location</th>
                <th>Type</th>
            </tr>
        `;

        finalResultsBody.innerHTML = '';

        for(const result of resultsAry){
            const{ camera_url, quadrant, camera_location, point} = result;
            const{description} = camera_url;
            const camId = description.substring(7,9)
            const{coordinates,type} = point;
            const latitude =  coordinates[1]
            const longitude = coordinates[0]

            console.log(latitude)

            camId === cameraValue 
            quadrant === quadrantValue
            type === typeValue

            if(camId === cameraValue || cameraValue==="" && type === typeValue){
                if(quadrant === quadrantValue || quadrantValue === "None"){
                    const googleMapsLink = `https://maps.google.com?q=${latitude},${longitude}`;

                    finalResultsBody.innerHTML += `
                    <tr>
                        <td>${description}</td>
                        <td>${quadrant}</td>
                        <td>${camera_location}</td>
                        <td>
                        <a href="${googleMapsLink}" target="_blank"</a>Open Map
                        </td>
                        <td>${type}</td>
                    </tr>`
                }
            }
        }
    }else if(dataset === 'crime'){
        document.getElementById('finalResults').style.display = 'block';
        document.getElementById('title').style.display = 'block';

        const categoryValue = document.myform.category.value;
        const yearValue = document.myform.year.value;
        const sectorValue = document.myform.sector.value;

        const response = await fetch('datasets/crime_stats.json');

        const resultsAry =  await response.json();


        finalResultsHead.innerHTML = `
            <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Year</th>
                <th>Sector</th>
                <th>Location</th>
            </tr>
        `;

        finalResultsBody.innerHTML = '';

        for(const result of resultsAry){
            const{ group_category, category, year, sector,geocoded_column} = result;
            const{latitude,longitude} = geocoded_column;

            if(group_category === categoryValue && sector === sectorValue){
                if(year === yearValue || yearValue === "None"){
                    const googleMapsLink = `https://maps.google.com?q=${latitude},${longitude}`;

                    finalResultsBody.innerHTML += `
                    <tr>
                        <td>${group_category}</td>
                        <td>${category}</td>
                        <td>${year}</td>
                        <td>${sector}</td>
                        <td>
                        <a href="${googleMapsLink}" target="_blank"</a>Open Map
                        </td>
                    </tr>`
                }
            }
        }
    }else if(dataset === 'building'){
        document.getElementById('finalResults').style.display = 'block';
        document.getElementById('title').style.display = 'block';

        const RtypeValue = document.myform.Rtype.value;
        const totalsqfValue = document.myform.totalsqf.value;
        const statusValue = document.myform.status.value;

        const response = await fetch('datasets/building_permits.json');

        const resultsAry =  await response.json();

        finalResultsHead.innerHTML = `
            <tr>
                <th>Applicantname</th>
                <th>Description</th>
                <th>Total Square Feet</th>
                <th>Status</th>
                <th>Location</th>
            </tr>
        `;

        finalResultsBody.innerHTML = '';

        for(const result of resultsAry){
            const{ permitclassmapped, description, totalsqft, statuscurrent,latitude,longitude} = result;

            if(permitclassmapped === RtypeValue && statuscurrent === statusValue){
                let smalltotalsqfValue = parseInt(totalsqfValue.substring(0,4))
                let largetotalsqfValue = parseInt(totalsqfValue.substring(7,11))

                if(totalsqft > smalltotalsqfValue && totalsqft < largetotalsqfValue || totalsqfValue === "All"){                  
                    const googleMapsLink = `https://maps.google.com?q=${latitude},${longitude}`;

                    finalResultsBody.innerHTML += `
                    <tr>
                        <td>${permitclassmapped}</td>
                        <td>${description}</td>
                        <td>${totalsqft}</td>
                        <td>${statuscurrent}</td>
                        <td>
                        <a href="${googleMapsLink}" target="_blank"</a>Open Map
                        </td>
                    </tr>`
                } 
            }
        }
    }
}
    

