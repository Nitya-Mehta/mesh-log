let userName = null;
let selectedMachines = [];
let currentIndex = 0;
let allEntries = [];
let sessionDate = "";
let sessionShift = "";
let currentTime = "";

window.onload = () => {
  const savedName = localStorage.getItem("userName");
  if(savedName){
    userName = savedName;
    showApp(userName);
  }
};

window.handleCredential = function(response){
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  userName = payload.name;
  localStorage.setItem("userName", userName);
  showApp(userName);
}

function showApp(name){
  loginBox.style.display="none";
  app.style.display="block";
  userInfo.innerText = `${name}`;
  logoutBtn.style.display="inline-flex";
}

function logout(){
  localStorage.clear();
  location.reload();
}

function getShift(){
  const h = new Date().getHours();
  if(h >= 7 && h < 15) return "Shift-A";
  if(h >= 15 && h < 23) return "Shift-B";
  return "Shift-C";
}

function startEntry(){
  const checks = document.querySelectorAll("#machineSelectPage input:checked");
  if(checks.length === 0){
    alert("Select at least one mill");
    return;
  }

  selectedMachines = [...checks].map(c=>c.value);
  currentIndex = 0;
  allEntries = [];

  const now = new Date();
  sessionDate = now.toLocaleDateString("en-GB");
  sessionShift = getShift();

  machineSelectPage.style.display="none";
  fields.classList.remove("hidden");
  currentMachineTitle.style.display="block";

  loadMachine();
}

function loadMachine(){

  const title = document.getElementById('currentMachineTitle');

  title.style.opacity = '0';
  title.style.transform = 'translateX(-20px)';

  setTimeout(() => {

    title.innerText = selectedMachines[currentIndex];

    // ---- BUTTON TEXT LOGIC ----
    if(currentIndex === selectedMachines.length - 1){
      document.getElementById("submitBtnText").innerText = "Submit";
    }else{
      document.getElementById("submitBtnText").innerText = "Next";
    }

    setTimeout(() => {
      title.style.opacity = '1';
      title.style.transform = 'translateX(0)';
    }, 50);

  }, 300);
}

function showSuccessToast() {
  const toast = document.getElementById('successToast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

async function sendAllToSheet(){

  for(const entry of allEntries){

    await fetch("api/submit", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

  }

}

async function submitData(){

  if(!grade.value || !mesh.value){
    alert("Grade and Mesh are required");
    return;
  }

  document.getElementById("loadingOverlay").style.display="flex";

  const entry = {
    name:userName,
    machine:selectedMachines[currentIndex],
    grade:grade.value,
    mesh:mesh.value,
    moisture:moisture.value,
    remarks:remarks.value
  };

  // SAVE BY INDEX (overwrite safe)
  allEntries[currentIndex] = entry;

  resetFields();
  currentIndex++;

  if(currentIndex < selectedMachines.length){
    loadMachine();
    restoreIfExists();
  }else{
    setTimeout(() => {
    showSummary();
  }, 100);
  }

  document.getElementById("loadingOverlay").style.display="none";
}

function goBack(){

  if(currentIndex === 0){
    machineSelectPage.style.display="block";
    fields.classList.add("hidden");
    currentMachineTitle.style.display="none";
    return;
  }

  currentIndex--;
  loadMachine();
  restoreIfExists();
  // update button label
if(currentIndex === selectedMachines.length - 1){
  submitBtnText.innerText = "Submit";
}else{
  submitBtnText.innerText = "Next";
}

}

function restoreIfExists(){

  const saved = allEntries[currentIndex];

  if(!saved) return;

  grade.value = saved.grade || "";
  mesh.value = saved.mesh || "";
  moisture.value = saved.moisture || "";
  remarks.value = saved.remarks || "";
}


async function showSummary(){
  document.getElementById("loadingOverlay").style.display="flex";
  await sendAllToSheet();

  currentMachineTitle.style.display="none";
  currentTime = new Date().toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true
  });

  let text="";
  text += `Date: ${sessionDate}\n`;
  text += `Time: ${currentTime}\n`;
  text += `${sessionShift}\n\n`;

  allEntries.forEach(e=>{
    text += `${e.machine}\n`;
    text += `Grade: ${e.grade}\n`;
    text += `Mesh: ${e.mesh}%\n`;
    if(e.moisture) text += `Moisture: ${e.moisture}%\n`;
    if(e.remarks) text += `Remarks: ${e.remarks}\n`;
    text += "\n";
  });

  fields.innerHTML = `
<div class="summary-header">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
  <h3>Submission Complete</h3>
</div>
<textarea id="summaryBox" readonly style="width:100%;height:240px;resize:none;">${text}</textarea>
<button onclick="copySummary()" class="btn-submit">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
  </svg>
  Copy All
</button>
<button onclick="resetAll()" class="btn-submit">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
  New Entry
</button>
`;

  document.getElementById("loadingOverlay").style.display="none";

}

function copySummary(){
  navigator.clipboard.writeText(summaryBox.value);
  showSuccessToast();
}

function resetFields(){
  grade.value="";
  mesh.value="";
  moisture.value="";
  remarks.value="";
}

function resetAll(){
  location.reload();

}


