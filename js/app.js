const state={
screen:"overview", ai:true, human:false, selectedContact:0, inboxChat:false,
contacts:[
{name:"Maya Chen",phone:"+1 415 555 0182",status:"Qualified",score:94,source:"WhatsApp",last:"2 min ago",assigned:"AI Agent",initials:"MC"},
{name:"Oliver Grant",phone:"+44 20 7946 0214",status:"Contacted",score:78,source:"Website",last:"18 min ago",assigned:"Sales",initials:"OG"},
{name:"Sophia Patel",phone:"+1 212 555 0148",status:"New",score:63,source:"Instagram",last:"42 min ago",assigned:"AI Agent",initials:"SP"},
{name:"Daniel Brooks",phone:"+61 2 5550 1098",status:"Converted",score:98,source:"Referral",last:"1 hr ago",assigned:"Sales",initials:"DB"},
{name:"Emma Wilson",phone:"+1 310 555 0199",status:"Lost",score:31,source:"Website",last:"3 hr ago",assigned:"Sales",initials:"EW"},
{name:"Noah Williams",phone:"+1 646 555 0162",status:"Qualified",score:89,source:"WhatsApp",last:"5 hr ago",assigned:"AI Agent",initials:"NW"}],
conversations:[
{name:"Maya Chen",preview:"Yes, weekend appointments are available...",time:"2m",unread:2,lead:true,ai:true,initials:"MC"},
{name:"Oliver Grant",preview:"Could you send me the pricing?",time:"18m",unread:1,lead:true,ai:true,initials:"OG"},
{name:"Sophia Patel",preview:"I am interested in your service.",time:"42m",unread:0,lead:true,ai:true,initials:"SP"},
{name:"Daniel Brooks",preview:"Thanks, that works perfectly.",time:"1h",unread:0,lead:false,ai:false,initials:"DB"},
{name:"Emma Wilson",preview:"I'll think about it and get back...",time:"3h",unread:0,lead:false,ai:true,initials:"EW"}],
messages:[
{from:"customer",text:"Hi! Do you provide appointments on weekends?",time:"10:42 AM"},
{from:"ai",text:"Yes, weekend appointments are available. Would you like me to help you choose a suitable time?",time:"10:43 AM"},
{from:"customer",text:"Saturday afternoon would be perfect.",time:"10:44 AM"},
{from:"ai",text:"Great. I can help with that. What time would you prefer?",time:"10:44 AM"}],
automations:[
{name:"Lead Qualification",trigger:"New WhatsApp message",actions:"AI score → CRM lead",last:"2 min ago",success:"98.4%",on:true},
{name:"FAQ Auto Reply",trigger:"Customer asks FAQ",actions:"Search knowledge → Reply",last:"5 min ago",success:"99.1%",on:true},
{name:"Appointment Booking",trigger:"Booking intent detected",actions:"Check availability → Confirm",last:"14 min ago",success:"96.7%",on:true},
{name:"Follow-up Campaign",trigger:"No reply for 24h",actions:"Wait → Send follow-up",last:"1 hr ago",success:"94.2%",on:false},
{name:"Human Handoff",trigger:"Low confidence / request",actions:"Notify team → Assign",last:"8 min ago",success:"99.8%",on:true}]
};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const content=$("#content"), title=$("#pageTitle"), sidebar=$("#sidebar"), backdrop=$("#backdrop");

