const $ = (id) => document.getElementById(id);

// If frontend and backend are deployed separately, paste the Render backend URL here,
// e.g. "https://safemeds-api.onrender.com". Keep empty only when served from one origin.
const API_BASE_URL = "https://safemeds-ai-backend.onrender.com";
const state = {
 language: "en", hasImage: false, resultVisible: false, recognition: null,
 selectedFile: null, scanData: null
};
const translations = {
 en: {
  navHome:"Home",navScan:"Scan label",navAsk:"Ask assistant",navAbout:"About",eyebrow:"A more accessible way to read medicine labels",heroLine1:"Medicine details,",heroLine2:"made easier to hear.",heroDesc:"Scan a label, review the printed details, and listen in your preferred language. When a reading is unclear, SafeMeds AI tells you to verify it.",startScan:"Start scanning",howWorks:"How it works",bilingual:"English + Hindi",voiceReady:"Voice-friendly",verifyFirst:"Verification-first",labelDetected:"Label ready to scan",demoOnly:"OCR extraction prototype",listenYourWay:"Listen your way",englishHindi:"English · हिन्दी",heroNote:"Designed to support label reading—not to replace professional medical advice.",featureScan:"Scan",featureScanDesc:"Upload a label image",featureExtract:"Extract",featureExtractDesc:"Organize printed details",featureListen:"Listen",featureListenDesc:"Read details aloud",featureVerify:"Verify",featureVerifyDesc:"Flag what needs checking",workspaceKicker:"YOUR WORKSPACE",scanTitle:"Scan a medicine label",scanSubtitle:"Upload a clear photo to preview the reading experience.",prototypeMode:"OCR prototype",uploadHeading:"Add your label image",uploadHint:"Use a clear, well-lit photo of the printed package.",dropTitle:"Drop your image here",dropSub:"or browse files on your device",chooseImage:"Choose an image",removeImage:"Remove image",tipTitle:"For a better reading",tipText:"Keep the label flat, avoid glare, and include the full printed text in the frame.",scanButton:"Scan label with OCR",scanDisclaimer:"OCR extracts printed text; always verify it against the actual package.",resultHeading:"Medicine information",resultHint:"Extracted details will appear here.",demoResult:"OCR result · Not verified",emptyTitle:"Your label details will appear here",emptyText:"Choose an image, then preview the sample result to explore the interface.",medicineName:"Medicine name",notVerified:"Not verified",strength:"Strength",batchNumber:"Batch number",manufactureDate:"Manufacturing date",expiryDate:"Expiry date",printedInstructions:"Printed instructions",instructionUnavailable:"No instructions extracted. Check the actual package or ask a pharmacist.",verifyTitle:"Please verify the package",verifyText:"This is sample information, not a real scan. Never rely on this demo for dosing or treatment decisions.",readAloud:"Read aloud",askQuestion:"Ask a question",scanAgain:"Scan again",assistantKicker:"YOUR ACCESSIBLE COMPANION",assistantTitle:"Ask in your own way.",assistantDesc:"Type a question or try voice input. The demo answers common questions about the sample fields shown above.",perk1:"English and Hindi interface",perk2:"Chat and voice-input controls",perk3:"Safety-first responses",demoAssistant:"Demo assistant · Sample data only",chatMode:"Chat",voiceMode:"Voice input",welcomeChat:"Hi! I can help you explore the sample label details. What would you like to know?",voicePrompt:"Tap the microphone and speak",voiceHelp:"Speech recognition depends on your browser and device.",startListening:"Start listening",chatPlaceholder:"Ask about the sample label…",chatDisclaimer:"Answers are illustrative. Verify medicine details with the actual package or a pharmacist.",howKicker:"DESIGNED AROUND ACCESSIBILITY",howTitle:"Simple steps. Clearer information.",howDesc:"The intended experience is to help people access printed label details—not to diagnose or prescribe.",step1Title:"Capture the label",step1Desc:"Take or upload a clear image of the medicine packaging.",step2Title:"Read printed details",step2Desc:"The planned OCR system will extract text and organize visible fields.",step3Title:"Listen or ask",step3Desc:"Explore label details with accessible voice and chat controls.",step4Title:"Verify uncertainty",step4Desc:"If text is unclear, rescan or ask a qualified professional to verify it.",safetyHeading:"A helpful reader—not a medical decision-maker.",safetyBody:"SafeMeds AI uses OCR to extract visible text from a label image. OCR can misread names, strengths, batch numbers, and dates; it does not verify medicine authenticity, recommend doses, or determine whether a medicine is safe for you. Always compare every result with the actual package and consult a pharmacist or clinician when needed.",prototypeLabel:"Prototype disclosure",footerText:"Built for accessibility. Designed with verification in mind.",backTop:"Back to top ↑",footerPrototype:"Student project prototype"
 },
 hi: {
  navHome:"होम",navScan:"लेबल स्कैन",navAsk:"सहायक से पूछें",navAbout:"परिचय",eyebrow:"दवा के लेबल पढ़ने का अधिक सुलभ तरीका",heroLine1:"दवा की जानकारी,",heroLine2:"अब सुनना आसान।",heroDesc:"लेबल की तस्वीर चुनें, छपी जानकारी देखें और अपनी पसंदीदा भाषा में सुनें। यदि जानकारी स्पष्ट नहीं है, तो SafeMeds AI आपको उसे सत्यापित करने की याद दिलाता है।",startScan:"स्कैन शुरू करें",howWorks:"यह कैसे काम करता है",bilingual:"अंग्रेज़ी + हिंदी",voiceReady:"आवाज़ के अनुकूल",verifyFirst:"पहले सत्यापन",labelDetected:"लेबल स्कैन के लिए तैयार",demoOnly:"OCR टेक्स्ट निष्कर्षण प्रोटोटाइप",listenYourWay:"अपनी भाषा में सुनें",englishHindi:"English · हिन्दी",heroNote:"लेबल पढ़ने में सहायता के लिए—चिकित्सकीय सलाह का विकल्प नहीं।",featureScan:"स्कैन",featureScanDesc:"लेबल की तस्वीर अपलोड करें",featureExtract:"जानकारी निकालें",featureExtractDesc:"छपी जानकारी व्यवस्थित करें",featureListen:"सुनें",featureListenDesc:"जानकारी आवाज़ में सुनें",featureVerify:"सत्यापित करें",featureVerifyDesc:"जाँचने योग्य जानकारी पहचानें",workspaceKicker:"आपका कार्यक्षेत्र",scanTitle:"दवा का लेबल स्कैन करें",scanSubtitle:"अनुभव देखने के लिए साफ़ तस्वीर अपलोड करें।",prototypeMode:"OCR प्रोटोटाइप",uploadHeading:"लेबल की तस्वीर जोड़ें",uploadHint:"पैकेज की साफ़ और अच्छी रोशनी वाली तस्वीर लें।",dropTitle:"तस्वीर यहाँ छोड़ें",dropSub:"या अपने डिवाइस से फ़ाइल चुनें",chooseImage:"तस्वीर चुनें",removeImage:"तस्वीर हटाएँ",tipTitle:"बेहतर परिणाम के लिए",tipText:"लेबल सीधा रखें, चमक से बचें और पूरा छपा हुआ टेक्स्ट तस्वीर में शामिल करें।",scanButton:"OCR से लेबल स्कैन करें",scanDisclaimer:"OCR छपा हुआ टेक्स्ट निकालता है; वास्तविक पैकेज से हमेशा जाँचें।",resultHeading:"दवा की जानकारी",resultHint:"निकाली गई जानकारी यहाँ दिखाई देगी।",demoResult:"OCR परिणाम · सत्यापित नहीं",emptyTitle:"लेबल की जानकारी यहाँ दिखेगी",emptyText:"तस्वीर चुनें, फिर इंटरफ़ेस देखने के लिए नमूना परिणाम खोलें।",medicineName:"दवा का नाम",notVerified:"सत्यापित नहीं",strength:"ताकत",batchNumber:"बैच नंबर",manufactureDate:"निर्माण तिथि",expiryDate:"समाप्ति तिथि",printedInstructions:"लेबल पर छपे निर्देश",instructionUnavailable:"कोई निर्देश नहीं निकाले गए। वास्तविक पैकेज देखें या फार्मासिस्ट से पूछें।",verifyTitle:"कृपया पैकेज की जाँच करें",verifyText:"यह नमूना जानकारी है, वास्तविक स्कैन नहीं। खुराक या उपचार के निर्णय के लिए इस डेमो पर भरोसा न करें।",readAloud:"आवाज़ में सुनें",askQuestion:"सवाल पूछें",scanAgain:"फिर से स्कैन करें",assistantKicker:"आपका सुलभ सहायक",assistantTitle:"अपने तरीके से पूछें।",assistantDesc:"सवाल टाइप करें या आवाज़ से पूछें। यह डेमो ऊपर दिखाए गए नमूना फ़ील्ड के बारे में जवाब देता है।",perk1:"अंग्रेज़ी और हिंदी इंटरफ़ेस",perk2:"चैट और आवाज़ इनपुट",perk3:"सुरक्षा को प्राथमिकता",demoAssistant:"डेमो सहायक · केवल नमूना जानकारी",chatMode:"चैट",voiceMode:"आवाज़ से पूछें",welcomeChat:"नमस्ते! मैं नमूना लेबल की जानकारी समझने में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?",voicePrompt:"माइक दबाएँ और बोलें",voiceHelp:"आवाज़ पहचान आपके ब्राउज़र और डिवाइस पर निर्भर करती है।",startListening:"सुनना शुरू करें",chatPlaceholder:"नमूना लेबल के बारे में पूछें…",chatDisclaimer:"जवाब उदाहरण के लिए हैं। दवा की जानकारी वास्तविक पैकेज या फार्मासिस्ट से सत्यापित करें।",howKicker:"सुलभता को ध्यान में रखकर बनाया गया",howTitle:"आसान चरण। स्पष्ट जानकारी।",howDesc:"इसका उद्देश्य छपे हुए लेबल की जानकारी उपलब्ध कराना है—न कि बीमारी का निदान या दवा लिखना।",step1Title:"लेबल की तस्वीर लें",step1Desc:"दवा के पैकेज की साफ़ तस्वीर लें या अपलोड करें।",step2Title:"छपी जानकारी पढ़ें",step2Desc:"प्रस्तावित OCR प्रणाली टेक्स्ट निकालेगी और जानकारी व्यवस्थित करेगी।",step3Title:"सुनें या पूछें",step3Desc:"आवाज़ और चैट की मदद से लेबल की जानकारी समझें।",step4Title:"अनिश्चितता की जाँच करें",step4Desc:"यदि टेक्स्ट स्पष्ट नहीं है, तो दोबारा तस्वीर लें या योग्य विशेषज्ञ से जाँच कराएँ।",safetyHeading:"जानकारी पढ़ने में मदद—चिकित्सकीय निर्णय नहीं।",safetyBody:"SafeMeds AI लेबल की तस्वीर से छपा टेक्स्ट निकालने के लिए OCR का उपयोग करता है। OCR नाम, ताकत, बैच नंबर और तारीखें गलत पढ़ सकता है; यह दवा की असलियत सत्यापित नहीं करता, खुराक की सलाह नहीं देता और दवा की सुरक्षा तय नहीं करता। हर परिणाम को वास्तविक पैकेज से मिलाएँ और ज़रूरत पड़ने पर फार्मासिस्ट या डॉक्टर से सलाह लें।",prototypeLabel:"प्रोटोटाइप सूचना",footerText:"सुलभता के लिए बनाया गया। सत्यापन को ध्यान में रखकर डिज़ाइन किया गया।",backTop:"ऊपर जाएँ ↑",footerPrototype:"छात्र परियोजना प्रोटोटाइप"
 }
};
function tr(key){return (translations[state.language]&&translations[state.language][key])||translations.en[key]||key}
function setLanguage(lang){
 state.language=lang;document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;const value=tr(key);if(value)el.textContent=value});
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>el.placeholder=tr(el.dataset.i18nPlaceholder));
 $("chatLangNote").textContent=lang==="hi"?"हिन्दी":"English";
 if($("chatInput")) $("chatInput").dir=lang==="hi"?"auto":"auto";
}
$("languageSelect").addEventListener("change",e=>{setLanguage(e.target.value);showToast(e.target.value==="hi"?"भाषा हिंदी में बदल दी गई।":"Language changed to English.");});
$("contrastBtn").addEventListener("click",()=>{document.body.classList.toggle("high-contrast");showToast(document.body.classList.contains("high-contrast")?"High contrast enabled":"High contrast disabled")});
$("menuBtn").addEventListener("click",()=>{$("main-nav")?.classList.toggle("open");document.querySelector(".main-nav").classList.toggle("open")});
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
let toastTimer;
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2800)}
function chooseFile(){ $("fileInput").click() }
$("dropzone").addEventListener("click",chooseFile);
$("dropzone").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();chooseFile()}});
$("fileInput").addEventListener("change",e=>{
 const file=e.target.files&&e.target.files[0]; if(!file)return;
 if(!file.type.startsWith("image/")){showToast("Please choose an image file.");return}
 if(file.size>8*1024*1024){showToast(state.language==="hi"?"कृपया 8 MB से छोटी तस्वीर चुनें।":"Please choose an image smaller than 8 MB.");return}
 state.hasImage=true;state.selectedFile=file;state.scanData=null;
 $("previewImg").src=URL.createObjectURL(file);$("fileName").textContent=file.name;
 $("imagePreview").classList.remove("hidden");$("dropzone").classList.add("hidden");
 showToast(state.language==="hi"?"तस्वीर चुनी गई। OCR स्कैन के लिए तैयार है।":"Image selected. Ready to run OCR.");
});
const dz=$("dropzone");["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("dragging")}));["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("dragging")}));dz.addEventListener("drop",e=>{const f=e.dataTransfer.files[0];if(f&&f.type.startsWith("image/")){const dt=new DataTransfer();dt.items.add(f);$("fileInput").files=dt.files;$("fileInput").dispatchEvent(new Event("change"))}});
function resetImage(){state.hasImage=false;state.selectedFile=null;state.scanData=null;$("fileInput").value="";$("previewImg").removeAttribute("src");$("imagePreview").classList.add("hidden");$("dropzone").classList.remove("hidden")}
$("removeImage").addEventListener("click",resetImage);
$("scanBtn").addEventListener("click", async ()=>{
 if(!state.selectedFile){showToast(state.language==="hi"?"पहले लेबल की तस्वीर चुनें।":"Please choose a label image first.");return}
 if(!API_BASE_URL && window.location.protocol !== "file:"){
   showToast(state.language==="hi"?"पहले script.js में API_BASE_URL को अपने Render backend URL से सेट करें।":"Set API_BASE_URL in script.js to your deployed FastAPI URL first.");
   return;
 }
 const button=$("scanBtn");const originalHTML=button.innerHTML;button.disabled=true;
 button.setAttribute("aria-busy","true");
 button.innerText=state.language==="hi"?"स्कैन हो रहा है…":"Scanning image…";
 try{
   const formData=new FormData();formData.append("file",state.selectedFile);
   const base=API_BASE_URL.replace(/\/$/,"");
   const response=await fetch(`${base}/api/scan`,{method:"POST",body:formData});
   let payload={};try{payload=await response.json()}catch(_){}
   if(!response.ok)throw new Error(payload.detail||`Scan failed (${response.status}).`);
   state.scanData=payload;state.resultVisible=true;
   const fields=payload.fields||{};
   $("medName").textContent=fields.medicine_name||"Not detected — verify manually";
   $("medType").textContent=payload.warning||"OCR text extracted; not medically verified.";
   $("medStrength").textContent=fields.strength||"Not detected — verify manually";
   $("medBatch").textContent=fields.batch_number||"Not detected";
   $("medMfg").textContent=fields.manufacturing_date||"Not detected";
   $("medExpiry").textContent=fields.expiry_date||"Not detected";
   $("medInstructions").textContent=fields.printed_instructions||"No clear instructions detected. Check the actual package or ask a pharmacist.";
   let raw=$("ocrRawText");
   if(!raw){
     raw=document.createElement("details");raw.id="ocrRawText";raw.className="ocr-raw-text";
     const summary=document.createElement("summary");summary.textContent="View all text detected by OCR";
     const pre=document.createElement("pre");pre.id="ocrRawTextContent";pre.style.whiteSpace="pre-wrap";pre.style.overflowWrap="anywhere";
     raw.append(summary,pre);
     $("resultContent").appendChild(raw);
   }
   $("ocrRawTextContent").textContent=payload.raw_text||"No text detected. Try a clearer photo.";
   $("emptyResult").classList.add("hidden");$("resultContent").classList.remove("hidden");
   $("results").scrollIntoView({behavior:"smooth",block:"center"});
   showToast(payload.raw_text? (state.language==="hi"?"OCR पूरा हुआ। हर फ़ील्ड की पैकेज से जाँच करें।":"OCR complete. Verify every field against the package.") : (state.language==="hi"?"कोई टेक्स्ट नहीं मिला। साफ़ तस्वीर आज़माएँ।":"No text detected. Try a clearer image."));
 }catch(err){
   console.error("SafeMeds OCR error:",err);
   showToast(err.message||"Could not scan image. Check the backend URL and try again.");
 }finally{
   button.disabled=false;button.removeAttribute("aria-busy");button.innerHTML=originalHTML;
 }
});
$("scanAgainBtn").addEventListener("click",()=>{resetImage();state.resultVisible=false;$("resultContent").classList.add("hidden");$("emptyResult").classList.remove("hidden");$("scanner").scrollIntoView({behavior:"smooth"});});
function speakText(text){if(!("speechSynthesis" in window)){showToast("Text-to-speech is not supported in this browser.");return}window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(text);utter.lang=state.language==="hi"?"hi-IN":"en-IN";utter.rate=.92;window.speechSynthesis.speak(utter)}
$("readBtn").addEventListener("click",()=>{
 const f=state.scanData&&state.scanData.fields;
 if(!f){showToast(state.language==="hi"?"पहले OCR स्कैन करें।":"Scan a label first to read its extracted details.");return}
 const parts=[
   state.language==="hi"?"दवा का नाम":"Medicine name",f.medicine_name,
   state.language==="hi"?"ताकत":"Strength",f.strength,
   state.language==="hi"?"बैच नंबर":"Batch number",f.batch_number,
   state.language==="hi"?"निर्माण तिथि":"Manufacturing date",f.manufacturing_date,
   state.language==="hi"?"समाप्ति तिथि":"Expiry date",f.expiry_date,
   state.language==="hi"?"छपे निर्देश":"Printed instructions",f.printed_instructions,
   state.language==="hi"?"कृपया वास्तविक पैकेज से जानकारी सत्यापित करें।":"Please verify all details against the actual package."
 ].filter(Boolean).join(". ");
 speakText(parts);
});
$("askBtn").addEventListener("click",()=>{$("assistant").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("chatInput").focus(),500)});
$("chatMode").addEventListener("click",()=>{ $("chatMode").classList.add("active");$("voiceMode").classList.remove("active");$("voiceBox").classList.add("hidden");$("chatForm").classList.remove("hidden");$("suggestionRow")?.classList.remove("hidden");document.querySelector(".suggestion-row").classList.remove("hidden")});
$("voiceMode").addEventListener("click",()=>{ $("voiceMode").classList.add("active");$("chatMode").classList.remove("active");$("voiceBox").classList.remove("hidden");$("chatForm").classList.remove("hidden");document.querySelector(".suggestion-row").classList.add("hidden")});
$("inlineMic").addEventListener("click",()=>{$("voiceMode").click();$("voiceBox").scrollIntoView({behavior:"smooth",block:"center"})});
function addMessage(text,who){const wrap=document.createElement("div");wrap.className="message "+(who==="user"?"user-message":"bot-message");const avatar=document.createElement("div");avatar.className="message-avatar";avatar.textContent=who==="user"?"●":"✦";const bubble=document.createElement("div");bubble.className="bubble";const p=document.createElement("p");p.textContent=text;bubble.appendChild(p);if(who==="bot"){const small=document.createElement("small");small.textContent="SafeMeds AI · Demo";bubble.appendChild(small)}wrap.append(avatar,bubble);$("chatMessages").appendChild(wrap);$("chatMessages").scrollTop=$("chatMessages").scrollHeight}
function answerQuestion(q){
 const s=q.toLowerCase();
 const fields=state.scanData&&state.scanData.fields;
 const isHi=state.language==="hi";
 if(/dose|dosage|how much|how often|should i take|safe for me|side effect|खुराक|कितनी मात्रा|कितनी बार|सुरक्षित है/.test(s))
   return isHi?"मैं OCR के आधार पर खुराक, दवा की सुरक्षा या दुष्प्रभाव की सलाह नहीं दे सकता। पैकेज के निर्देशों की पुष्टि फार्मासिस्ट या डॉक्टर से करें।":"I can't recommend a dose or determine medicine safety or side effects from OCR. Confirm the package instructions with a pharmacist or clinician.";
 if(!fields)
   return isHi?"पहले लेबल स्कैन करें। मैं केवल तस्वीर से निकाले गए टेक्स्ट के बारे में बता सकता हूँ; दवा की सुरक्षा या खुराक पर सलाह नहीं दे सकता।":"Please scan a label first. I can discuss text extracted from the image, but I can't advise on dosage or medicine safety.";
 const value=(key)=>fields[key]|| (isHi?"OCR में नहीं मिला":"Not detected by OCR");
 if(/hindi|हिंदी|हिन्दी|translate|हिन्दी में|हिंदी में/.test(s))
   return isHi?"यह OCR से निकाला गया टेक्स्ट है। कृपया इसे वास्तविक पैकेज से मिलाएँ; OCR की गलतियाँ संभव हैं।":"The scan may contain English or Hindi text. Review the full OCR text and compare it with the package; OCR can make mistakes.";
 if(/expiry|expire|expiration|समाप्त|एक्सपायरी/.test(s))
   return (isHi?"OCR में मिली समाप्ति तिथि: ":"Expiry date detected by OCR: ")+value("expiry_date")+". "+(isHi?"पैकेज से सत्यापित करें।":"Verify it against the package.");
 if(/strength|mg|ताकत|मात्रा/.test(s))
   return (isHi?"OCR में मिली ताकत: ":"Strength detected by OCR: ")+value("strength")+". "+(isHi?"यह पुष्टि नहीं है; पैकेज से मिलाएँ।":"This is not verified; compare with the package.");
 if(/batch|बैच/.test(s))
   return (isHi?"OCR में मिला बैच नंबर: ":"Batch number detected by OCR: ")+value("batch_number")+".";
 if(/instruction|direction|कैसे लें|निर्देश/.test(s))
   return (isHi?"लेबल पर पहचाने गए निर्देश: ":"Instructions detected on label: ")+value("printed_instructions")+". "+(isHi?"खुराक के लिए फार्मासिस्ट/डॉक्टर से पुष्टि करें।":"Confirm dosage with a pharmacist or clinician.");
 if(/name|medicine|दवा|नाम/.test(s))
   return (isHi?"OCR में पहचाना गया नाम: ":"Name detected by OCR: ")+value("medicine_name")+". "+(isHi?"इसे पैकेज से मिलाएँ।":"Compare it with the package.");
 return isHi?"मैं OCR से निकाली गई जानकारी समझाने में मदद कर सकता हूँ। OCR गलत हो सकता है; दवा की खुराक या सुरक्षा के लिए फार्मासिस्ट या डॉक्टर से पूछें।":"I can help you review the text extracted by OCR. OCR can be wrong; ask a pharmacist or clinician about dosage or safety.";
}
function sendQuestion(q){const question=q.trim();if(!question)return;addMessage(question,"user");$("chatInput").value="";setTimeout(()=>{const answer=answerQuestion(question);addMessage(answer,"bot");if(state.language==="hi"){}},250)}
$("chatForm").addEventListener("submit",e=>{e.preventDefault();sendQuestion($("chatInput").value)});
document.querySelectorAll(".suggestion").forEach(btn=>btn.addEventListener("click",()=>{const q=btn.dataset.question==="expiry"?"What is the expiry date?":btn.dataset.question==="strength"?"What is the strength?":"Explain this in Hindi";sendQuestion(q)}));
$("clearChat").addEventListener("click",()=>{$("chatMessages").innerHTML="";addMessage(tr("welcomeChat"),"bot")});
$("micBtn").addEventListener("click",()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){$("voiceStatus").textContent=state.language==="hi"?"इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। चैट में टाइप करें।":"Speech recognition isn't available in this browser. Please type your question instead.";showToast("Voice input isn't supported here.");return}try{if(state.recognition){state.recognition.stop()}const r=new SR();state.recognition=r;r.lang=state.language==="hi"?"hi-IN":"en-IN";r.interimResults=false;r.maxAlternatives=1;$("voiceStatus").textContent=state.language==="hi"?"सुन रहे हैं…":"Listening…";r.onresult=e=>{const transcript=e.results[0][0].transcript;$("chatInput").value=transcript;$("voiceStatus").textContent=(state.language==="hi"?"आपने कहा: ":"You said: ")+transcript;sendQuestion(transcript)};r.onerror=e=>{$("voiceStatus").textContent=state.language==="hi"?"आवाज़ नहीं पहचान पाए। फिर कोशिश करें या टाइप करें।":"Couldn't recognize speech. Try again or type your question.";};r.onend=()=>{if(!$("voiceStatus").textContent)$("voiceStatus").textContent=""};r.start()}catch(err){$("voiceStatus").textContent="Voice input could not start. Please type instead."}});
setLanguage("en");