function toast(message,type=""){const el=document.createElement("div");el.className="toast";el.innerHTML=type==="ok"?`<strong>✓</strong> ${message}`:message;$("#toastWrap").appendChild(el);setTimeout(()=>el.remove(),2800)}
function avatar(initials){return `<div class="avatar">${initials}</div>`}
function pageHead(kicker,h,desc,actions=""){return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${h}</h1><p>${desc}</p></div><div class="actions">${actions}</div></div>`}
function card(titleText,body,extra=""){return `<div class="card"><div class="card-head"><h3>${titleText}</h3>${extra}</div>${body}</div>`}
function nav(screen){state.screen=screen;state.inboxChat=false;$$(".nav-item[data-screen]").forEach(x=>x.classList.toggle("active",x.dataset.screen===screen));title.textContent=screen==="knowledge"?"Knowledge Base":screen[0].toUpperCase()+screen.slice(1);render();sidebar.classList.remove("open");backdrop.classList.remove("show")}
function render(){
const views={overview:overview,inbox:inbox,agent:agent,automations:automations,contacts:contacts,knowledge:knowledge,analytics:analytics,settings:settings};
content.innerHTML=views[state.screen](); if(state.screen==="inbox") bindInbox(); if(state.screen==="contacts") bindContacts(); if(state.screen==="automations") bindAutomations();
}
function overview(){
const bars=[54,70,45,82,66,88,76,93,72,95,82,100];
return pageHead("AI OPERATIONS","Good evening, Dhruvil.","Your AI agent is handling customer conversations across WhatsApp.",
`<button class="btn" onclick="nav('analytics')">View analytics</button><button class="btn primary" onclick="nav('automations')">+ Create automation</button>`)
+`<div class="grid stats">
${stat("Total Conversations","12,840","+12.6%")}
${stat("AI Handled","10,426","+18.2%")}
${stat("Leads Captured","1,284","+9.4%")}
${stat("Response Rate","96.8%","+2.1%")}
${stat("Conversion Rate","18.4%","+3.7%")}</div>
<div class="grid two">
${card("Conversation activity",`<div class="chart">${lineChart()}</div><div class="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>`,`<select class="select"><option>Last 7 days</option></select>`)}
${card("AI performance",`<div class="status-line"><span class="online"></span> AI Agent is active</div><div class="mini-bars">${bars.map((v,i)=>`<i class="bar ${i>8?'active':''}" style="height:${v}%"></i>`).join("")}</div><div class="legend"><span><i class="dot"></i>AI handled</span><span><i class="dot blue"></i>Human</span></div>`)}
</div>
<div class="grid three" style="margin-top:13px">
${card("Recent conversations",recentConvs())}
${card("Recent leads",recentLeads())}
${card("Automation status",automationStatus())}</div>`;
}
function stat(l,v,t){return `<div class="card"><div class="stat-label">${l}<span class="trend">${t}</span></div><div class="stat-value">${v}</div></div>`}
function lineChart(){return `<svg viewBox="0 0 700 210" preserveAspectRatio="none"><g stroke="#20262e" stroke-width="1">${[35,75,115,155,195].map(y=>`<line x1="0" y1="${y}" x2="700" y2="${y}"/>`).join("")}</g><polyline fill="none" stroke="#25d366" stroke-width="3" points="0,150 70,132 140,144 210,92 280,118 350,65 420,83 490,54 560,73 630,35 700,45"/><polyline fill="none" stroke="#4f78b8" stroke-width="2" opacity=".7" points="0,176 70,165 140,170 210,148 280,155 350,132 420,144 490,126 560,141 630,115 700,123"/></svg>`}
function recentConvs(){return `<div class="list">${state.conversations.slice(0,4).map(c=>`<div class="list-row">${avatar(c.initials)}<div class="grow"><b>${c.name}</b><small>${c.preview}</small></div><span class="pill ${c.ai?'':'yellow'}">${c.ai?'AI':'Human'}</span></div>`).join("")}</div>`}
function recentLeads(){return `<div class="list">${state.contacts.slice(0,4).map(c=>`<div class="list-row">${avatar(c.initials)}<div class="grow"><b>${c.name}</b><small>${c.source} · ${c.last}</small></div><span class="score">${c.score}</span></div>`).join("")}</div>`}
function automationStatus(){return `<div class="list">${state.automations.slice(0,4).map(a=>`<div class="list-row"><span class="online"></span><div class="grow"><b>${a.name}</b><small>${a.trigger}</small></div><span class="pill">${a.on?"Active":"Paused"}</span></div>`).join("")}</div>`}

function inbox(){
return pageHead("CUSTOMER OPERATIONS","WhatsApp Inbox","Manage AI and human conversations from one workspace.")
+`<div class="inbox ${state.inboxChat?'chat-mode':''}" id="inboxBox">
<div class="conv-list"><div class="conv-search"><input class="search" id="convSearch" placeholder="Search conversations..."></div>${state.conversations.map((c,i)=>`<div class="conv ${i===0?'active':''}" data-conv="${i}">${avatar(c.initials)}<div class="grow"><b>${c.name}</b><small>${c.preview}</small></div><div class="conv-meta">${c.time}${c.unread?`<br><span class="pill">${c.unread}</span>`:""}<br>${c.lead?'Lead':''}</div></div>`).join("")}</div>
<div class="chat"><div class="chat-head"><button class="icon-btn back-chat" id="backChat">‹</button>${avatar("MC")}<div class="grow"><b>Maya Chen</b><small><span class="online" style="display:inline-block"></span> AI conversation · +1 415 555 0182</small></div><div class="chat-tools"><button class="icon-btn">⋯</button></div></div><div class="messages" id="messages">${state.messages.map(messageBubble).join("")}<div id="typing"></div></div><div class="composer"><button class="icon-btn" onclick="toast('Attachment picker is frontend-only.')">＋</button><input id="messageInput" placeholder="Type a message..." autocomplete="off"><button class="icon-btn" onclick="toast('Emoji picker is frontend-only.')">☺</button><button class="send" id="sendBtn">➤</button></div></div>
<div class="customer-panel"><div class="customer-hero">${avatar("MC")}<b>Maya Chen</b><small>Qualified lead · Customer since Jun 2026</small><button class="btn primary takeover" id="takeoverBtn">${state.human?'RETURN TO AI':'TAKE OVER'}</button></div><div class="detail"><label>Lead score</label><p><span class="score">94 / 100</span> · High intent</p></div><div class="detail"><label>Phone</label><p>+1 415 555 0182</p></div><div class="detail"><label>Source</label><p>WhatsApp</p></div><div class="detail"><label>Assigned to</label><p>${state.human?'Dhruvil · Human':'WA Auto · AI Agent'}</p></div><div class="detail"><label>Last activity</label><p>2 minutes ago</p></div></div></div>`;
}
function messageBubble(m){return `<div class="bubble ${m.from}">${m.text}<div class="msg-time">${m.time} ${m.from==="ai"?"✓✓":""}</div></div>`}
function bindInbox(){
$$(".conv").forEach(el=>el.onclick=()=>{state.inboxChat=true;$$(".conv").forEach(x=>x.classList.remove("active"));el.classList.add("active");render()});
$("#backChat")?.addEventListener("click",()=>{state.inboxChat=false;render()});
$("#takeoverBtn")?.addEventListener("click",()=>{state.human=!state.human;toast(state.human?"Conversation assigned to you. AI paused.":"AI Agent resumed for this conversation.","ok");render()});
$("#sendBtn")?.addEventListener("click",sendMessage);$("#messageInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")sendMessage()});
$("#convSearch")?.addEventListener("input",e=>{$$(".conv").forEach(x=>x.style.display=x.textContent.toLowerCase().includes(e.target.value.toLowerCase())?"flex":"none")});
}
function sendMessage(){const input=$("#messageInput");if(!input||!input.value.trim())return;const text=input.value.trim();state.messages.push({from:"customer",text,time:"10:45 AM"});input.value="";render();setTimeout(()=>{if(!state.human){state.messages.push({from:"ai",text:"Thanks for the message. I’m checking that for you now and will help with the next step.","time":"10:45 AM"});render();toast("AI reply simulated.","ok")}},850)}

function agent(){
return pageHead("AI CONFIGURATION","AI Agent","Configure how your AI represents the business and handles conversations.",
`<button class="btn primary" id="saveAgent">Save changes</button>`)
+`<div class="grid agent-grid"><div class="card"><div class="switch-row"><div><b style="font-size:13px">AI Agent Status</b><p style="font-size:9px;color:var(--muted);margin:4px 0">Automatically handle eligible WhatsApp conversations.</p></div><button class="toggle ${state.ai?'on':''}" id="agentToggle"><i></i></button></div><hr style="border:0;border-top:1px solid var(--line);margin:17px 0"><div class="form-grid">
${field("Agent Name","Maya AI","agentName")}${field("Business Name","Acme Business","businessName")}
<div class="field"><label>Personality</label><select id="personality"><option>Helpful & confident</option><option>Warm & consultative</option><option>Professional & direct</option></select></div>
<div class="field"><label>Tone</label><select id="tone"><option>Professional</option><option>Friendly</option><option>Concise</option><option>Sales-focused</option></select></div>
<div class="field"><label>System Instructions</label><textarea id="instructions">You are the customer-facing AI assistant. Answer accurately using the business knowledge base. Qualify leads naturally and hand off when a customer requests a human.</textarea></div>
<div class="field"><label>Response Length</label><select><option>Concise</option><option>Balanced</option><option>Detailed</option></select></div>
<div class="field"><label>Working Hours</label><select><option>24 / 7</option><option>09:00 — 18:00</option><option>Custom schedule</option></select></div>
<div class="switch-row"><div><b style="font-size:11px">Human Handoff</b><p style="font-size:9px;color:var(--muted);margin:4px 0">Escalate low-confidence or sensitive requests.</p></div><button class="toggle on"><i></i></button></div>
</div></div>
<div class="card"><div class="card-head"><h3>Live conversation preview</h3><span class="pill">LIVE PREVIEW</span></div><div class="preview"><div class="bubble customer">Do you provide appointments on weekends?<div class="msg-time">10:42 AM</div></div><div class="bubble ai">${state.ai?'Yes, weekend appointments are available. Would you like me to help you choose a suitable time?':'AI Agent is currently paused.'}<div class="msg-time">10:43 AM ✓✓</div></div></div></div></div>`;
}
function field(label,value,id){return `<div class="field"><label>${label}</label><input id="${id}" value="${value}"></div>`}

function automations(){
return pageHead("WORKFLOW ENGINE","Automations","Build workflows that work automatically across your customer journey.",
`<button class="btn primary" onclick="openAutomationModal()">+ Create Automation</button>`)
+`<div class="card" style="margin-bottom:13px"><div class="card-head"><h3>Lead Qualification — active workflow</h3><span class="pill">98.4% success</span></div><div class="workflow">${["Customer sends message","AI analyzes intent","Check lead status","Generate response","Send WhatsApp message","Create / update lead"].map((n,i)=>`<div class="node"><small>Step ${i+1}</small><b>${n}</b></div>${i<5?'<span class="arrow">→</span>':''}`).join("")}</div></div>
<div class="grid">${state.automations.map((a,i)=>`<div class="card automation"><div class="grow"><h4>${a.name}</h4><p>Trigger: ${a.trigger} · Actions: ${a.actions}</p><p>Last run: ${a.last} · Success: <span class="score">${a.success}</span></p></div><span class="pill ${a.on?'':'yellow'}">${a.on?'Enabled':'Paused'}</span><div class="automation-actions"><button class="btn" onclick="toast('Edit mode opened for ${a.name}.')">Edit</button><button class="btn" onclick="duplicateAutomation(${i})">Copy</button><button class="toggle ${a.on?'on':''}" onclick="toggleAutomation(${i})"><i></i></button></div></div>`).join("")}</div>`;
}
function bindAutomations(){}
function toggleAutomation(i){state.automations[i].on=!state.automations[i].on;toast(`${state.automations[i].name} ${state.automations[i].on?'enabled':'paused'}.`,"ok");render()}
function duplicateAutomation(i){state.automations.push({...state.automations[i],name:state.automations[i].name+" Copy",on:false});toast("Automation duplicated.","ok");render()}
function openAutomationModal(){modal(`<h2>Create automation</h2><p>Design a frontend workflow now; the backend connectors can be wired later.</p><div class="form-grid">${field("Automation name","New customer workflow","autoName")}<div class="field"><label>Trigger</label><select><option>New WhatsApp message</option><option>Lead status changed</option><option>No reply for 24h</option><option>Appointment intent detected</option></select></div><div class="field"><label>First action</label><select><option>Analyze with AI</option><option>Search knowledge base</option><option>Create CRM lead</option><option>Notify human</option></select></div></div><div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="addAutomation()">Create automation</button></div>`)}
function addAutomation(){const n=$("#autoName").value.trim()||"New customer workflow";state.automations.unshift({name:n,trigger:"New WhatsApp message",actions:"AI analyze → Action",last:"Just now",success:"100%",on:true});closeModal();toast("Automation created.","ok");render()}

function contacts(){
return pageHead("CRM","Contacts & Leads","Turn WhatsApp conversations into qualified, trackable business opportunities.",
`<button class="btn" onclick="openContactModal()">+ Add contact</button>`)
+`<div class="toolbar"><input class="search" id="contactSearch" placeholder="Search name, phone or source..."><select class="select" id="statusFilter"><option>All statuses</option><option>New</option><option>Contacted</option><option>Qualified</option><option>Converted</option><option>Lost</option></select><button class="btn" onclick="toast('Sort applied: Lead score.')">Sort by score</button></div>
<div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Status</th><th>Lead Score</th><th>Source</th><th>Last Contact</th><th>Assigned To</th></tr></thead><tbody id="contactRows">${contactRows(state.contacts)}</tbody></table></div>`;
}
function contactRows(rows){return rows.map((c,i)=>`<tr class="contact-row" data-index="${i}"><td><b>${c.name}</b></td><td>${c.phone}</td><td><span class="pill ${c.status==='Lost'?'red':c.status==='Converted'?'blue':''}">${c.status}</span></td><td class="score">${c.score}</td><td>${c.source}</td><td>${c.last}</td><td>${c.assigned}</td></tr>`).join("")}
function bindContacts(){$$(".contact-row").forEach(x=>x.onclick=()=>openContactModal(Number(x.dataset.index)));$("#contactSearch")?.addEventListener("input",filterContacts);$("#statusFilter")?.addEventListener("change",filterContacts)}
function filterContacts(){const q=$("#contactSearch").value.toLowerCase(),f=$("#statusFilter").value;const rows=state.contacts.filter(c=>(c.name+c.phone+c.source).toLowerCase().includes(q)&&(f==="All statuses"||c.status===f));$("#contactRows").innerHTML=contactRows(rows)}
function openContactModal(i=0){const c=state.contacts[i]||state.contacts[0];modal(`<button class="close" onclick="closeModal()">×</button><div class="customer-hero">${avatar(c.initials)}<b>${c.name}</b><small>${c.status} lead · ${c.source}</small></div><div class="grid three" style="margin-top:15px"><div class="card"><small style="color:var(--muted)">Lead score</small><div class="stat-value">${c.score}</div></div><div class="card"><small style="color:var(--muted)">Status</small><div style="margin-top:10px"><span class="pill">${c.status}</span></div></div><div class="card"><small style="color:var(--muted)">Assigned</small><div style="margin-top:10px;font-size:10px">${c.assigned}</div></div></div><div class="detail"><label>Phone</label><p>${c.phone}</p></div><div class="detail"><label>Conversation history</label><p>Maya: Asked about weekend availability.<br>AI: Shared appointment options.<br>Customer: Interested in Saturday afternoon.</p></div><div class="field" style="margin-top:13px"><label>Notes</label><textarea placeholder="Add internal notes...">High-intent lead. Follow up after appointment selection.</textarea></div><div class="modal-actions"><button class="btn" onclick="closeModal()">Close</button><button class="btn primary" onclick="closeModal();toast('Contact changes saved.','ok')">Save changes</button></div>`)}

function knowledge(){
const cats=[["⌂","Business Information","12 entries","92%"],["▦","Products & Services","28 entries","100%"],["$","Pricing","8 entries","100%"],["?","FAQs","46 entries","96%"],["◇","Policies","14 entries","88%"],["☎","Contact Information","7 entries","100%"]];
return pageHead("KNOWLEDGE","Knowledge Base","Give your AI accurate business context without changing your automation logic.",
`<button class="btn" onclick="toast('Search is ready for mock knowledge data.')">Search</button><button class="btn primary" onclick="openKnowledgeModal()">+ Add information</button>`)
+`<div class="toolbar"><input class="search" id="kbSearch" placeholder="Search knowledge..."><button class="btn" onclick="openKnowledgeModal('FAQ')">+ Add FAQ</button></div><div class="grid kb-grid" id="kbGrid">${cats.map(c=>`<div class="card kb-card"><div class="kb-icon">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]} · Knowledge status: Active</p><div class="progress"><i style="width:${c[3]}"></i></div></div>`).join("")}</div>`;
}
function openKnowledgeModal(kind="Information"){modal(`<button class="close" onclick="closeModal()">×</button><h2>Add ${kind}</h2><p>This stores local mock content for the prototype. No AI retrieval is performed.</p>${field("Title",kind==="FAQ"?"How do weekend appointments work?":"Business information","kbTitle")}<div class="field" style="margin-top:12px"><label>Content</label><textarea id="kbContent" placeholder="Write the information your AI should know..."></textarea></div><div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="closeModal();toast('Knowledge item added to mock workspace.','ok')">Add to knowledge base</button></div>`)}

function analytics(){
return pageHead("PERFORMANCE","Analytics","Measure conversation quality, automation impact and lead conversion.",
`<select class="select"><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select>`)
+`<div class="grid stats">${stat("Total Conversations","12,840","+12.6%")}${stat("AI Resolution Rate","81.2%","+6.4%")}${stat("Avg. Response Time","18s","-21.8%")}${stat("Leads Generated","1,284","+9.4%")}${stat("Human Handoffs","412","-8.1%")}</div>
<div class="grid two">${card("Conversation volume",`<div class="chart">${lineChart()}</div><div class="chart-labels"><span>1 Aug</span><span>5 Aug</span><span>10 Aug</span><span>15 Aug</span><span>20 Aug</span><span>25 Aug</span><span>27 Aug</span></div>`)}${card("Conversion funnel",`<div class="funnel"><div class="funnel-row"><span>Conversations</span><div class="funnel-bar"><i style="width:100%"></i></div><b>12,840</b></div><div class="funnel-row"><span>Engaged</span><div class="funnel-bar"><i style="width:72%"></i></div><b>9,245</b></div><div class="funnel-row"><span>Qualified</span><div class="funnel-bar"><i style="width:39%"></i></div><b>5,011</b></div><div class="funnel-row"><span>Converted</span><div class="funnel-bar"><i style="width:18%"></i></div><b>2,362</b></div></div>`)}
</div><div class="grid two" style="margin-top:13px">${card("Leads over time",`<div class="mini-bars">${[40,52,47,65,58,76,68,81,73,92,87,100].map(v=>`<i class="bar active" style="height:${v}%"></i>`).join("")}</div>`)}${card("AI vs Human conversations",`<div class="funnel"><div class="funnel-row"><span>AI handled</span><div class="funnel-bar"><i style="width:81%"></i></div><b>81%</b></div><div class="funnel-row"><span>Human</span><div class="funnel-bar"><i style="width:19%"></i></div><b>19%</b></div></div>`)}</div>`;
}

function settings(){
return pageHead("CONTROL CENTER","Settings","Manage your business workspace, WhatsApp connection and AI operations.")
+`<div class="grid settings-layout"><div class="card settings-nav">${["Business Profile","WhatsApp Connection","AI Settings","Notifications","Team Members","Security","Subscription"].map((x,i)=>`<button class="settings-tab ${i===0?'active':''}" onclick="settingsTab(this,'${x}')">${x}</button>`).join("")}</div><div class="card" id="settingsPanel">${settingsPanel("Business Profile")}</div></div>`;
}
function settingsPanel(tab){if(tab==="WhatsApp Connection")return `<div class="card-head"><h3>WhatsApp Business</h3><span class="pill yellow">Not Connected</span></div><p style="color:var(--muted);font-size:10px">Connect your WhatsApp Business account to route customer conversations into WA Auto.</p><button class="btn primary" onclick="connectWhatsApp()">Connect WhatsApp</button><div class="detail" style="margin-top:18px"><label>Connection architecture</label><p>WhatsApp Business API → Webhook → WA Auto → AI / Human → CRM</p></div>`;return `<div class="card-head"><h3>${tab}</h3><span class="pill">Saved locally</span></div>${["Workspace name","Business email","Timezone","Default language"].map((x,i)=>`<div class="setting-row"><div><b>${x}</b><p>${["Acme Workspace","ops@acme.example","GMT +05:30","English (US)"][i]}</p></div><button class="btn" onclick="toast('${x} editor opened.')">Edit</button></div>`).join("")}` }
function settingsTab(btn,tab){$$(".settings-tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$("#settingsPanel").innerHTML=settingsPanel(tab)}
function connectWhatsApp(){modal(`<button class="close" onclick="closeModal()">×</button><h2>Connect WhatsApp Business</h2><p>This prototype does not make API connections. In production, this step would launch your secure WhatsApp Business onboarding flow.</p><div class="detail"><label>Planned connection</label><p>WhatsApp Business API + webhook verification + message routing</p></div><div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="closeModal();toast('Connection flow is reserved for the backend integration.','ok')">Continue</button></div>`)}

function modal(body){$("#modalRoot").innerHTML=`<div class="modal-bg" id="modalBg"><div class="modal">${body}</div></div>`;$("#modalBg").addEventListener("click",e=>{if(e.target.id==="modalBg")closeModal()})}
function closeModal(){$("#modalRoot").innerHTML=""}

$("#menuBtn").onclick=()=>{sidebar.classList.add("open");backdrop.classList.add("show")};backdrop.onclick=()=>{sidebar.classList.remove("open");backdrop.classList.remove("show")};
$$(".nav-item[data-screen]").forEach(b=>b.onclick=()=>nav(b.dataset.screen));
$("#helpBtn").onclick=$("#topHelp").onclick=()=>toast("Help center is available in the production workspace.");
$("#notifBtn").onclick=()=>toast("3 new lead notifications.");
$("#workspaceBtn").onclick=()=>toast("Workspace selector opened.");
window.nav=nav;window.render=render;window.openAutomationModal=openAutomationModal;window.addAutomation=addAutomation;window.toggleAutomation=toggleAutomation;window.duplicateAutomation=duplicateAutomation;window.openContactModal=openContactModal;window.openKnowledgeModal=openKnowledgeModal;window.closeModal=closeModal;window.settingsTab=settingsTab;window.connectWhatsApp=connectWhatsApp;
render();
